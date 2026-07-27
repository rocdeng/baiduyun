# UI 毛玻璃美化设计

- **日期**: 2026-07-27
- **范围**: `panlinker.user.js` 第 633-744 行 `addPanLinkerStyle()` 内的 CSS 模板字符串
- **视觉方向**: 现代毛玻璃风（Glassmorphism），平衡质感，仅浅色
- **实现策略**: 纯 CSS 改造（方案 A），不引入网络字体，不新增 JS 交互

## 1. 目标

在不改动 HTML 结构、JS 逻辑、用户配置项、主题色机制的前提下，把脚本全部自有界面升级为统一毛玻璃风格，提升质感而不破坏可读性与操作效率。

## 2. 设计 Token

主题色仍用现有 `${color}` 注入 CSS。

| Token | 值 | 用途 |
|---|---|---|
| 玻璃面板底色 | `rgba(255,255,255,0.72)` | 弹窗/设置组/下拉菜单背景 |
| 模糊强度 | `backdrop-filter: blur(20px) saturate(160%)` | 面板毛玻璃质感 |
| 边框 | `1px solid rgba(255,255,255,0.6)` | 玻璃边缘高光 |
| 阴影三层 | `0 4px 16px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)` | 浮起 + 顶部高光 |
| 圆角 | 面板 16px / 卡片 12px / 控件 8px / 小标签 6px | 柔和统一 |
| 主文字色 | `rgba(20,28,44,0.92)` | 替代原 `rgba(0,0,0,.88)` |
| 次文字色 | `rgba(20,28,44,0.55)` | 替代原 `rgba(0,0,0,.45)` |
| 提示文字色 | `rgba(20,28,44,0.4)` | 辅助说明 |
| 主题色光晕 | `${color}` 16% 透明 + 径向渐变 | 面板背景氛围 |
| 动效时长 | `0.22s cubic-bezier(0.4,0,0.2,1)` | hover/focus 过渡 |

## 3. 字体系统

| 层级 | 规格 | 字体栈 |
|---|---|---|
| 全局基础 | 14px / 1.6 | `-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| 标题 | 18px / 600 | 同上，`letter-spacing: 0.2px` |
| 分组标题 | 15px / 600 | 同上 |
| 正文 | 14px / 400 | 同上 |
| 辅助/提示 | 12px / 400 | 同上 |
| 等宽 | 12px / 1.6 | `"SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, Monaco, monospace` |

系统字体栈在 Mac 落到 PingFang SC、Windows 落到 Microsoft YaHei，原生高清，无网络依赖。

## 4. 各组件改造

| 组件 | 改造点 |
|---|---|
| SweetAlert2 弹窗 `.swal2-popup` | 玻璃底 + blur(20px) + 三层阴影 + 16px 圆角；标题字间距；按钮统一毛玻璃风格 |
| 主文件列表 `.pl-main` | 玻璃面板内嵌；表头半透明 `rgba(245,247,250,0.6)`；行 hover 浅色光晕；分隔线 `rgba(0,0,0,0.04)` |
| 设置面板 `.pl-setting-group` | 玻璃卡片 + 主题色径向光晕背景；输入框 focus 时主题色 ring；色彩选择器加玻璃边框 |
| 批量更名预览 | 表格容器玻璃化；表头 sticky 半透明；跳过项警告用玻璃 + 暖色光晕 |
| IINA 浮动按钮 `.pl-iina-button` | 玻璃 + 主题色光晕 + hover 上浮 1px + 阴影加深 |
| 下载助手下拉菜单 `.pl-dropdown-menu` | 玻璃 + 主题色淡光晕；菜单项 hover 主题色 8% 底色 |
| tooltip `.pl-tooltip` | 玻璃深色版 `rgba(20,28,44,0.72)` + blur |
| 进度条 `.pl-progress` | 轨道半透明玻璃；填充条加主题色微光泽 |
| loading | 保持现有旋转动画，容器玻璃化 |

## 5. 动效

| 对象 | 动效 |
|---|---|
| 按钮 hover | `transform: translateY(-1px)` + 阴影加深，220ms |
| 输入框 focus | 主题色 ring 渐入 |
| 菜单项 hover | 背景色 160ms 渐入 |
| 列表行 hover | 背景色 200ms |
| 主题色选择器 | 选中 ring 220ms |

不做鼠标跟随光晕、不做弹窗入场复杂动画（方案 A 纯 CSS，无 JS 增强）。

## 6. 改动范围

- **改动文件**: 仅 `panlinker.user.js` 第 633-744 行 `addPanLinkerStyle()` 的 CSS 模板字符串
- **不改动**: HTML 结构、JS 逻辑、用户配置项、主题色机制、SweetAlert2 调用方式

## 7. 兼容性与降级

| 项 | 说明 |
|---|---|
| `backdrop-filter` 支持 | Chrome/Edge/Safari 全支持；Firefox 103+ 支持；百度网盘用 webkit 内核，无问题 |
| 降级 | 不支持 `backdrop-filter` 的浏览器自动退化为半透明纯色面板，不影响功能 |
| 回滚 | 改动集中在单个 CSS 字符串，`git revert` 即可全量回滚 |

## 8. 验证

安装脚本后，在百度网盘打开各界面肉眼检查：

1. 文件列表主弹窗 — 玻璃面板 + 行 hover
2. 助手设置面板 — 玻璃卡片 + 输入框 focus ring + 色彩选择器
3. 批量更名预览 — 玻璃表格 + 跳过项警告
4. IINA 浮动按钮 — 玻璃 + hover 上浮
5. 下载助手下拉菜单 — 玻璃 + 菜单项 hover
6. tooltip — 深色玻璃
7. 进度条 — 玻璃轨道 + 光泽填充
8. loading — 玻璃容器
