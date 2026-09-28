#!/usr/bin/env bash
# Adversarial review of arc/digital-onboarding: the home services card promises
# an ad campaign outcome ("new clients every week") that no campaign has measured.
# BUSINESS-PLAN.md 5.5 refuses performance guarantees; the epic DoD forbids ad
# campaign results in copy. Expected: no hit (exit 0). Actual on the branch: two
# dictionary lines and both rendered locales carry it (exit 1).
cd "$(dirname "$0")/../../.." || exit 2
hits=$(grep -n "every week, measured\|cada semana, medidos" lib/i18n/home.ts)
if [ -n "$hits" ]; then
  echo "FAIL: ad outcome promise in lib/i18n/home.ts:"; echo "$hits"
  if [ -n "$REVIEW_BASE" ]; then
    for p in /es /en; do
      curl -s "$REVIEW_BASE$p" | sed 's/<[^>]*>/ /g' | grep -o "New clients every week, measured\|Clientes nuevos cada semana, medidos" | sed "s|^|  rendered $p: |"
    done
  fi
  exit 1
fi
echo "PASS: no ad outcome promise in home.ts"
