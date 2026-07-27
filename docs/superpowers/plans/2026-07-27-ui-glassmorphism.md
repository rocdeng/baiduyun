# UI 毛玻璃美化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `panlinker.user.js` 全部自有界面升级为统一的现代毛玻璃（Glassmorphism）风格，平衡质感，仅浅色，纯 CSS 改造，不引入网络字体、不新增 JS 交互。

**Architecture:** 改动集中在 `addPanLinkerStyle()` 的 CSS 模板字符串（`panlinker.user.js:635-742`），用 `backdrop-filter` + 半透明背景 + 三层阴影 + 主题色光晕实现毛玻璃；字体改为系统字体栈；同步调整批量更名预览的少量内联样式以保持调性一致。HTML 结构、JS 逻辑、用户配置项、主题色机制均不动。

**Tech Stack:** 原生 CSS（注入 `<style>` 标签）、SweetAlert2 弹窗、Tampermonkey 油猴脚本。

## Global Constraints

- **改动文件**: 仅 `panlinker.user.js`
- **不改动**: HTML 结构、JS 逻辑、用户配置项（`setting_*`）、主题色机制（`colorList` 与 `${color}` 插值）、SweetAlert2 调用方式
- **主题色**: 保留用户可选的 7 种 6 位 hex 主题色（`#09AAFF` 等），通过 `${color}` 模板插值注入 CSS；透明度用 8 位 hex 后缀（`${color}14`、`${color}40`、`${color}55`）
- **字体**: 仅用系统字体栈，禁止引入 Web Font（百度 CSP 与离线可用性约束）
- **暗色模式**: 不做，仅针对百度网盘默认浅色背景
- **兼容降级**: 不支持 `backdrop-filter` 的浏览器自动退化为半透明纯色面板，不影响功能
- **当前分支**: master（默认分支）——执行前先建 `feat/ui-glassmorphism` 分支
- **验证方式**: 本项目无自动化测试框架，验证靠安装脚本后在百度网盘肉眼检查各界面

## File Structure

| 文件 | 责任 | 改动 |
|---|---|---|
| `panlinker.user.js` | 油猴脚本全部逻辑与样式 | 改 `addPanLinkerStyle()` 的 CSS 模板（635-742 行）；改批量更名预览的内联样式（1211-1215、1277-1278、1293-1301 行） |

CSS 模板内按职责分组：设计 Token（CSS 变量）→ 全局基础（滚动条）→ SweetAlert2 弹窗 → 主文件列表 → 进度条 → 按钮 → 下拉菜单 → 设置面板 → tooltip → loading → 更名预览 → IINA 按钮。

---

### Task 1: 替换 CSS 模板为毛玻璃版本

**Files:**
- Modify: `panlinker.user.js:635-742`（`addPanLinkerStyle()` 内的 `let css = \`...\`` 模板字符串）

**Interfaces:**
- Consumes: `base.getValue('setting_theme_color')` 返回的 6 位 hex 主题色，经 `color` 变量以 `${color}` 插值
- Produces: 注入到百度网盘页面的 `panlinker-style` `<style>` 标签，驱动所有 `.pl-*` 与 `.swal2-*` 界面的外观

- [ ] **Step 1: 建分支**

Run:
```bash
git checkout -b feat/ui-glassmorphism
```
Expected: 切到新分支 `feat/ui-glassmorphism`

- [ ] **Step 2: 用如下毛玻璃版 CSS 替换 635-742 行的整个 `css` 模板字符串**

把 `let css = \`` 之后、`\`;` 之前的全部内容，替换为：

