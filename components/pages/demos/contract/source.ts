import ts from "typescript";
import { globalEscapes, unwrap, where } from "../../../../lib/testing/globals";

/**
 * The four things about a demo's SOURCE that stay worth asserting once the
 * mechanism in ../stage owns the rest (bead hq-3pfhe.7).
 *
 * They read the TypeScript AST, the way lib/onscreen.test.ts does, and never
 * the text. The rules these replace read comment-stripped text through a
 * regex, and the s-5836 review showed what that is worth: a pair of string
 * literals holding the comment delimiters erased every line between them from
 * the checked source, forbidden spellings included, and one template literal
 * naming every pinned spelling satisfied all the positive checks at once.
 * There is no stripper here to fool, because a parser does not confuse a
 * string with a comment, and no spelling to pin, because nothing below asks
 * what a thing is called.
 *
 * Each rule returns the problems it found, as sentences. Behaviour is judged
 * by ./checks.tsx on a mounted component; this file only covers branches a
 * mount may not reach and the reflective ways around the mount's stand-ins.
 */

export interface SourceRuleContext {
  /** The class every hotspot carries, which the frame's noscript rule hides. */
  hotspot: string;
  /** Class selectors of the ghost boxes, as the stylesheet defines them. */
  ghostBoxes: string[];
}

const LIVE_ROLES = new Set(["status", "alert", "log", "marquee", "timer"]);
const OPERABLE = new Set(["button", "a", "input", "select", "textarea", "summary"]);

const parse = (file: string, text: string) =>
  ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/** The static text a className starts with: "a b", "a" + x, `a ${x}`. */
const classPrefix = (init: ts.JsxAttributeValue | undefined): string | null => {
  if (!init) return null;
  if (ts.isStringLiteral(init)) return init.text;
  if (!ts.isJsxExpression(init) || !init.expression) return null;
  let e = unwrap(init.expression);
  while (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    e = unwrap(e.left);
  }
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
  if (ts.isTemplateExpression(e)) return e.head.text;
  return null;
};

const attr = (el: ts.JsxOpeningLikeElement, name: string) =>
  el.attributes.properties.find(
    (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText() === name,
  );

const literal = (a: ts.JsxAttribute | undefined): string | null => {
  const init = a?.initializer;
  if (!init) return null;
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression) {
    const e = unwrap(init.expression);
    if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return e.text;
  }
  return null;
};

const openings = (sf: ts.SourceFile): ts.JsxOpeningLikeElement[] => {
  const out: ts.JsxOpeningLikeElement[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) out.push(n);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
};

export const sourceRules: Record<
  string,
  (file: string, text: string, ctx: SourceRuleContext) => string[]
> = {
  "reaches no global by a computed name, and names no observer": (file, text) => {
    const sf = parse(file, text);
    const found = globalEscapes(sf);
    /* The observer a demo needs is the one in ./motion, which has no motion
       argument to get wrong. Identifier, property name or string: a parser
       sees all three, and a comment is none of them. */
    const visit = (n: ts.Node) => {
      if ((ts.isIdentifier(n) || ts.isStringLiteralLike(n)) && n.text.includes("IntersectionObserver")) {
        found.push(where(sf, n) + " names IntersectionObserver");
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
    return found;
  },

  "puts nothing operable on the page but a hotspot": (file, text, ctx) => {
    const sf = parse(file, text);
    const found: string[] = [];
    for (const el of openings(sf)) {
      const tag = el.tagName.getText(sf);
      const intrinsic = /^[a-z]/.test(tag);
      if (!intrinsic) continue;
      const role = attr(el, "role");
      const operable =
        OPERABLE.has(tag) ||
        (role && (literal(role) === null || literal(role) === "button")) ||
        attr(el, "onClick") ||
        attr(el, "tabIndex");
      if (!operable) continue;
      if (el.attributes.properties.some((p) => ts.isJsxSpreadAttribute(p))) {
        found.push(where(sf, el) + " <" + tag + "> spreads its props, so its class cannot be read");
        continue;
      }
      const cls = classPrefix(attr(el, "className")?.initializer);
      if (cls === null || cls.split(/\s+/)[0] !== ctx.hotspot) {
        found.push(
          where(sf, el) + " <" + tag + "> does not carry ." + ctx.hotspot +
            ", so the noscript rule leaves it on a page where it cannot answer; render a <Hotspot>",
        );
      }
    }
    return found;
  },

  "announces nothing from outside a ghost box": (file, text, ctx) => {
    const sf = parse(file, text);
    const boxes = ctx.ghostBoxes.map((s) => s.replace(/^\./, ""));
    const found: string[] = [];
    const inBox = (el: ts.Node): boolean => {
      for (let n = el.parent; n; n = n.parent) {
        if (!ts.isJsxElement(n)) continue;
        const cls = classPrefix(attr(n.openingElement, "className")?.initializer);
        if (cls !== null && cls.split(/\s+/).some((c) => boxes.includes(c))) return true;
      }
      return false;
    };
    for (const el of openings(sf)) {
      const role = attr(el, "role");
      const live =
        attr(el, "aria-live") ||
        (role && (literal(role) === null || LIVE_ROLES.has(literal(role)!)));
      if (!live) continue;
      const owner = ts.isJsxOpeningElement(el) ? el.parent : el;
      if (!inBox(owner)) {
        found.push(
          where(sf, el) + " <" + el.tagName.getText(sf) +
            "> is a live region outside a ghost box: what is announced changes, and what changes needs its box held open; render a <PickBox>",
        );
      }
    }
    return found;
  },

  "is drawn in the shared frame, which derives its own noscript": (file, text) => {
    const sf = parse(file, text);
    const found: string[] = [];
    let imported = false;
    for (const st of sf.statements) {
      if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
      if (!/^\.\/stage\/DemoFigure$/.test(st.moduleSpecifier.text)) continue;
      const named = st.importClause?.namedBindings;
      if (named && ts.isNamedImports(named)) {
        imported ||= named.elements.some((e) => (e.propertyName ?? e.name).text === "DemoFigure");
      }
    }
    const tags = openings(sf).map((el) => el.tagName.getText(sf));
    if (!imported || !tags.includes("DemoFigure")) {
      found.push("does not render <DemoFigure> from ./stage/DemoFigure");
    }
    /* The frame builds the noscript rule from the elements it renders. A
       hand-written one is a hand-written list, and the s-5836 fixture kept its
       list honest by renaming what it should have named. */
    for (const el of openings(sf)) {
      const tag = el.tagName.getText(sf);
      if (tag === "noscript" || tag === "style") {
        found.push(where(sf, el) + " writes its own <" + tag + ">");
      }
    }
    return found;
  },
};

/** The names of the rules `text` breaks, for the loophole fixtures. */
export const broken = (file: string, text: string, ctx: SourceRuleContext): string[] =>
  Object.entries(sourceRules)
    .filter(([, rule]) => rule(file, text, ctx).length > 0)
    .map(([name]) => name);
