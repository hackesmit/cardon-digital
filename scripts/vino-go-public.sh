#!/usr/bin/env bash
# vino-go-public.sh: take the wine brand public on its own domain (bead hq-60dkt).
#
#   scripts/vino-go-public.sh <domain> "<Name>"            # dry plan, changes nothing
#   scripts/vino-go-public.sh <domain> "<Name>" --apply    # do it and verify
#   scripts/vino-go-public.sh <domain> "<Name>" --verify   # only the checks
#
# What it does, in order (docs/BRANDS.md, "The two Vercel projects"):
#   0. checks the Vercel token is hackesmit's (PERSONAL team hackesmits-projects),
#      that the domain is registered (RDAP or whois.mx), and that lib/brand.ts
#      on origin/main already names the brand <Name> (the rename is a one-line
#      commit, VINO_NAME, merged before this runs, so the name stays in git);
#   1. adds <domain> and www.<domain> to the Vercel project cardon-vino, www
#      redirecting to the apex, and prints the DNS records Vercel asks for;
#   2. sets NEXT_PUBLIC_SITE_URL=https://<domain> on cardon-vino (production):
#      the brand becomes indexable (lib/brand-env.mjs) and cardon-vino.vercel.app
#      starts answering 308 to the domain (vinoHostRedirects);
#   3. sets NEXT_PUBLIC_VINO_URL=https://<domain> on cardon-digital (production):
#      cardondigital.com 301s the moved wine routes there (lib/routes.ts);
#   4. redeploys both projects from GitHub main and waits for READY;
#   5. verifies: certificate, 200 and no noindex on the domain, a sitemap that
#      lists the domain, the title naming <Name>, the vercel.app 308, and the
#      cardondigital.com winery route 301.
#
# A name under cardondigital.com (vino.cardondigital.com, bead hq-yj0hq: the
# wine division on the domain Cardon already owns) is accepted too: no www
# name is added for it, the registration check reads cardondigital.com, and
# the DNS record to set is a CNAME.
#
# It never buys a domain and never edits DNS at the registrar: buying is
# Daniel's pick (asked on hq-60dkt), and the registrar step runs in a browser
# (ops/reference/credentials-map.md, Namecheap note of 2026-11-12). Run step 1
# first (--apply stops at the DNS check and says what to set), set the records,
# then run --apply again: every step is idempotent.
#
# Revert: delete NEXT_PUBLIC_VINO_URL on cardon-digital and NEXT_PUBLIC_SITE_URL
# on cardon-vino, redeploy both; the wine routes come back to cardondigital.com
# and the wine site is noindex on its Vercel address again.
set -euo pipefail

DOMAIN="${1:-}"; NAME="${2:-}"; MODE="${3:-plan}"
if [ -z "$DOMAIN" ] || [ -z "$NAME" ] || [[ ! "$MODE" =~ ^(plan|--apply|--verify)$ ]]; then
  sed -n '2,6p' "$0" >&2; exit 2
