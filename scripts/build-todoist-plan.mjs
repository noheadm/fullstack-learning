#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectDir, "todoist-21-week-study-plan.csv");

const phases = [
  {
    number: 1,
    file: "01-js-ts-basics.md",
    title: "JavaScript + TypeScript 基础（W1–3）",
  },
  {
    number: 2,
    file: "02-react-ts.md",
    title: "React + TypeScript 前端（W4–6）",
  },
  {
    number: 3,
    file: "03-electron.md",
    title: "Electron 桌面应用（W7–8）",
  },
  {
    number: 4,
    file: "04-nodejs-backend.md",
    title: "Node.js + Express 后端（W9–10）",
  },
  {
    number: 5,
    file: "05-postgresql-prisma.md",
    title: "PostgreSQL + Prisma（W11–13）",
  },
  {
    number: 6,
    file: "06-fullstack-docker.md",
    title: "全栈整合 + Docker（W14–16）",
  },
  {
    number: 7,
    file: "07-remote-job-prep.md",
    title: "Remote 求职 + 开源贡献（W17–21）",
  },
];

function readArgs(argv) {
  const options = {
    start: "2026-11-02",
    minutes: "120",
    timezone: "Asia/Ho_Chi_Minh",
    dueHour: "20:00",
  };

  for (const arg of argv) {
    const match = arg.match(/^--(start|minutes|timezone|due-hour)=(.+)$/);
    if (match) {
      const key = match[1] === "due-hour" ? "dueHour" : match[1];
      options[key] = match[2];
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.start)) {
    throw new Error("--start must use YYYY-MM-DD.");
  }
  if (!/^\d+$/.test(options.minutes) || Number(options.minutes) < 1) {
    throw new Error("--minutes must be a positive integer.");
  }
  if (!/^\d{2}:\d{2}$/.test(options.dueHour)) {
    throw new Error("--due-hour must use HH:MM.");
  }

  return options;
}

