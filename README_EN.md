# Netdisk Direct Download Helper NG

A Tampermonkey userscript for Baidu Netdisk web pages. It generates direct-download commands for selected files. Current version: `1.0`.

## Current Scope

| Item | Description |
|---|---|
| Supported netdisk | Baidu Netdisk only |
| Main download flow | Generate an `aria2c` command and copy it to the clipboard |
| Additional flows | JSON-RPC, cURL, and BitComet command/link generation are still available |
| Removed | Aliyun-related logic and IDM-style external downloader invocation |
| Remote config | Removed the `api.youxiaohou.com` remote configuration dependency |
| External guide links | Removed guide/help hyperlinks pointing to `www.youxiaohou.com` |

## Main Changes

| Area | Change |
|---|---|
| Security cleanup | Removed mandatory third-party remote config calls on script startup |
| Local config | Baidu OAuth `client_id/appkey` is now read from local settings |
| Aria workflow | Successful Aria generation copies the full `aria2c` command automatically |
| Native button hook | The native Baidu Netdisk row download button is intercepted and routed to the Aria workflow |
| Selection handling | The clicked row is selected for generation, then unselected after the command is copied |
| UI refresh | Main dialog, settings, toast messages, and file list were restyled with an Ant Design-inspired look |
| Page cleanup | The `.wp-custom-yunyiduo` floating widget is hidden and removed automatically |
| Metadata | Script name changed to `网盘直链下载助手NG`; icon changed to an embedded SVG data URI |

## Usage

| Action | Description |
|---|---|
| Single file | Hover a file row and click Baidu Netdisk's native download icon |
| Batch | Select files and use the top `Download Helper` menu |
| Aria command | Paste the copied `aria2c "url" --out "filename" --header ...` command into a terminal |
| Folders | Folders cannot be converted directly; open the folder and select files inside |
| AppKey | Enter your own Baidu AppKey in settings, then finish the OAuth flow when prompted |

## Security Notes

| Item | Description |
|---|---|
| Baidu endpoints | Uses Baidu official domains such as `pan.baidu.com` and `openapi.baidu.com` |
| BDUSS | The generated Aria command includes the local browser `BDUSS` cookie as a request header |
| Access token | OAuth `access_token` is stored locally by the userscript |
| Third-party remote calls | Startup no longer depends on a third-party config server |
| Command privacy | Copied commands include direct links, filenames, and `BDUSS`; do not share them |

## Requirements

| Item | Description |
|---|---|
| Userscript manager | Tampermonkey |
| Browser | Chrome, Edge, or another modern browser supporting Tampermonkey |
| Download tool | `aria2c` is recommended |