fi
# SUB=1: a single label under cardondigital.com, never the apex or www.
SUB=0
if [[ "$DOMAIN" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?\.cardondigital\.com$ ]] && [ "$DOMAIN" != www.cardondigital.com ]; then SUB=1; fi
if [[ ! "$DOMAIN" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] || [[ "$DOMAIN" == *vercel.app ]] \
   || { [ "$SUB" = 0 ] && [[ "$DOMAIN" == *cardondigital.com ]]; }; then
  echo "vino-go-public: '$DOMAIN' is not the wine brand's own domain" >&2; exit 2
fi
REG="$DOMAIN"; [ "$SUB" = 1 ] && REG=cardondigital.com
ORIGIN="https://$DOMAIN"
TEAM="team_GviTdEw902mIYP94kxVOSAiV"   # hackesmits-projects (personal)
REPO_ID=1342475969                     # github.com/hackesmit/cardon-digital
VINO=cardon-vino; CARDON=cardon-digital
FALLBACK=cardon-vino.vercel.app

say() { printf '%s\n' "$*"; }
fail() { printf 'vino-go-public: FAIL %s\n' "$*" >&2; exit 1; }

TOK="${VERCEL_TOKEN:-}"
if [ -z "$TOK" ]; then
  TOK="$(PROTON_PASS_AGENT_REASON="hq-60dkt wine brand go-public" pp item view \
    --vault-name "Imported on 2026-07-13 at 14.56.53" --item-title "Vercel API Key" --field "API Key" 2>/dev/null || true)"
fi
[ -n "$TOK" ] || fail "no Vercel token (VERCEL_TOKEN or Proton Pass 'Vercel API Key')"
api() { curl -sS --max-time 60 -H "Authorization: Bearer $TOK" -H 'Content-Type: application/json' "$@"; }

# ---- 0. preconditions ------------------------------------------------------
who="$(api https://api.vercel.com/v2/user | jq -r '.user.username // empty')" || fail "asking Vercel whose token this is"
[ "$who" = "hackesmit" ] || fail "Vercel token belongs to '$who', not hackesmit"
say "0. vercel whoami: $who (team hackesmits-projects)"

# registered: prints yes, no or unknown. "yes" needs positive evidence (an RDAP
# 200, or a whois.mx "Domain Name:" line); "no" needs a definite answer (RDAP
# 404, whois.mx No_Se_Encontro); anything else (no whois, an error, an empty
# answer, an unreachable RDAP) is unknown, and unknown stops the script.
registered() {
  local out code
  case "$REG" in
    *.mx)
      command -v whois >/dev/null 2>&1 || { echo unknown; return; }
      out="$(whois -h whois.mx "$REG" 2>/dev/null)" || { echo unknown; return; }
      if grep -q "No_Se_Encontro" <<<"$out"; then echo no
      elif grep -qi "^Domain Name:[[:space:]]*$REG[[:space:]]*$" <<<"$out"; then echo yes
      else echo unknown; fi ;;
    *)
      local url="https://rdap.org/domain/$REG"
      [[ "$REG" == *.com ]] && url="https://rdap.verisign.com/com/v1/domain/$REG"
      code="$(curl -sL --max-time 30 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null)" || code="${code:-000}"
      case "$code" in 200) echo yes ;; 404) echo no ;; *) echo unknown ;; esac ;;
  esac
}
case "$(registered)" in
  yes) say "   $REG is registered" ;;
  no) [ "$MODE" = plan ] && say "   $DOMAIN is NOT registered yet: buy it first (Daniel's pick, hq-60dkt)" || fail "$DOMAIN is not registered: buy it first" ;;
  *) fail "cannot tell whether $DOMAIN is registered (whois or RDAP gave no clear answer): check by hand, then rerun" ;;
esac

main_name="$(gh api repos/hackesmit/cardon-digital/contents/lib/brand.ts --jq .content 2>/dev/null | base64 -d | sed -n 's/^export const VINO_NAME = "\(.*\)";$/\1/p')" \
  || fail "reading lib/brand.ts on main with gh"
if [ "$main_name" = "$NAME" ]; then say "   lib/brand.ts on main names the brand $NAME"; else
  msg="lib/brand.ts on main says VINO_NAME = \"$main_name\", not \"$NAME\": merge the rename first"
  [ "$MODE" = plan ] && say "   $msg" || [ "$MODE" = --verify ] || fail "$msg"
fi

if [ "$MODE" = plan ]; then
  say "plan (nothing changed):"
  if [ "$SUB" = 1 ]; then say "  1. add $DOMAIN to $VINO; print the DNS record to set"
  else say "  1. add $DOMAIN and www.$DOMAIN (308 to apex) to $VINO; print the DNS records to set"; fi
  say "  2. $VINO production NEXT_PUBLIC_SITE_URL=$ORIGIN"
  say "  3. $CARDON production NEXT_PUBLIC_VINO_URL=$ORIGIN"
  say "  4. redeploy $VINO and $CARDON from main, wait for READY"
  say "  5. verify certificate, indexable 200, sitemap, title, $FALLBACK 308, cardondigital.com winery 301"
  exit 0
fi