```css
            :root {
                --pl-glass-bg: rgba(255,255,255,0.72);
                --pl-glass-blur: blur(20px) saturate(160%);
                --pl-glass-border: rgba(255,255,255,0.6);
                --pl-shadow-sm: 0 4px 16px rgba(0,0,0,0.06);
                --pl-shadow-lg: 0 12px 32px rgba(0,0,0,0.08);
                --pl-shadow-inset: inset 0 1px 0 rgba(255,255,255,0.5);
                --pl-text-1: rgba(20,28,44,0.92);
                --pl-text-2: rgba(20,28,44,0.55);
                --pl-text-3: rgba(20,28,44,0.4);
                --pl-radius-panel: 16px;
                --pl-radius-card: 12px;
                --pl-radius-ctrl: 8px;
                --pl-radius-tag: 6px;
                --pl-ease: cubic-bezier(0.4,0,0.2,1);
                --pl-dur: 0.22s;
                --pl-font: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                --pl-mono: "SF Mono", "JetBrains Mono", "Cascadia Code", Consolas, Monaco, monospace;
            }
            body::-webkit-scrollbar { display: none }
            ::-webkit-scrollbar { width: 6px; height: 10px }
            ::-webkit-scrollbar-track { border-radius: 0; background: none }
            ::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4) }
            ::-webkit-scrollbar-thumb,::-webkit-scrollbar-thumb:hover { border-radius: 5px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2) }
            ::-webkit-scrollbar-thumb:hover { background-color: rgba(85,85,85,.3) }
            .swal2-container { z-index:100000!important; background: rgba(20,28,44,0.22)!important; backdrop-filter: blur(6px) saturate(140%); -webkit-backdrop-filter: blur(6px) saturate(140%); }
            body.swal2-height-auto { height: inherit!important; }
            .swal2-popup { font-family: var(--pl-font); font-size: 14px !important; border-radius: var(--pl-radius-panel) !important; padding: 20px !important; background: var(--pl-glass-bg)!important; backdrop-filter: var(--pl-glass-blur); -webkit-backdrop-filter: var(--pl-glass-blur); border: 1px solid var(--pl-glass-border); box-shadow: var(--pl-shadow-sm), var(--pl-shadow-lg), var(--pl-shadow-inset)!important; }
            .swal2-title { font-family: var(--pl-font); font-size: 18px !important; font-weight: 600 !important; letter-spacing: 0.2px; color: var(--pl-text-1) !important; margin: 0 !important; padding: 0 !important; }
            .swal2-html-container { margin: 0 !important; color: var(--pl-text-1) !important; }
            .swal2-close { color: var(--pl-text-3) !important; outline: none !important; }
            .swal2-close:hover { color: var(--pl-text-1) !important; }
            .pl-popup { font-family: var(--pl-font); font-size: 14px !important; color: var(--pl-text-1); }
            .pl-popup a { color: ${color} !important; }
            .pl-header { padding: 0 0 12px!important; align-items: flex-start!important; border-bottom: 1px solid rgba(0,0,0,0.06)!important; margin: 0 0 16px!important; }
            .pl-title { font-size: 18px!important; line-height: 1.4!important; font-weight: 600!important; letter-spacing: 0.2px; white-space: nowrap!important; text-overflow: ellipsis!important; color: var(--pl-text-1)!important; }
            .pl-content { padding: 0 !important; font-size: 14px!important; }
            .pl-main { max-height: 420px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.5); border-radius: var(--pl-radius-card); overflow-x: hidden; background: rgba(255,255,255,0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
            .pl-footer { font-size: 12px!important; justify-content: flex-start!important; margin: 12px 0 0!important; padding: 10px 0 0!important; color: var(--pl-text-3)!important; border-top: 1px solid rgba(0,0,0,0.06); }
            .pl-table-head { display:flex; align-items:center; gap: 10px; padding: 10px 12px; background: rgba(245,247,250,0.6); border-bottom: 1px solid rgba(0,0,0,0.06); color: var(--pl-text-2); font-weight: 600; line-height: 22px; }
            .pl-th-name { flex: 0 0 180px; text-align:left; }
            .pl-th-size { flex: 0 0 88px; text-align:left; }
            .pl-th-action { flex: 1; text-align:left; }
            .pl-item { display: flex; align-items: center; gap: 10px; line-height: 24px; padding: 10px 12px; border-bottom: 1px solid rgba(0,0,0,0.04); background: rgba(255,255,255,0.4); transition: background-color var(--pl-dur) var(--pl-ease); }
            .pl-item:hover { background: rgba(255,255,255,0.7); }
            .pl-item:last-child { border-bottom: 0; }
            .pl-item-name { flex: 0 0 180px; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor:default; color: var(--pl-text-1); }
            .pl-item-size { flex: 0 0 88px; text-align:left; color: var(--pl-text-2); white-space: nowrap; }
            .pl-item-link { flex: 1; overflow: hidden; text-align: left; white-space: nowrap; text-overflow: ellipsis; cursor:pointer; color: ${color}; }
            .pl-item-btn { background: ${color}; padding: 4px 10px; border-radius: var(--pl-radius-tag); line-height: 1; cursor: pointer; color: #fff; border: 0; }
            .pl-item-tip { display: flex; justify-content: space-between; gap: 10px; flex: 1; color: var(--pl-text-2); }
            .pl-back { width: 70px; background: rgba(255,255,255,0.6); color: var(--pl-text-1); border-radius: var(--pl-radius-tag); cursor:pointer; margin:1px 0; text-align: center; border: 1px solid rgba(255,255,255,0.5); }
            .pl-ext { display: inline-block; width: 44px; background: rgba(0,0,0,0.06); color: var(--pl-text-1); height: 16px; line-height: 16px; font-size: 12px; border-radius: 4px; }
            .pl-retry {padding: 3px 10px; background: #ff4d4f; color: #fff; border-radius: var(--pl-radius-tag); cursor: pointer;}
            .pl-browserdownload { padding: 3px 10px; background: ${color}; color: #fff; border-radius: var(--pl-radius-tag); cursor: pointer;}
            .pl-item-progress { display:flex; flex: 1; align-items:center; gap: 10px; }
            .pl-progress { display: inline-block;vertical-align: middle;width: 100%; box-sizing: border-box;line-height: 1;position: relative;height: 16px; flex: 1; }
            .pl-progress-outer { height: 16px;border-radius: 999px;background-color: rgba(0,0,0,0.06);overflow: hidden;position: relative;vertical-align: middle;border: 1px solid rgba(255,255,255,0.4); }
            .pl-progress-inner{ position: absolute;left: 0;top: 0;background-color: ${color};text-align: right;border-radius: 999px;line-height: 1;white-space: nowrap;transition: width .3s ease; box-shadow: inset 0 1px 0 rgba(255,255,255,0.4); }
            .pl-progress-inner-text { display: inline-block;vertical-align: middle;color: var(--pl-text-2);font-size: 12px;margin: 0 6px;height: 16px}
            .pl-progress-tip{ flex:1;text-align:right; color: var(--pl-text-2); }
            .pl-progress-how{ flex: 0 0 88px; background: rgba(255,255,255,0.6); border-radius: var(--pl-radius-tag); margin-left: 0; cursor: pointer; text-align: center; color: var(--pl-text-1); border: 1px solid rgba(255,255,255,0.5); }
            .pl-progress-stop{ flex: 0 0 60px; padding: 0 12px; background: #ff4d4f; color: #fff; border-radius: var(--pl-radius-tag); cursor: pointer;margin-left:0;height:24px; line-height: 24px; text-align:center; border: 0; }
            .pl-progress-inner-text:after { display: inline-block;content: "";height: 100%;vertical-align: middle;}
            .pl-btn-primary { background: ${color}; border: 0; border-radius: var(--pl-radius-ctrl); color: #ffffff; cursor: pointer; font-family: var(--pl-font); font-size: 13px; outline: none; display:flex; align-items: center; justify-content: center; margin: 2px 0; padding: 8px 12px; transition: transform var(--pl-dur) var(--pl-ease), box-shadow var(--pl-dur) var(--pl-ease), opacity var(--pl-dur) var(--pl-ease); box-shadow: 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25); }
            .pl-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25); }
            .pl-btn-success { background: #52c41a; }
            .pl-btn-info { background: #1677ff; }
            .pl-btn-warning { background: #faad14; }
            .pl-btn-danger { background: #ff4d4f; }
            .pl-dropdown-menu {position: absolute;right: 0;top: 36px;padding: 6px 0;color: var(--pl-text-1);background: var(--pl-glass-bg);backdrop-filter: var(--pl-glass-blur);-webkit-backdrop-filter: var(--pl-glass-blur);z-index: 999;width: 132px;border: 1px solid var(--pl-glass-border);border-radius: var(--pl-radius-card); box-shadow: var(--pl-shadow-sm), var(--pl-shadow-lg);}
            .pl-dropdown-menu-item { height: 34px;display: flex;align-items: center;justify-content: center;cursor:pointer; padding: 0 12px; transition: background-color 0.16s var(--pl-ease); }
            .pl-dropdown-menu-item:hover { background-color: rgba(0,0,0,0.06);}
            .pl-button .pl-dropdown-menu,
            .pl-button > .menu { display: none; }
            .pl-button:hover .pl-dropdown-menu,
            .pl-button:hover > .menu,
            .pl-button.button-open .pl-dropdown-menu,
            .pl-button.button-open > .menu { display: block!important; }
            .pl-button-init { opacity: 0.5; animation: easeInitOpacity 1.2s 3; animation-fill-mode:forwards }
             @keyframes easeInitOpacity { from { opacity: 0.5; } 50% { opacity: 1 } to { opacity: 0.5; } }
             @keyframes easeOpacity { from { opacity: 1; } 50% { opacity: 0.35 } to { opacity: 1; } }
            .element-clicked { opacity: 0.5; }
            .pl-extra { margin-top: 12px;display:flex; gap: 10px; }
            .pl-extra button { flex: 1}
            .pointer { cursor:pointer }
            .pl-setting-panel { padding: 4px 0 0; }
            .pl-setting-wide { width:100%; box-sizing:border-box; }
            .pl-setting-row { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.15fr); gap:14px; align-items:stretch; }
            .pl-setting-group { padding: 14px 16px 16px; margin-bottom: 14px; border: 1px solid var(--pl-glass-border); border-radius: var(--pl-radius-card); background: var(--pl-glass-bg); backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); box-sizing:border-box; min-width:0; box-shadow: var(--pl-shadow-sm), inset 0 1px 0 rgba(255,255,255,0.5); position: relative; overflow: hidden; }
            .pl-setting-group::before { content:""; position:absolute; inset:0; background: radial-gradient(120% 80% at 0% 0%, ${color}14, transparent 60%); pointer-events:none; }
            .pl-setting-group-title { font-size: 15px; font-weight: 600; color: var(--pl-text-1); line-height: 1.4; position: relative; }
            .pl-setting-group-desc { margin-top: 4px; color: var(--pl-text-2); font-size: 12px; line-height: 1.5; position: relative; }
            .pl-setting-fields { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:12px; position: relative; }
            .pl-setting-field { display:flex; flex-direction:column; align-items:stretch; gap:6px; min-width:0; padding-top:12px; color:var(--pl-text-1); font-weight:500; text-align:left; }
            .pl-setting-fields .pl-setting-field { padding-top:0; }
            .pl-setting-field > span { font-size:13px; line-height:20px; }
            .pl-input { width:100%; box-sizing:border-box; padding: 8px 12px; border: 1px solid rgba(0,0,0,0.1); border-radius: var(--pl-radius-ctrl); font-family: var(--pl-font); font-size: 14px; outline: none; transition: border-color var(--pl-dur) var(--pl-ease), box-shadow var(--pl-dur) var(--pl-ease), background-color var(--pl-dur) var(--pl-ease); background: rgba(255,255,255,0.6); color: var(--pl-text-1); }
            .pl-input:focus { border-color: ${color}; box-shadow: 0 0 0 2px ${color}1f; background: rgba(255,255,255,0.85); }
            .pl-setting-field textarea.pl-input { min-height:130px; resize:vertical; font-family:var(--pl-mono); line-height:1.55; }
            .pl-setting-help { margin-top:8px; color:var(--pl-text-2); font-size:12px; line-height:1.6; text-align:left; }
            .pl-color { display:flex; flex-wrap:wrap; gap:10px; padding-top:2px; }
            .pl-color-box { width:28px; height:28px; box-sizing:border-box; border:1px solid rgba(255,255,255,0.8); cursor:pointer; border-radius:50%; box-shadow:0 0 0 1px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4); transition: box-shadow var(--pl-dur) var(--pl-ease), transform var(--pl-dur) var(--pl-ease); }
            .pl-color-box:hover { transform: scale(1.1); }
            .pl-color-box.checked { border:2px solid #fff!important; box-shadow: 0 0 0 2px ${color}, 0 2px 8px ${color}40; }
            @media (max-width:760px) {
                .pl-setting-row { grid-template-columns:1fr; }
                .pl-setting-fields { grid-template-columns:1fr; }
            }
            .pl-close:focus { outline: 0; box-shadow: none; }
            .tag-danger {color:#cc3235;margin: 0 5px;}
            .pl-tooltip { position: absolute; color: #ffffff; max-width: 600px; font-family: var(--pl-font); font-size: 12px; padding: 8px 10px; background: rgba(20,28,44,0.72); backdrop-filter: blur(12px) saturate(140%); -webkit-backdrop-filter: blur(12px) saturate(140%); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--pl-radius-tag); z-index: 110000; line-height: 1.4; display:none; word-break: break-all; box-shadow: 0 6px 16px rgba(0,0,0,0.2);}
             @keyframes load { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
            .pl-loading-box > div > div { position: absolute;border-radius: 50%;}
            .pl-loading-box > div > div:nth-child(1) { top: 9px;left: 9px;width: 82px;height: 82px;background: #ffffff;}
            .pl-loading-box > div > div:nth-child(2) { top: 14px;left: 38px;width: 25px;height: 25px;background: #666666;animation: load 1s linear infinite;transform-origin: 12px 36px;}
            .pl-loading { width: 16px;height: 16px;display: inline-block;overflow: hidden;background: none;}
            .pl-loading-box { width: 100%;height: 100%;position: relative;transform: translateZ(0) scale(0.16);backface-visibility: hidden;transform-origin: 0 0;}
            .pl-loading-box div { box-sizing: content-box; }
            .pl-rename-input:focus { border-color:#4096ff!important; box-shadow:0 0 0 2px rgba(5,145,255,.16); }
            .pl-rename-preview-table td,
            .pl-rename-preview-table td * { user-select:text!important; -webkit-user-select:text!important; }
            .btn-operate .btn-main { display:flex; align-items:center; }
            .pl-iina-button { position: fixed; top: 76px; right: 24px; z-index: 99999; display: inline-flex; align-items: center; gap: 7px; height: 36px; padding: 0 15px; border: 1px solid var(--pl-glass-border); border-radius: var(--pl-radius-ctrl); background: var(--pl-glass-bg); backdrop-filter: var(--pl-glass-blur); -webkit-backdrop-filter: var(--pl-glass-blur); color: ${color}; font-family: var(--pl-font); font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 16px ${color}40, 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5); transition: transform var(--pl-dur) var(--pl-ease), box-shadow var(--pl-dur) var(--pl-ease); }
            .pl-iina-button:hover { transform: translateY(-1px); box-shadow: 0 6px 20px ${color}55, 0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5); }
            .pl-iina-button:disabled { cursor: wait; opacity: .65; }
            .pl-iina-button-icon { font-size: 12px; line-height: 1; }
```

