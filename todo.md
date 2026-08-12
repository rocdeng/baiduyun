# 百度网盘助手 优化清单

> 分析对象：`panlinker.user.js`（v1.0.28，2029 行，单文件油猴脚本）
> 生成时间：2026-08-01
> 修复时间：2026-08-01

## 修复进度

| 级别 | 状态 | 说明 |
|---|---|---|
| P0 缺陷/风险 | ✅ 5/6 已修 | BDUSS 条目为必需鉴权，保留原行为 |
| P1 性能/体验 | ✅ 4/5 已修 | P1-5（批量更名后刷新）保留 |
| P2 死代码清理 | ✅ 6/6 已修 | |
| P3 架构 | 🔶 部分 | appId 已收敛；模块拆分/i18n/版本构建保留待定 |

## 工程定位

| 项目 | 说明 |
|---|---|
| 类型 | Tampermonkey 油猴脚本（AGPL-3.0） |
| 核心功能 | 抓取百度网盘直链，生成 `aria2c` 命令或推送 RPC 下载任务 |
| 附加功能 | 原生下载按钮接管、批量更名（含智能 SxxExx 改名）、IINA 播放、广告元素过滤、玻璃拟态 UI |
| 外部依赖 | jQuery / sweetalert2（unpkg CDN @require；js-md5 已移除） |
| 文档 | `README.md`、`docs/superpowers/{plans,specs}/`（glassmorphism 设计稿） |

## P0 · 缺陷与风险（建议尽快处理）

| # | 位置 | 问题 | 建议 | 状态 |
|---|---|---|---|---|
| 1 | `panlinker.user.js` `showSetting()` | 每次打开设置都用 `doc.on()` 绑定 `.listener-color`/`.listener-*`，关闭再打开会**累积重复 handler**，触发一次执行多次 | 提取到一次性绑定，或绑定前 `doc.off()` | ✅ 已修（命名空间 `.pl-setting` + `off`） |
| 2 | `panlinker.user.js` `getLogid()` | `require("system-core:context/context.js")` 无 try/catch，share 页上下文缺失时直接抛错，中断整个分享下载流程 | 包 try/catch，失败时降级返回 '' | ✅ 已修 |
| 3 | `panlinker.user.js` `handleNativeDownload()` | `e.__plNativeDownloadHandled` 直接往原生事件对象塞属性；且 `preventDefault/stopPropagation` 先于 `e.type !== 'click'` 判断执行，非 click 事件也被拦截 | 先判断 `e.type`，改用 WeakSet 记录已处理事件 | ✅ 已修 |
| 4 | `panlinker.user.js` `getPCSLink()` | 用 `fidList.length === 2` 判断"空文件列表"（依赖字符串 `'[]'` 长度），脆弱易误判 | 改为 `fidList === '[]'` | ✅ 已修 |
| 5 | `panlinker.user.js` `getBDUSS` | BDUSS 是下载/播放的**必需鉴权**（直链不带即 401），不能关闭，只能风险缓解 | 保留现有行为；弹窗内增加"命令含登录凭证，请勿外发"提示 | ⚠️ 保留（必需鉴权） |
| 6 | `panlinker.user.js` `getBdstoken()` | 遍历所有 `<script>` 用正则扫 `bdstoken`，可能误匹配其他内容 | 限定含登录上下文的脚本，保留 fallback | ✅ 已修 |

## P1 · 性能与体验

| # | 位置 | 问题 | 建议 | 状态 |
|---|---|---|---|---|
| 1 | `initPanLinker()` | MutationObserver + 每秒 `setInterval` **双通道**跑 `removeFilteredElements()`，重复扫描全 DOM，浪费性能；observer 挂 `window` 跨页面残留 | 只保留 MutationObserver，`throttle` 合并 | ✅ 已修（observer + 200ms 节流，移除 setInterval） |
| 2 | `showSetting()` | 点击主题色后 `history.go(0)` 整页刷新，体验差 | 主题色 CSS 变量化，热替换无需刷新 | ✅ 已修（`--pl-primary` 变量 + `applyThemeColor`） |
| 3 | `showSetting()` | 设置项每次 `input` 立即 `GM_setValue`，高频写存储 | 加防抖，统一在失焦/关闭时提交 | ✅ 已修（400ms 防抖） |
| 4 | `base.get/post` | 无超时与重试，请求挂起时 UI 一直 loading | 加超时（30s），blob 下载例外（传 0） | ✅ 已修 |
| 5 | `showBatchRenameDialog()` | 批量更名提交后 `location.reload()` 强刷页面 | 无法可靠注入页面内部刷新（依赖百度内部模块，脆弱），保留 reload | ⚠️ 保留（强刷为稳妥方案） |

## P2 · 死代码与清理（低风险，可直接删）

| # | 位置 | 问题 | 状态 |
|---|---|---|---|
| 1 | `detectPage()` | 重复 `return '';` | ✅ 已删 |
| 2 | `base` 对象 | `createDownloadIframe()` / `getMirrorList()` / `listenElement()` 定义后从未调用 | ✅ 已删 |
| 3 | `addButton()` | `${LOCAL_PAN_CONFIG.code == 200 && ...}` 更新提示为死代码（远程配置已下线） | ✅ 已删 |
| 4 | 头部 | `@require js-md5` 引用但代码中从未调用 | ✅ 已移除 |
| 5 | `initPanLinker()` | 写入 `setting_init_code` / `license`（值硬编码），无任何读取逻辑 | ✅ 已删（含常量） |
| 6 | cURL / BC 下载 | 菜单、生成逻辑及仅供 cURL 使用的终端类型配置 | ✅ 已移除 |

## P3 · 架构与可维护性

| # | 位置 | 问题 | 建议 | 状态 |
|---|---|---|---|---|
| 1 | 全文件 | 2029 行单文件 monolith，HTML 字符串拼接 + 内联样式大面积重复 | 拆分为模块 | 🔶 待定（油猴单文件分发合理，改动大） |
| 2 | 多处 | magic number/字符串：`app_id=250528`、`channel=chunlei` 等 | 收敛进 `LOCAL_PAN_CONFIG` 常量 | ✅ 部分（新增 `appId` 常量，URL 内嵌值暂保留） |
| 3 | `e()/d()` | 仅供 BC 协议编码使用 | 随 BC 下载逻辑一起清理 | ✅ 已移除 |
| 4 | 头部 | `@version` 与 README 需手工同步 | 构建脚本从单一版本源生成 | 🔶 待定（流程改进） |
| 5 | 全文件 | 硬编码中文文案，无 i18n / 无错误日志上报 | 抽取文案常量表；统一日志 | 🔶 待定（非本轮） |
| 6 | `getSelectedList()` 等 | 依赖百度内部模块 `require("system-core:...")` 与页面 `locals`，接口脆弱 | 统一 adapter + 多级 fallback | ✅ 部分（`getLogid` 已加保护，其余已有 try/catch） |

## 非代码建议

| # | 事项 | 说明 |
|---|---|---|
| 1 | 依赖 CDN 本地化 | `unpkg` 三连发在国内首屏加载慢/易失败，可打包进脚本或提供镜像 |
| 2 | 恢复"更新检测"需谨慎 | README 明确移除第三方远程配置，若再引入更新检测需自建接口并默认关闭 |
| 3 | 直链时效 | `dlink` 带 `access_token` 有时效，UI 可提示"命令生成后请尽快使用" |
