import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { GHOST_BOXES } from "./contract/ghosts";
import { demoFiles } from "./contract/files";
import { broken, sourceRules } from "./contract/source";
import { HOTSPOT } from "./stage/useDemoStage";

/**
 * The source half of the demo contract (bead hq-3pfhe.7): AST rules over every
 * demo under this directory, subfolders included (./contract/files.ts, which
 * contract.test.tsx walks with too: a demo neither half could see was the same
 * one defect twice). What a demo DOES is contract.test.tsx, on a mounted
 * component; these cover what a mount cannot reach. See ./contract/source.ts
 * for why they parse and never grep.
 */

const here = new URL("./", import.meta.url);
const read = (rel: string) => readFileSync(new URL(rel, here), "utf8");
const ctx = { hotspot: HOTSPOT, ghostBoxes: GHOST_BOXES };

const components = demoFiles(dirname(fileURLToPath(import.meta.url)));

describe("every demo component, parsed", () => {
  it("exists", () => expect(components.length).toBeGreaterThan(0));

  it("knows the ghost boxes the stylesheet defines", () => {
    expect(GHOST_BOXES.sort()).toEqual([".demo-caption-box", ".demo-pick-box"]);
  });

  it.each(
    components.flatMap((file) => Object.keys(sourceRules).map((rule) => [file, rule] as const)),
  )("%s %s", (file, rule) => {
    expect(sourceRules[rule](file, read(file), ctx)).toEqual([]);
  });
});