- [ ] **Step 3: 人工检查（CSS 模板）**

在浏览器 Tampermonkey 安装修改后的脚本，打开百度网盘，逐项确认：

1. 助手设置面板 — 弹窗玻璃化、设置卡片有主题色光晕、输入框 focus 有主题色 ring、色彩选择器 hover 放大
2. 文件列表主弹窗 — 玻璃面板、表头半透明、行 hover 浅色
3. 下载助手下拉菜单 — 玻璃、菜单项 hover 有底色
4. tooltip（鼠标悬停文件名）— 深色玻璃
5. IINA 浮动按钮（视频页）— 玻璃 + 主题色光晕 + hover 上浮
6. 弹窗标题/正文字体为系统字体栈、字间距微调

如某项异常，回到 Step 2 调整对应选择器。

- [ ] **Step 4: Commit**

```bash
git add panlinker.user.js
git commit -m "feat: glassmorphism UI for CSS-driven components

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 同步批量更名预览的内联样式

批量更名预览的容器、输入框、表格用了内联 `style`，优先级高于 CSS 类，必须同步调整为毛玻璃调性，否则该界面与整体不一致。

**Files:**
- Modify: `panlinker.user.js:1211-1215`（初始更名弹窗输入框内联样式）
- Modify: `panlinker.user.js:1277`（`renderRows` 行 `<td>` 内联样式）
- Modify: `panlinker.user.js:1278`（`renderSkipped` 跳过项内联样式）
- Modify: `panlinker.user.js:1293-1301`（预览弹窗 `html` 模板的容器/表格/表头内联样式）

**Interfaces:**
- Consumes: Task 1 的 `.pl-rename-input`、`.pl-btn-primary` CSS 类
- Produces: 与 Task 1 调性一致的批量更名预览界面

- [ ] **Step 1: 调整 1213-1215 行初始更名弹窗两个输入框的内联样式**

把每个 `input` 的 `border:1px solid #d9d9d9;border-radius:6px;background:#fff` 替换为 `border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6)`。

