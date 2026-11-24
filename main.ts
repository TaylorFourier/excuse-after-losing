import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const excuse =
  "I lost the bounty. I graded myself first, and I have never failed a self-review.";

function assertExcuse(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error("excuse length is outside 1 to 200");
  }
  if (line !== line.trim() || line.includes("\n") || line.includes("\r")) {
    throw new Error("excuse must be one line with no surrounding space");
  }
  for (let i = 0; i < line.length; i++) {
    const code = line.charCodeAt(i);
    if (code < 32 || code > 126) {
      throw new Error("excuse must be printable ASCII");
    }
  }
}

assertExcuse(excuse);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (outputDir === undefined || outputDir.length === 0) {
  process.stderr.write("MAKEFUN_OUTPUT_DIR is unset\n");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, excuse, { encoding: "utf8" });

const codePoints = Array.from(excuse).length;
const utf16Units = excuse.length;
const utf8Bytes = Buffer.byteLength(excuse, "utf8");
const sha256 = createHash("sha256").update(excuse, "utf8").digest("hex");

process.stdout.write(
  `code_points=${codePoints} utf16=${utf16Units} utf8_bytes=${utf8Bytes} sha256=${sha256}\n`,
);