describe("the shared frame", () => {
  it("imports the stylesheet, so every mount is styled", () => {
    /* Round one shipped demos.css with no importer anywhere in the tree: the
       canvas fell back to its 300px intrinsic width and all twelve hotspots
       landed off the board. The frame every demo renders carries it now. */
    const sf = ts.createSourceFile("DemoFigure.tsx", read("stage/DemoFigure.tsx"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const imports = sf.statements
      .filter(ts.isImportDeclaration)
      .map((st) => (st.moduleSpecifier as ts.StringLiteral).text);
    expect(imports).toContain("../demos.css");
  });
});

/**
 * The two s-4a6c loophole components as this directory's tests have carried
 * them since hq-3pfhe.6. contract.test.tsx has to MOUNT them, which a string
 * cannot be, so the reviewer's own files, which differ from these only by a
 * header comment, are in lib/testing/loopholes/demos; both forms are judged.
 */
const LOOPHOLE_PRODUCCION = `"use client";
import { useEffect, useRef } from "react";
import { observeOnscreen, shouldAnimate } from "./motion";
import { PHONE_MAX } from "./floor";
import "./demos.css";

export default function ProduccionDemo() {
  const ref = useRef<HTMLElement>(null);
  const cap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const phone = el.clientWidth < PHONE_MAX;
    const W = Math.round(el.getBoundingClientRect().width);
    return observeOnscreen(el, (on) => {
      if (shouldAnimate({ reduced: false, docVisible: true, onscreen: on }) && cap.current) {
        cap.current.textContent = phone ? "phone " + W : "wide " + W;
      }
    });
  }, []);
  return (
    <figure className="demo-figure" ref={ref}>
      <div className="demo-stage"><canvas className="demo-canvas" /></div>
      <div className="demo-readout"><span className="demo-caption" ref={cap} /></div>
    </figure>
  );
}
`;

const LOOPHOLE_HOSPITALIDAD = `"use client";
import { useEffect, useRef } from "react";
import { observeOnscreen } from "./motion";
import "./demos.css";

export default function HospitalidadDemo() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const IO = window.IntersectionObserver;
    const io = new IO((es) => { el.dataset.on = String(es[es.length - 1].isIntersecting); }, { threshold: [0, 0.35] });
    io.observe(el);
    const un = observeOnscreen(el, () => {});
    return () => { io.disconnect(); un(); };
  }, []);
  return <figure className="demo-figure" ref={ref} />;
}
`;

describe("the source rules are load bearing", () => {
  const GLOBAL = "reaches no global by a computed name, and names no observer";
  const OPERABLE = "puts nothing operable on the page but a hotspot";
  const LIVE = "announces nothing from outside a ghost box";
  const FRAME = "is drawn in the shared frame, which derives its own noscript";
  const fixture = (name: string) => broken(name, read("../../../lib/testing/loopholes/demos/" + name), ctx);

  it("fails the s-5836 cellar on all four", () => {
    expect(fixture("CellarDemo.tsx").sort()).toEqual([GLOBAL, OPERABLE, LIVE, FRAME].sort());
  });

  it("fails the s-5836 string demo, whose strings are strings to a parser", () => {
    /* one template literal names every spelling the old rules pinned and two
       string literals carry the comment delimiters; neither is code */
    expect(fixture("StringDemo.tsx")).toContain(FRAME);
  });

  it("fails both s-4a6c fixtures, as strings and as the reviewer's files", () => {
    expect(fixture("ProduccionDemo.tsx")).toContain(FRAME);
    expect(fixture("HospitalidadDemo.tsx")).toEqual(expect.arrayContaining([GLOBAL, FRAME]));
    expect(broken("ProduccionDemo.tsx", LOOPHOLE_PRODUCCION, ctx)).toContain(FRAME);
    expect(broken("HospitalidadDemo.tsx", LOOPHOLE_HOSPITALIDAD, ctx)).toEqual(
      expect.arrayContaining([GLOBAL, FRAME]),
    );
  });

  /* each shape on its own, so a rule cannot lean on its neighbour */
  const demo = (body: string, jsx = "<DemoFigure />") =>
    'import { DemoFigure } from "./stage/DemoFigure";\n' +
    "export default function D() {\n" + body + "\n  return " + jsx + ";\n}\n";

  it.each([
    ['const k = "IntersectionObserver"; void k;', "a string that names it"],
    ['const IO = window["Intersection" + "Observer"]; void IO;', "a concatenated key"],
    ["const k = String(1); const v = (window as unknown as Record<string, unknown>)[k]; void v;", "a computed key behind a cast"],
    ["const w = window; void w;", "the window under another name"],
    ["const v = globalThis[`a${1}`]; void v;", "a template key on globalThis"],
    ["const c = Reflect.construct(Object, []); void c;", "Reflect"],
    ["const w = document.defaultView; void w;", "the window through the document"],
    ['const IO = Function("return Inter" + "sectionObserver")(); void IO;', "code built from a string"],
    ['const IO = new Function("return 1"); void IO;', "new Function"],
    ['const IO = window.eval("Inter" + "sectionObserver"); void IO;', "eval through the window"],
    ['const IO = eval("1"); void IO;', "eval"],
  ])("rejects %s (%s)", (body) => {
    expect(broken("D.tsx", demo(body), ctx)).toEqual([GLOBAL]);
  });

  it.each([
    'const m = window.matchMedia("(min-width: 1px)"); void m;',
    'if (typeof window !== "undefined") void 0;',
    'const m = window["matchMedia"]; void m;',
    "/* window[key] and IntersectionObserver, in a comment */",
    "const o = { window: 1 }; void o.window;",
    "const f: Function | null = null; void f;",
  ])("allows %s", (body) => {
    expect(broken("D.tsx", demo(body), ctx)).toEqual([]);
  });

  it.each([
    '<DemoFigure><button className="cl-btn" /></DemoFigure>',
    "<DemoFigure><button /></DemoFigure>",
    '<DemoFigure><button className={"cl-btn " + x} /></DemoFigure>',
    '<DemoFigure><div onClick={go} className="demo-title" /></DemoFigure>',
    '<DemoFigure><span role="button" /></DemoFigure>',
    '<DemoFigure><button {...rest} className="rd-btn" /></DemoFigure>',
    '<DemoFigure><a href="/x">x</a></DemoFigure>',
  ])("rejects %s", (jsx) => {
    expect(broken("D.tsx", demo("", jsx), ctx)).toEqual([OPERABLE]);
  });

  it.each([
    '<DemoFigure><button className="rd-btn" /></DemoFigure>',
    '<DemoFigure><button className={"rd-btn" + (p ? " is-picked" : "")} /></DemoFigure>',
    "<DemoFigure><button className={`rd-btn ${p}`} /></DemoFigure>",
  ])("allows %s", (jsx) => {
    expect(broken("D.tsx", demo("", jsx), ctx)).toEqual([]);
  });

  it.each([
    '<DemoFigure><p role="status">x</p></DemoFigure>',
    '<DemoFigure><p aria-live="polite">x</p></DemoFigure>',
    '<DemoFigure><div className="demo-readout"><p role="alert">x</p></div></DemoFigure>',
  ])("rejects %s", (jsx) => {
    expect(broken("D.tsx", demo("", jsx), ctx)).toEqual([LIVE]);
  });

  it("reads a role it cannot read as the worst it could be", () => {
    const jsx = "<DemoFigure><p role={r}>x</p></DemoFigure>";
    expect(broken("D.tsx", demo("", jsx), ctx).sort()).toEqual([LIVE, OPERABLE].sort());
  });

  it("allows a live region written inside a ghost box", () => {
    const jsx = '<DemoFigure><div className="demo-pick-box"><p aria-live="polite">x</p></div></DemoFigure>';
    expect(broken("D.tsx", demo("", jsx), ctx)).toEqual([]);
  });

  const IMPORTS = "imports code and data, and no stylesheet, image or film of its own";
  it.each([
    'import "./cellar.css";',
    'import styles from "./cellar.module.scss";',
    'import film from "./room.mp4";',
    'import gif from "@/public/room.gif?url";',
    'const css = require("./cellar.css");',
    'const later = import("./cellar.css");',
    'const name = "./cellar.css"; const later = import(name);',
    'export * from "./cellar.css";',
  ])("rejects %s", (head) => {
    expect(broken("D.tsx", demo(head, "<DemoFigure />"), ctx)).toEqual([IMPORTS]);
  });

  it.each(['import "./demos.css";', 'import { cellar } from "./cellar";', 'import data from "./cellar.json";', 'import x from "lib.name/thing";'])(
    "allows %s",
    (head) => {
      expect(broken("D.tsx", demo(head, "<DemoFigure />"), ctx)).toEqual([]);
    },
  );

  it("judges a demo one folder down by the same rules, reaching further for the same two files", () => {
    /* the walk finds demos in subfolders now (./contract/files.ts), and a demo
       there imports ../stage/DemoFigure and ../demos.css. Both were pinned to
       the path a demo beside this file writes, so the frame rule and the import
       rule would have refused a lawful demo for living one folder down. */
    const nested =
      'import "../demos.css";\n' +
      'import { DemoFigure } from "../stage/DemoFigure";\n' +
      "export default function D() {\n  return <DemoFigure />;\n}\n";
    expect(broken("sala/SalaDemo.tsx", nested, ctx)).toEqual([]);
    /* and it is still the shared sheet by name, not any .css one folder up */
    expect(broken("sala/SalaDemo.tsx", nested.replace("../demos.css", "../sala.css"), ctx)).toEqual([IMPORTS]);
  });

  it.each([
    "<DemoFigure><noscript>x</noscript></DemoFigure>",
    '<DemoFigure><style>{".rd-btn{display:block}"}</style></DemoFigure>',
    '<figure className="demo-figure" />',
  ])("rejects %s", (jsx) => {
    expect(broken("D.tsx", demo("", jsx), ctx)).toEqual([FRAME]);
  });
});