1213 行 `pl-season-number` input 改为：
```html
<input id="pl-season-number" class="pl-rename-input" value="01" inputmode="numeric" autocomplete="off" style="display:block;width:100%;height:40px;margin:0 0 16px;padding:4px 11px;box-sizing:border-box;border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6);color:#1c1c2c;font-size:14px;line-height:1.5;outline:none;transition:border-color .2s,box-shadow .2s,background-color .2s;">
```

1215 行 `pl-delete-text` input 改为：
```html
<input id="pl-delete-text" class="pl-rename-input" placeholder="例如：4k ~ - \\s" autocomplete="off" style="display:block;width:100%;height:40px;margin:0;padding:4px 11px;box-sizing:border-box;border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6);color:#1c1c2c;font-size:14px;line-height:1.5;outline:none;transition:border-color .2s,box-shadow .2s,background-color .2s;">
```

1212、1214 行的 `<label style="...color:#262626;">` 改为 `color:rgba(20,28,44,0.92)`。

- [ ] **Step 2: 调整 1277 行 `renderRows` 的 `<td>` 内联样式**

替换 1277 行为：
```js
            const renderRows = (previewList) => previewList.map((item) => `<tr><td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,0.04);word-break:break-all;cursor:text;">${base.escapeHtml(item.filename)}</td><td style="padding:9px 12px;border-bottom:1px solid rgba(0,0,0,0.04);color:#1677ff;word-break:break-all;cursor:text;">${base.escapeHtml(item.newname)}</td></tr>`).join('');