# ---- 1. domains on cardon-vino ---------------------------------------------
add_domain() { # name [redirect]
  local body; body="$(jq -nc --arg n "$1" --arg r "${2:-}" '{name:$n} + (if $r=="" then {} else {redirect:$r, redirectStatusCode:308} end)')" || fail "building the $1 domain request"
  local res; res="$(api -X POST "https://api.vercel.com/v10/projects/$VINO/domains?teamId=$TEAM" -d "$body")" || fail "adding $1: no answer from Vercel"
  local code; code="$(jq -r '.error.code // "ok"' <<<"$res" 2>/dev/null)" || fail "adding $1: Vercel answered something that is not JSON"
  case "$code" in ok|domain_already_in_use_by_project|domain_already_exists) say "   $1: on $VINO" ;;
    *) [ "$(api "https://api.vercel.com/v9/projects/$VINO/domains/$1?teamId=$TEAM" | jq -r '.name // empty')" = "$1" ] \
         && say "   $1: on $VINO" || fail "adding $1: $(jq -r '.error.message' <<<"$res")" ;;
  esac
}
if [ "$MODE" = --apply ]; then
  say "1. domains"
  add_domain "$DOMAIN"
  NAMES=("$DOMAIN")
  if [ "$SUB" = 0 ]; then add_domain "www.$DOMAIN" "$DOMAIN"; NAMES+=("www.$DOMAIN"); fi
  bad=0
  for d in "${NAMES[@]}"; do
    cfg="$(api "https://api.vercel.com/v6/domains/$d/config?teamId=$TEAM")" || fail "reading the DNS config of $d"
    misc="$(jq -r '.misconfigured' <<<"$cfg" 2>/dev/null)" || fail "reading the DNS config of $d: not JSON"
    if [ "$misc" = "true" ]; then
      bad=1
      if [ "$d" = "$DOMAIN" ] && [ "$SUB" = 0 ]; then say "   DNS to set: $d  A  $(jq -r '[.recommendedIPv4[]?.value[]?] | first // "76.76.21.21"' <<<"$cfg")"
      else say "   DNS to set: $d  CNAME  $(jq -r '[.recommendedCNAME[]?.value] | first // "cname.vercel-dns.com"' <<<"$cfg")"; fi
    else say "   $d: DNS points at Vercel"; fi
  done
  [ "$bad" = 0 ] || { say "Set those records at the registrar, then run --apply again."; exit 3; }

  # ---- 2 and 3. environment ------------------------------------------------
  # set_env never removes the variable: an existing production entry is
  # updated in place (PATCH its id); a missing one is created with POST
  # ?upsert=true. Every call and every answer is checked, so a failure stops
  # here with the old value still set (hq-rbdwt, review B1 of hq-60dkt).
  set_env() { # project key value
    local list id res ok
    list="$(api "https://api.vercel.com/v9/projects/$1/env?teamId=$TEAM")" || fail "listing the env of $1: no answer from Vercel (nothing changed)"
    id="$(jq -r --arg k "$2" 'if (.envs | type) == "array" then ([.envs[] | select(.key==$k and ((.target // []) | index("production")))][0].id // "") else error("no envs") end' <<<"$list" 2>/dev/null)" \
      || fail "listing the env of $1: $(jq -r '.error.message // "no envs list in the answer"' <<<"$list" 2>/dev/null || echo "answer is not JSON") (nothing changed)"
    if [ -n "$id" ]; then
      res="$(api -X PATCH "https://api.vercel.com/v9/projects/$1/env/$id?teamId=$TEAM" -d "$(jq -nc --arg v "$3" '{value:$v}')")" \
        || fail "updating $2 on $1: no answer from Vercel (the old value stays)"
      ok="$(jq -r '(.error == null) and ((.key // null) | type == "string")' <<<"$res" 2>/dev/null || echo false)"
    else
      res="$(api -X POST "https://api.vercel.com/v10/projects/$1/env?upsert=true&teamId=$TEAM" \
        -d "$(jq -nc --arg k "$2" --arg v "$3" '{key:$k, value:$v, type:"plain", target:["production"]}')")" \
        || fail "setting $2 on $1: no answer from Vercel"
      ok="$(jq -r '(.error == null) and ((.failed // []) | length == 0) and (.created != null) and (.created != [])' <<<"$res" 2>/dev/null || echo false)"
    fi
    [ "$ok" = true ] || fail "setting $2 on $1: $(jq -r '.error.message // .failed[0].error.message // "unexpected answer"' <<<"$res" 2>/dev/null || echo "answer is not JSON")"
    say "   $1: $2=$3 (production)"
  }
  say "2-3. environment"
  set_env "$VINO" NEXT_PUBLIC_SITE_URL "$ORIGIN"
  set_env "$CARDON" NEXT_PUBLIC_VINO_URL "$ORIGIN"

  # ---- 4. redeploy -----------------------------------------------------------
  say "4. redeploy"
  for p in "$VINO" "$CARDON"; do
    body="$(jq -nc --arg p "$p" --argjson repo "$REPO_ID" '{name:$p, project:$p, target:"production", gitSource:{type:"github", repoId:$repo, ref:"main"}}')"
    dpl="$(api -X POST "https://api.vercel.com/v13/deployments?teamId=$TEAM" -d "$body" | jq -r '.id // empty')" || fail "creating the $p deployment: no usable answer"
    [ -n "$dpl" ] || fail "creating the $p deployment"
    for _ in $(seq 1 90); do
      st="$(api "https://api.vercel.com/v13/deployments/$dpl?teamId=$TEAM" | jq -r '.readyState')" || st=POLL_ERROR
      case "$st" in READY) break ;; ERROR|CANCELED) fail "$p deployment $dpl $st" ;; esac
      sleep 10
    done
    [ "$st" = READY ] || fail "$p deployment $dpl not READY after 15 minutes"
    say "   $p: $dpl READY"
  done