function cleanText(value) {
  return value
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function dateForDay(startDate, dayNumber) {
  const date = new Date(`${startDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + dayNumber - 1);
  return date.toISOString().slice(0, 10);
}

function dueForDay(startDate, dayNumber, time) {
  return `${dateForDay(startDate, dayNumber)} ${time}`;
}

function parsePhase(fileText, phase) {
  const weeks = new Map();
  const checkpoints = [];
  let currentWeek = null;
  let readingChecklist = false;

  for (const line of fileText.split(/\r?\n/)) {
    const weekMatch = line.match(/^### Week ([\d-]+)：(.+)$/u);
    if (weekMatch) {
      currentWeek = {
        label: weekMatch[1],
        first: Number.parseInt(weekMatch[1], 10),
        title: cleanText(weekMatch[2]),
        tasks: [],
      };
      weeks.set(currentWeek.first, currentWeek);
      readingChecklist = false;
      continue;
    }

    if (/^## ✅ 阶段检查清单/u.test(line)) {
      readingChecklist = true;
      continue;
    }
    if (readingChecklist && line.startsWith("- [ ] ")) {
      checkpoints.push(cleanText(line.slice(6)));
      continue;
    }
    if (readingChecklist && line.startsWith("## ")) {
      readingChecklist = false;
    }

    const dayMatch = line.match(/^\| Day (\d+)(?:-(\d+))? \|/u);
    if (!dayMatch || !currentWeek) continue;

    const columns = line
      .split("|")
      .slice(1, -1)
      .map(cleanText);
    if (columns.length < 2 || columns.length > 3) {
      throw new Error(`Unexpected table row in ${phase.file}: ${line}`);
    }

    const firstDay = Number(dayMatch[1]);
    const lastDay = Number(dayMatch[2] ?? dayMatch[1]);
    const practice =
      columns[2] ??
      (/投递/.test(columns[1])
        ? "保存当天的投递记录，并更新岗位与跟进状态。"
        : "整理当天可验证的笔记、练习结果或面试复盘。");
    for (let day = firstDay; day <= lastDay; day += 1) {
      currentWeek.tasks.push({
        day,
        learning: columns[1],
        practice,
      });
    }
  }

  const tasks = [...weeks.values()]
    .flatMap((week) =>
      week.tasks.map((task) => ({
        ...task,
        week,
      })),
    )
    .sort((a, b) => a.day - b.day);

  if (tasks.length === 0) {
    throw new Error(`No daily tasks parsed from ${phase.file}.`);
  }

  return { weeks, tasks, checkpoints };
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

function buildTaskRow({
  content,
  description,
  priority,
  due,
  minutes,
  timezone,
}) {
  return csvRow([
    "task",
    content,
    description,
    priority,
    "1",
    "",
    "",
    due,
    "zh_CN",
    timezone,
    minutes,
    "minute",
    "",
    "",
  ]);
}

async function main() {
  const options = readArgs(process.argv.slice(2));
  const rows = [
    csvRow([
      "TYPE",
      "CONTENT",
      "DESCRIPTION",
      "PRIORITY",
      "INDENT",
      "AUTHOR",
      "RESPONSIBLE",
      "DATE",
      "DATE_LANG",
      "TIMEZONE",
      "DURATION",
      "DURATION_UNIT",
      "DEADLINE",
      "DEADLINE_LANG",
    ]),
    csvRow(["meta", "view_style=list", "", "", "", "", "", "", "", "", "", "", "", ""]),
    "",
  ];

  const milestones = new Set([21, 42, 56, 70, 91, 112, 150]);
  let dailyCount = 0;
  let reviewCount = 0;
  let checkpointCount = 0;

  for (const phase of phases) {
    const source = await fs.readFile(path.join(projectDir, phase.file), "utf8");
    const parsed = parsePhase(source, phase);
    rows.push(csvRow(["section", `Phase ${phase.number}｜${phase.title}`, "", "", "", "", "", "", "", "", "", "", "", ""]));

    const reviewsAdded = new Set();
    for (const task of parsed.tasks) {
      const isMilestone =
        milestones.has(task.day) ||
        /项目|投递|发布|上线/.test(task.learning);
      const calendarWeek = Math.ceil(task.day / 7);
      const weekTag = calendarWeek <= 21 ? `W${calendarWeek}` : "W21+";
      const tags = [
        "@fullstack",
        `@phase${phase.number}`,
        ...(isMilestone ? ["@milestone"] : []),
      ].join(" ");
      const content = `Day ${task.day}｜${weekTag} · ${task.learning} ${tags}`;
      const description = [
        `学习：${task.learning}`,
        `动手：${task.practice}`,
        `完成标准：专注 ${options.minutes} 分钟，并留下可验证的代码、笔记或产出。`,
        `来源：${phase.file}（Week ${task.week.label}：${task.week.title}）`,
      ].join("\n");

      rows.push(
        buildTaskRow({
          content,
          description,
          priority: isMilestone ? "1" : "3",
          due: dueForDay(options.start, task.day, options.dueHour),
          minutes: options.minutes,
          timezone: options.timezone,
        }),
      );
      dailyCount += 1;

      const weekEndDay = calendarWeek * 7;
      if (!reviewsAdded.has(calendarWeek) && task.day === weekEndDay) {
        rows.push(
          buildTaskRow({
            content: `W${calendarWeek} 复盘｜检查完成度与下周安排 @fullstack @weekly @checkpoint`,
            description: [
              "本周完成：统计计划任务完成数。",
              "学习证据：整理代码提交、笔记或项目链接。",
              "未完成项：只保留真正必要的内容，并重新安排日期。",
              "下周调整：写下一个最需要解决的阻塞问题。",
            ].join("\n"),
            priority: "2",
            due: dueForDay(options.start, weekEndDay, "21:30"),
            minutes: "30",
            timezone: options.timezone,
          }),
        );
        reviewsAdded.add(calendarWeek);
        reviewCount += 1;
      }
    }

    const lastDay = parsed.tasks.at(-1).day;
    if (parsed.checkpoints.length > 0) {
      rows.push(
        buildTaskRow({
          content: `阶段验收｜Phase ${phase.number}｜${phase.title} @fullstack @checkpoint`,
          description: [
            "逐项确认：",
            ...parsed.checkpoints.map((item) => `- ${item}`),
            "全部通过后完成本任务，再进入下一阶段。",
          ].join("\n"),
          priority: "2",
          due: dueForDay(options.start, lastDay, "22:00"),
          minutes: "30",
          timezone: options.timezone,
        }),
      );
      checkpointCount += 1;
    }
  }

  const csv = `${rows.join("\n")}\n`.replace(/\r?\n/g, "\r\n");
  await fs.writeFile(outputPath, csv, "utf8");

  console.log(
    JSON.stringify(
      {
        output: outputPath,
        start: options.start,
        dueHour: options.dueHour,
        minutes: Number(options.minutes),
        timezone: options.timezone,
        dailyTasks: dailyCount,
        weeklyReviews: reviewCount,
        checkpoints: checkpointCount,
        taskRows: dailyCount + reviewCount + checkpointCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