```

- [ ] **Step 3: 调整 1278 行 `renderSkipped` 的跳过项内联样式**

替换 1278 行为：
```js
            const renderSkipped = (skippedList) => skippedList.length ? `<div style="margin-top:12px;padding:10px 12px;background:rgba(255,247,230,0.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,213,145,0.6);border-radius:6px;text-align:left;color:#ad6800;word-break:break-all;user-select:text;-webkit-user-select:text;">将跳过 ${skippedList.length} 项：<br>${skippedList.map(base.escapeHtml).join('<br>')}</div>` : '';
```

- [ ] **Step 4: 调整 1293 行预览弹窗规则容器内联样式**

把 1293 行的容器 `style="margin-bottom:12px;padding:12px 14px;border:1px solid #d9d9d9;border-radius:6px;background:#fafafa;text-align:left;"` 替换为：
```html
<div style="margin-bottom:12px;padding:12px 14px;border:1px solid rgba(255,255,255,0.5);border-radius:8px;background:rgba(255,255,255,0.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);text-align:left;">
```

- [ ] **Step 5: 调整 1295-1296 行预览弹窗两个输入框内联样式**

把每个 `pl-rename-input` 的 `border:1px solid #d9d9d9;border-radius:6px;background:#fff` 替换为 `border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6)`。

