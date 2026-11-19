#!/usr/bin/env node
// 打印 plan/ 下每份文件的磁盘状态，用来核对编辑器里看到的是不是最新内容。
// 用法：npm run docs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = ["plan", path.join("plan", "phase0"), path.join("plan", "phase1")];

const rows = [];
for (const dir of dirs) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs)) {
    if (!name.endsWith(".md")) continue;
    const file = path.join(abs, name);
    const stat = fs.statSync(file);
    const text = fs.readFileSync(file, "utf8");
    const firstHeading = text.split("\n").find((l) => l.startsWith("# ")) ?? "(无标题)";
    const d = stat.mtime;
    const pad = (n) => String(n).padStart(2, "0");
    const mtime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    rows.push({ file: path.relative(root, file), mtime, line1: firstHeading.slice(0, 46) });
  }
}

for (const r of rows.sort((a, b) => b.mtime.localeCompare(a.mtime))) {
  console.log(`${r.mtime}  ${r.file.padEnd(28)}  ${r.line1}`);
}

console.log("\n如果编辑器里显示的内容和这里的时间对不上：");
console.log("  Cmd+Shift+P → Revert File（不要保存）");
