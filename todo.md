# 百度网盘助手 优化清单

> 分析对象：`panlinker.user.js`（v1.0.31，单文件油猴脚本）
> 初版复审：2026-09-16 ｜ 修复：2026-09（Opus 完成 P1/P2 主体）｜ 收尾复核：2026-09-17
> 当前状态：**P1/P2 已全部修复并复核通过**，仅剩 P3 架构/工程化 backlog

## 修复进度

| 级别 | 状态 | 说明 |
|---|---|---|
| P1 缺陷/风险 | ✅ 7/7 已修 | 见下方逐项记录，已通过语法校验与注入测试 |
| P2 死代码/清理 | ✅ 8/8 已修 | api 下载链路、findReact 等约 260+ 行已删 |
| P2 收尾 | ✅ 已处理 | 孤儿 CSS、`base.sleep`、`getCurrentFileList` 可选链、README 错别字（2026-09-17） |
| P3 架构/工程化 | 🔶 未启动 | 油猴单文件分发合理，按需排期 |

脚本从 2029 行精简到 1862 行；已用 Node `new Function(...)` 做语法解析校验，文件保持纯 CRLF 无混合换行。

## 工程定位

| 项目 | 说明 |
|---|---|
| 类型 | Tampermonkey 油猴脚本（AGPL-3.0） |
| 核心功能 | 抓取百度网盘直链，生成 `aria2c` 命令或推送 RPC 下载任务 |
| 附加功能 | 原生下载按钮接管、批量更名（含智能 SxxExx 改名）、IINA 播放、广告元素过滤、玻璃拟态 UI |
| 外部依赖 | jQuery 3.7.0 / sweetalert2 10.16.6（均经 unpkg CDN `@require`） |

## P1 · 缺陷与风险（✅ 已全部修复）

| # | 位置 | 问题 | 修复方式 | 状态 |
|---|---|---|---|---|
| 1 | `createTip()` | tooltip 用 `.html()` 注入未转义文件名，分享页恶意文件名可存储型 XSS | 文件名/体积拆为独立 `<span>`，全程 `textContent` 赋值 | ✅ |
| 2 | `convertLinkToAria()` | Mac 命令不做 shell 转义，文件名含 `$()`/反引号/换行可注入任意命令 | 新增 `sanitizeDownloadLink()`（强制 https、剥空白/控制符/引号）；POSIX 侧 `'…'` + `'\''` 转义；非法直链返回错误提示 | ✅ |
| 3 | `getPCSLink()` | `base.get` 无 try/catch，超时后 loading 永久转圈、`nativeDownloadBusy` 不复位 | 菜单点击、原生接管、`getPCSLink` 三处分别 try/catch/finally 收口并复位状态 | ✅ |
| 4 | `getShareData()` | `locals.dump()` 与 `.value` 无保护，上下文缺失即抛 TypeError | 逐项可选链 + `pick()` 归一化，bdstoken 回退 `getBdstoken()`，并返回布尔成败 | ✅ |
| 5 | `initAuthorize()` | `setInterval` 不清理；token 正则在 URL 末尾匹配失败并对 null 解包 | 命中即 `clearInterval`；正则改 `([^&#]+)`；另加 60s 兜底停表 | ✅ |
| 6 | `addButton()` | 仅注入一次，SPA 工具栏晚渲染则按钮永不出现 | 拆 `injectButton()` + MutationObserver，150ms 防抖、成功即断开、30s 自毁 | ✅ |
| 7 | RPC 地址 | 设置中的 RPC 地址未转义，可注入引号/HTML | `escapeAttr`（属性）+ `escapeHtml`（文本）双口径；设置框 input 统一 `settingValue()` 转义 | ✅ |

## P2 · 死代码与清理（✅ 已全部修复）

