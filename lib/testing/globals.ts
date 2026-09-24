import ts from "typescript";

/**
 * The ways a file can reach a browser global without naming it, found on the
 * TypeScript AST (bead hq-3pfhe.7).
 *
 * Two guards share this: lib/onscreen.test.ts, repo-wide, and the demo source
 * rules in components/pages/demos/contract/source.ts. Both exist to say
 * something about IntersectionObserver, and both were walked around the same
 * way by the s-5836 review: window[key] with key a const string,
 * window["Intersection" + "Observer"], and Reflect.construct. Following each
 * new indirection is the race a checker loses, so this does not follow them.
 * It refuses them: a global is read by a name a parser can see, or the file
 * fails. Nothing in app/, components/ or lib/ needed any of these shapes
 * when the rule landed.
 */

/* top, parent and frames are globals too, and are also what half the canvas
   code calls a local; they are caught as window.top and friends below. */
const GLOBALS = new Set(["window", "globalThis", "self"]);
const WINDOWS = new Set(["window", "globalThis", "self", "top", "parent", "frames", "opener"]);

export const where = (sf: ts.SourceFile, node: ts.Node) =>
  "line " + (sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1);

/** Through the wrappers that change a type and not a value. */
export const unwrap = (node: ts.Expression): ts.Expression => {
  let n = node;
  while (
    ts.isParenthesizedExpression(n) ||
    ts.isAsExpression(n) ||
    ts.isNonNullExpression(n) ||
    ts.isTypeAssertionExpression(n) ||
    ts.isSatisfiesExpression(n)
  ) {
    n = n.expression;
  }
  return n;
};

/** The node a value is used as, climbing out of the same wrappers. */
const wrapped = (node: ts.Node): ts.Node => {
  let n = node;
  while (
    n.parent &&
    (ts.isParenthesizedExpression(n.parent) ||
      ts.isAsExpression(n.parent) ||
      ts.isNonNullExpression(n.parent) ||
      ts.isTypeAssertionExpression(n.parent) ||
      ts.isSatisfiesExpression(n.parent))
  ) {
    n = n.parent;
  }
  return n;
};

const isLiteralKey = (node: ts.Expression) =>
  ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node);

/** True where an identifier is a value being read, not a name being given. */
export const isValueUse = (id: ts.Identifier): boolean => {
  const p = id.parent;
  if (ts.isPropertyAccessExpression(p) && p.name === id) return false;
  if (ts.isPropertyAssignment(p) && p.name === id) return false;
  if (ts.isBindingElement(p) && p.propertyName === id) return false;
  if (ts.isJsxAttribute(p)) return false;
  if (ts.isTypeReferenceNode(p) || ts.isTypeQueryNode(p) || ts.isQualifiedName(p)) return false;
  if (ts.isPropertySignature(p) || ts.isMethodSignature(p) || ts.isPropertyDeclaration(p)) return false;
  if (ts.isImportSpecifier(p) || ts.isExportSpecifier(p)) return false;
  return true;
};


/** Every place `sf` reaches, or could reach, a global by a name that is not
    in the source, as sentences. */
export const globalEscapes = (sf: ts.SourceFile): string[] => {
  const found: string[] = [];
  const visit = (n: ts.Node) => {
    if (ts.isPropertyAccessExpression(n) && n.name.text === "defaultView") {
      found.push(where(sf, n) + " reaches the window through a document, where nothing here follows it");
    }
    if (
      ts.isPropertyAccessExpression(n) &&
      WINDOWS.has(n.name.text) &&
      ts.isIdentifier(unwrap(n.expression)) &&
      GLOBALS.has((unwrap(n.expression) as ts.Identifier).text)
    ) {
      found.push(where(sf, n) + " reaches the window through itself, where nothing here follows it");
    }
    if (ts.isIdentifier(n) && n.text === "Reflect" && isValueUse(n)) {
      found.push(where(sf, n) + " uses Reflect, which reaches any global without naming it");
    }
    /* code built from a string reaches anything, and nothing can read it:
       Function("return Inter" + "sectionObserver")(), window.eval(...) */
    if (ts.isIdentifier(n) && (n.text === "eval" || n.text === "Function")) {
      const p = n.parent;
      const asProperty = ts.isPropertyAccessExpression(p) && p.name === n;
      if (asProperty || isValueUse(n)) {
        found.push(where(sf, n) + " uses " + n.text + ", which runs code no check can read");
      }
    }
    if (ts.isIdentifier(n) && GLOBALS.has(n.text) && isValueUse(n)) {
      const use = wrapped(n);
      const p = use.parent;
      const named = ts.isPropertyAccessExpression(p) && p.expression === use;
      const keyed =
        ts.isElementAccessExpression(p) && p.expression === use && isLiteralKey(p.argumentExpression);
      const asked = ts.isTypeOfExpression(p);
      /* "X" in window: a question with a literal in it */
      const probed =
        ts.isBinaryExpression(p) &&
        p.operatorToken.kind === ts.SyntaxKind.InKeyword &&
        p.right === use &&
        isLiteralKey(p.left);
      if (ts.isElementAccessExpression(p) && p.expression === use && !keyed) {
        /* window["Intersection" + "Observer"], window[key]: whatever this
           reaches, no reader and no check can tell from the source */
        found.push(where(sf, n) + " reads " + n.text + "[...] with a key that is not a literal");
      } else if (!named && !keyed && !asked && !probed) {
        found.push(
          where(sf, n) + " passes " + n.text + " around as a value, where a computed key can follow it",
        );
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
};
