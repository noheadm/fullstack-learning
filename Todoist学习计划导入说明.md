# Todoist 21 周学习计划导入说明

这份计划把 `fullstack-learning` 的 150 个学习日整理成 Todoist 可直接导入的 CSV，并加入每周复盘和阶段验收。

## 导入文件

使用 `todoist-21-week-study-plan.csv`。

- 开始日期：2026-11-02（周一）
- 每日提醒：20:00，时区 `Asia/Ho_Chi_Minh`
- 单日任务时长：120 分钟
- 每周复盘：周日 21:30
- 阶段验收：该阶段最后一天 22:00
- 任务分组：Phase 1–7，共 7 个版块
- 标签：`@fullstack`、`@phase1` 至 `@phase7`、`@milestone`、`@weekly`、`@checkpoint`
- 优先级：项目里程碑为 P1，复盘和验收为 P2，日常学习为 P3

## 导入步骤

1. 在 Todoist 网页端或桌面端登录。
2. 创建一个新项目，建议命名为“全栈转型 21 周”。
3. 打开项目右上角菜单，选择“管理数据”，再选择“从 CSV 导入”。
4. 上传 `todoist-21-week-study-plan.csv`，等待导入完成。
5. 点击左上角头像进入“设置” → “提醒” → “自动提醒”，选择提前多久提醒，并打开桌面、移动设备或电子邮件通知。

CSV 导入成功后不能直接撤回，所以请先导入新项目核对内容，再开始使用。

Todoist 会为带日期和时间的任务自动添加提醒，因此导入后的每日 20:00 任务可以直接参与提醒设置。先在通知页检查一条次日任务，确认系统通知权限已打开。

## 记录学习进度

每天完成代码、笔记或项目产出后，勾选当天的 `Day N` 任务。每周日完成 `Wn 复盘`，如实记录完成数、未完成项和下周阻塞。阶段最后一晚完成 `阶段验收`，清单完整通过后再进入下一阶段。

可用的 Todoist 筛选：

```text
@milestone
@checkpoint
today & @fullstack
7 days & @fullstack
```

## 修改节奏

如需从其他周一开始或改成每天 4 小时，可以重新生成 CSV：

```bash
node scripts/build-todoist-plan.mjs --start=2026-11-02 --minutes=240
```

也可以调整 `--due-hour=20:00` 和 `--timezone=Asia/Ho_Chi_Minh`。

## 官方说明

- [导入或导出项目为 CSV](https://www.todoist.com/zh-CN/help/account-and-billing/security/import-or-export-a-project-as-a-csv-file-in-todoist-YC8YvN)
- [Todoist 提醒设置](https://www.todoist.com/zh-CN/help/todoist/features/introduction-to-reminders-9PezfU)
