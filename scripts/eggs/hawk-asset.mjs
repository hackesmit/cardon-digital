#!/usr/bin/env node
/**
 * How public/media/eggs/hawk.webp and hawk-still.webp were made, kept runnable
 * so the next agent can remake them rather than guess at the settings.
 *
 *   node scripts/eggs/hawk-asset.mjs [--frames <dir>] [--out <dir>] [--quality 78]
 *
 * Exit 0 clean, 1 when a file cannot be written, 2 on a usage or environment
 * error.
 *
 * THE SOURCE. Cardon's own red tailed hawk footage, shot against a greenscreen
 * and keyed and stabilised outside this repository. It arrives as 60 PNGs with
 * alpha, 240 by 273, at 30fps, bird facing left:
 *
 *   ~/hq/state/assets/eggs2/hawk-frames/flap_00.png .. flap_59.png
 *
 * THREE THINGS THIS SCRIPT DECIDES, each measured rather than guessed.
 *
 * 1. Twenty frames, not sixty. The 60 are three identical wingbeats: comparing
 *    frame 00 against every other frame by mean per pixel difference over
 *    colour and alpha gives 125 to 157 for a frame mid beat and 23 for frames
 *    20 and 40, which is encoder noise. One beat is 0.667s, loops seamlessly on
 *    its own, and costs a third of the weight.
 *
 * 2. An animated WebP, not the VP9 WebM beside it. Safari will not play VP9
 *    with alpha in a video element at all, and a bird with a black box around
 *    it is worse than no bird. The animated WebP plays everywhere the site
 *    supports and needs no element but an img. It is also why the wingbeat is
 *    not driven from the animation loop: the browser runs it, so the wings keep
 *    their own 30fps however the flight frames land.
 *
 * 3. Quality 78 at full sprite width. The bird is drawn at 104 to 176 CSS
 *    pixels against a 240 pixel sprite, so it has pixels to spare on a dense
 *    screen, and the measured weight is 134 KB for the loop plus 9 KB for the
 *    still. Daniel's budget for this egg is 400 KB.
 *
 * ffmpeg is the only tool involved. This machine has no image library (no
 * Pillow, no sharp, no ImageMagick), which is a standing fact about the box.
 * ffmpeg cannot read an animated WebP back, so a check of the output is a
 * browser job: see HawkDelivery.test.tsx and the bead's recording.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf("--" + name);
  return at === -1 || at === args.length - 1 ? fallback : args[at + 1];
};

/** One wingbeat. Measured above, not assumed. */
const CYCLE = 20;
/** The frame the still is cut from: wings fully spread, the soaring pose. */
const STILL_FRAME = 0;

const frames = flag("frames", join(homedir(), "hq/state/assets/eggs2/hawk-frames"));
const out = flag("out", join(process.cwd(), "public/media/eggs"));
const quality = Number(flag("quality", "78"));

function fail(code, message) {
  console.error("hawk-asset: " + message);
  process.exit(code);
}

if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
  fail(2, "--quality takes a number from 1 to 100, got " + flag("quality", "78"));
}
if (!existsSync(frames)) {
  fail(2, "no frames at " + frames + " (pass --frames <dir>)");
}
for (let i = 0; i < CYCLE; i++) {
  const f = join(frames, "flap_" + String(i).padStart(2, "0") + ".png");
  if (!existsSync(f)) fail(2, "the wingbeat is short a frame: " + f);
}
mkdirSync(out, { recursive: true });

const ffmpeg = (argv) => {
  try {
    execFileSync("ffmpeg", ["-v", "error", "-y", ...argv], { stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    fail(e.code === "ENOENT" ? 2 : 1, "ffmpeg failed: " + (e.stderr?.toString().trim() || e.message));
  }
};

const loop = join(out, "hawk.webp");
const still = join(out, "hawk-still.webp");

/* The loop. -frames:v bounds it at one wingbeat even if the folder holds all
   sixty, and -loop 0 is WebP for forever. */
ffmpeg([
  "-framerate", "30",
  "-i", join(frames, "flap_%02d.png"),
  "-frames:v", String(CYCLE),
  "-c:v", "libwebp_anim",
  "-lossless", "0",
  "-q:v", String(quality),
  "-compression_level", "6",
  "-loop", "0",
  loop,
]);

/* The still, for prefers-reduced-motion. A touch above the loop's quality
   because a held frame is looked at. */
ffmpeg([
  "-i", join(frames, "flap_" + String(STILL_FRAME).padStart(2, "0") + ".png"),
  "-c:v", "libwebp",
  "-lossless", "0",
  "-q:v", String(Math.min(100, quality + 8)),
  "-compression_level", "6",
  still,
]);

const kb = (f) => Math.round(statSync(f).size / 102.4) / 10;
const total = kb(loop) + kb(still);
console.log("hawk-asset: " + loop + "  " + kb(loop) + " KB (" + CYCLE + " frames)");
console.log("hawk-asset: " + still + "  " + kb(still) + " KB");
console.log("hawk-asset: " + Math.round(total * 10) / 10 + " KB total, budget 400 KB");
if (total > 400) fail(1, "over the 400 KB budget; lower --quality or the sprite width");