1295 行 `pl-preview-season` input 的 style 改为：
```html
style="display:block;width:100%;height:36px;margin-top:5px;padding:4px 10px;box-sizing:border-box;border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s,background-color .2s;"
```

1296 行 `pl-preview-delete-text` input 的 style 改为：
```html
style="display:block;width:100%;height:36px;margin-top:5px;padding:4px 10px;box-sizing:border-box;border:1px solid rgba(0,0,0,0.1);border-radius:8px;background:rgba(255,255,255,0.6);font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s,background-color .2s;"
```

1295-1296 行的 `<label style="font-size:13px;color:#262626;">` 改为 `color:rgba(20,28,44,0.92)`。

- [ ] **Step 6: 调整 1299 行 status 文字色**

把 `style="margin-top:8px;font-size:12px;color:#8c8c8c;"` 替换为 `style="margin-top:8px;font-size:12px;color:rgba(20,28,44,0.55);"`。

- [ ] **Step 7: 调整 1301 行预览表格容器与表头内联样式**

把表格容器的 `style="max-height:360px;overflow:auto;border:1px solid #f0f0f0;border-radius:6px;"` 替换为：
```html
style="max-height:360px;overflow:auto;border:1px solid rgba(0,0,0,0.06);border-radius:8px;"
```

把 `<thead style="position:sticky;top:0;background:#fafafa;z-index:1;">` 替换为：
```html
<thead style="position:sticky;top:0;background:rgba(245,247,250,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:1;">
```

