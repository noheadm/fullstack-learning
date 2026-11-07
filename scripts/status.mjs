#!/usr/bin/env node
// 内容进度：只看内容项状态，不看日期。
// status: done 完成 / in-progress 进行中 / next 下一项 / pending 排队 / not-delivered 未交付 / paused 暂停
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { items } = JSON.parse(fs.readFileSync(path.join(root, "progress.json"), "utf8"));

const by = (s) => items.filter((d) => d.status === s);
const done = by("done");
const active = by("in-progress");

// 当前项：优先进行中的，否则第一个 next，再否则第一个 pending
const current =
  active[0] ??
  by("next")[0] ??
  by("pending")[0] ??
  null;

console.log(`已交付：${items.filter((d) => d.status !== "not-delivered").length} 项    已完成：${done.length} 项`);

if (current) {
  const tag = active.length ? "进行中" : "下一步";
  console.log(`\n${tag}：${current.id} · ${current.title}`);
  console.log(`  材料：${current.materials}`);
  console.log(`  测试：npm run ${current.script}${current.assertions ? `（${current.assertions} 条断言）` : ""}`);
}

const queue = items.filter((d) => ["pending", "not-delivered"].includes(d.status)).slice(0, 5);
if (queue.length) {
  console.log("\n队列：");
  for (const d of queue) {
    const mark = d.status === "not-delivered" ? "（材料未交）" : "";
    console.log(`  ${d.id} · ${d.title}${mark}`);
  }
}

const paused = by("paused");
if (paused.length) {
  console.log(`\n已暂停：${paused.length} 项（阶段 1 材料已写好，等阶段 0 结束后再用）`);
}