| # | 内容 | 状态 |
|---|---|---|
| 1 | 删除不可达的 `downloadMode === 'api'` 全链路：api 分支 DOM、`.listener-link-api/.listener-how/.listener-retry/.listener-back` 绑定、`idm/ins/progress/request` 状态机、blob 下载与 onprogress、204 处理、`CONFIG.api`；`base.get` 签名由 5 参简化为 4 参 | ✅ |
| 2 | 删除零调用的 `resolveFileItemFromDom()` + `findReact()`（约 60 行） | ✅ |
| 3 | 删除 `message.question` 与 `.pl-retry/.pl-browserdownload/.pl-ext` 等死 CSS | ✅ |
| 3b | 2026-09-17 再清孤儿 CSS：`.pl-dropdown-menu-item`、`.pl-button-init`、`@keyframes easeInitOpacity/easeOpacity`、`.element-clicked`；删除未调用的 `base.sleep` | ✅ |
| 4 | `getBDUSS()` 存储键收敛为 `BDUSS_STORAGE_KEY` 常量，修正无效 fallback、消除重复读取 | ✅ |
| 5 | `setBDUSS()` 取不到时删除旧值，避免换号后 aria 命令携带过期凭证；新增 `deleteStorage()` | ✅ |
| 6 | `sizeFormat(0)` 下标夹取到 `[0, unit.length-1]`，修复 `NaNundefined` | ✅（实测 0→0.0B） |
| 7 | `getExtension()` 改正则为 `/\.([^.\\/]+)$/`，无扩展名返回空 | ✅ |
| 8 | 文案：「剪切板」→「剪贴板」（脚本 + README），移除过时 XDown 描述 | ✅ |

## P2 收尾额外修复（Opus 顺手处理）

- `getSelectedList()` 的 `__vue__` 兜底加可选链与双重 try/catch；`getCurrentFileList()` 于 2026-09-17 统一为同样写法。
- 复制成功 toast 增加「命令含登录凭证且直链有时效，请尽快使用、请勿外发」。

## P3 · 架构、安全与工程化（🔶 待排期）

| # | 主题 | 建议 |
|---|---|---|
| 1 | CDN 供应链 | 两个 `@require` 走 unpkg 无 SRI，sweetalert2 10.16.6 偏旧；升级 11.x 或本地化打包 |
| 2 | 单文件 monolith | 约 150 行 CSS 模板字符串 + 大段内联 `style`（批量更名弹窗尤甚）；源码侧拆分、构建期拼回单文件 |
| 3 | 版本源 | `@version` 与 README「当前版本号」手工同步；建议单一 version 常量 + 构建注入 |
| 4 | i18n/日志 | 中文文案散落逻辑中，集中到 `MESSAGES` 常量表；网络错误在 `base.get/post` 统一兜底 |
| 5 | 工程基建 | 无 package.json/lint/测试；引入 ESLint + Prettier；为 `buildSeasonRename/buildSmartRename/applyRenameDeleteText` 等纯函数补单测 |
| 6 | 默认 AppKey | 内置公开 client_id，建议设置框标注「公共默认、配额共享」，引导自建应用 |
| 7 | RPC 保存路径 | aria 命令在 Windows 写死 `--dir "D:\."`，忽略用户设置且非 Windows 无 `--dir`；建议读保存路径并做平台归一化 |
| 8 | 选择器健壮性 | 原生下载按钮依赖中文 `button[title="下载"]`，百度改文案即失效；增加 class/图标多重 fallback + 接管开关 |
| 9 | MutationObserver | 过滤 observer 全 subtree 扫描，可只扫 `mutations.addedNodes` 子树 |
| 10 | `getToken()` 体验 | 60s 等待超时后静默返回空串，建议 toast 引导用户重新授权 |
| 11 | AGENTS.md | 当前为记忆系统占位内容，可补充构建/测试/风格约定 |

## 非代码建议

| # | 事项 |
|---|---|
| 1 | ~~复制成功时提示凭证风险与直链时效~~ 已在 P2 收尾落地 |
| 2 | 文件夹报错文案可再明确「进入文件夹后选择具体文件」 |
| 3 | README 可补「故障自查」：未读到 BDUSS（需 Tampermonkey BETA 授权 cookie）、9019 重新授权、按钮不出现时刷新页面 |