- [ ] **Step 8: 人工检查（批量更名预览）**

在百度网盘选中多个文件，打开下载助手菜单 → 批量更名，确认：

1. 初始更名弹窗两个输入框为半透明玻璃边框
2. 预览弹窗的规则容器玻璃化
3. 预览表格容器圆角 8px、边框淡灰
4. 表头 sticky 时半透明 + 模糊
5. 跳过项警告为暖色玻璃
6. 各文字色为冷调灰，与整体一致

如某项异常，回到对应 Step 调整。

- [ ] **Step 9: Commit**

```bash
git add panlinker.user.js
git commit -m "feat: glassmorphism for batch rename preview inline styles

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: 全量人工验证

**Files:**
- Inspect: `panlinker.user.js`（只读，确认无语法错误）

- [ ] **Step 1: 语法自检**

Run:
```bash
node --check panlinker.user.js
```
Expected: 无输出（语法正确）。注意：油猴脚本有 `GM_*` 等宿主 API，`node --check` 只验语法不验引用，若报 `GM_* is not defined` 类运行时错误可忽略；只关心 `SyntaxError`。

若出现 `SyntaxError`：定位行号，回到 Task 1/2 对应 Step 修复（常见是模板字符串反引号或 `${color}` 插值被误删）。

- [ ] **Step 2: 全界面肉眼检查清单**

在百度网盘逐项过一遍：

| # | 界面 | 触发方式 | 预期 |
|---|---|---|---|
| 1 | 助手设置 | 下载助手菜单 → 助手设置 | 玻璃弹窗 + 卡片主题色光晕 + 输入框 focus ring + 色彩选择器 hover 放大 |
| 2 | 文件列表 | 勾选文件 → 下载助手 → Aria 下载 | 玻璃面板 + 表头半透明 + 行 hover |
| 3 | 下载助手下拉菜单 | 顶部下载助手按钮 hover | 玻璃菜单 + 菜单项 hover 底色 |
| 4 | tooltip | 鼠标悬停文件名 | 深色玻璃气泡 |
| 5 | 批量更名 | 选中文件 → 下载助手 → 批量更名 | 玻璃规则容器 + 表格 + 暖色跳过项 |
| 6 | IINA 按钮 | 打开视频页 | 玻璃按钮 + 主题色光晕 + hover 上浮 |
| 7 | 进度条 | 触发下载 | 玻璃轨道 + 主题色填充光泽 |
| 8 | loading | 触发请求中状态 | 旋转动画正常 |
| 9 | 切换主题色 | 设置 → 换主题色 | 各界面光晕/ring 随主题色变化，无 8 位 hex 失效 |
| 10 | 字体 | 全部界面 | 系统字体栈生效（Mac 为 PingFang SC）|

任一项不符，回到对应 Task 调整。

- [ ] **Step 3: 最终 Commit（如 Task 1/2 后有遗留改动）**

```bash
git status
# 若有未提交改动：
git add panlinker.user.js
git commit -m "fix: glassmorphism polish from full UI review

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

如无遗留改动，跳过本步。

- [ ] **Step 4: 汇报结果**

向用户汇报：改动分支、改动文件、各界面验证结果、是否合并到 master。