fi

# ---- 5. verify -------------------------------------------------------------
say "5. verify"
ok=1
check() { if eval "$2"; then say "   ok   $1"; else say "   FAIL $1"; ok=0; fi; }
hdr="$(curl -sS -D - -o /tmp/vino-go-public.$$ "$ORIGIN/es" || true)"
check "certificate valid and $ORIGIN/es answers 200" '[[ "$(head -1 <<<"$hdr")" == *" 200"* ]]'
check "no X-Robots-Tag noindex on $ORIGIN/es" '! grep -qi "^x-robots-tag:.*noindex" <<<"$hdr"'
check "no robots noindex meta on $ORIGIN/es" '! grep -qi "<meta name=\"robots\" content=\"noindex" /tmp/vino-go-public.$$'
check "title names $NAME" 'grep -q "<title>$NAME" /tmp/vino-go-public.$$'
check "canonical is $ORIGIN/es" 'grep -q "rel=\"canonical\" href=\"$ORIGIN/es\"" /tmp/vino-go-public.$$'
check "sitemap lists $ORIGIN/es/sitios-web" 'curl -sS "$ORIGIN/sitemap.xml" | grep -q "$ORIGIN/es/sitios-web"'
check "robots.txt points at the sitemap" 'curl -sS "$ORIGIN/robots.txt" | grep -qi "sitemap: $ORIGIN/sitemap.xml"'
[ "$SUB" = 1 ] || check "www.$DOMAIN redirects to the apex" '[[ "$(curl -sS -o /dev/null -w "%{redirect_url}" "https://www.$DOMAIN/es")" == "$ORIGIN/es"* ]]'
check "$FALLBACK/es/sitios-web?x=1 answers 308 to the domain" '[[ "$(curl -sS -o /dev/null -w "%{http_code} %{redirect_url}" "https://$FALLBACK/es/sitios-web?x=1")" == "308 $ORIGIN/es/sitios-web?x=1" ]]'
check "cardondigital.com/es/industries/winery answers 301 to the domain" '[[ "$(curl -sS -o /dev/null -w "%{http_code} %{redirect_url}" "https://cardondigital.com/es/industries/winery")" == 30[18]" $ORIGIN/es/industries/winery" ]]'
rm -f /tmp/vino-go-public.$$
[ "$ok" = 1 ] && say "vino-go-public: $ORIGIN is live and indexable" || fail "verification failed (above)"
