// ==UserScript==
// @name              网盘直链下载助手NG
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           1.0.16
// @author            YouXiaoHou
// @description       支持批量获取百度网盘直链下载地址，脚本拉取文件后由浏览器保存。
// @license           AGPL-3.0-or-later
// @supportURL        https://github.com/syhyz1990/baiduyun
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/pfile/video*
// @match             *://yun.baidu.com/pfile/video*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @match             *://openapi.baidu.com/*
// @require           https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/js-md5@0.7.3/build/md5.min.js
// @connect           pan.baidu.com
// @connect           openapi.baidu.com
// @connect           baidupcs.com
// @connect           localhost
// @run-at            document-idle
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @grant             window.close
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE2NzdmZiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzY5YjFmZiIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJnbG93IiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjk4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTZmNGZmIiBzdG9wLW9wYWNpdHk9IjAuOTUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9InVybCgjYmcpIi8+PGNpcmNsZSBjeD0iNDIiIGN5PSIzOCIgcj0iNyIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjE2Ii8+PHBhdGggZD0iTTMxIDY4YzAtMTAuNSA4LjUtMTkgMTktMTkgMy4xLTEwLjYgMTMuMS0xOC40IDI1LTE4LjQgMTQgMCAyNS42IDEwLjggMjYuNCAyNC42IDkuMi4yIDE2LjYgNy44IDE2LjYgMTcgMCA5LjMtNy41IDE2LjgtMTYuOCAxNi44SDUwLjhDNDAuMiA4OSAzMSA3OS44IDMxIDY5LjJWNjhaIiBmaWxsPSJ1cmwoI2dsb3cpIi8+PHBhdGggZD0iTTY0IDUwdjI0IiBzdHJva2U9IiMxNjc3ZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTU0IDY2bDEwIDExIDEwLTExIiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjc3ZmYiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTUxIDg1aDI2IiBzdHJva2U9IiMxNjc3ZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjkiLz48Y2lyY2xlIGN4PSI5MiIgY3k9IjM2IiByPSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjxjaXJjbGUgY3g9Ijk5IiBjeT0iNDMiIHI9IjMiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+
// ==/UserScript==

(function () {
    'use strict';

    let pt = '', selectList = [], params = {}, mode = '', width = 800, pan = {}, color = '',
        doc = $(document), progress = {}, request = {}, ins = {}, idm = {},
        nativeDownloadBusy = false,
        nativeDownloadRow = null,
        yunyiduoTimer = null,
        pageListenersReady = false, tipReady = false, menuCommandReady = false;
    const scriptInfo = GM_info.script;
    const version = scriptInfo.version;
    const author = scriptInfo.author;
    const name = scriptInfo.name;
    const manageHandler = GM_info.scriptHandler;
    const manageVersion = GM_info.version;
    const customClass = {
        popup: 'pl-popup',
        header: 'pl-header',
        title: 'pl-title',
        closeButton: 'pl-close',
        content: 'pl-content',
        input: 'pl-input',
        footer: 'pl-footer'
    };

    const terminalType = {
        wc: "Windows CMD",
        wp: "Windows PowerShell",
        lt: "Linux 终端",
        ls: "Linux Shell",
        mt: "MacOS 终端",
    };
    const DEFAULT_FILTER_SELECTORS = [
        '.nd-operate-guidance',
        '.wp-custom-input-wrap',
        '.wp-custom-yunyiduo',
        '.bottom-chat-ai-wrapper',
        '.nd-ai-tools-iframe'
    ];

    const LOCAL_PAN_CONFIG = Object.freeze({
        pcs: {
            0: 'https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1',
            1: 'https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528',
            2: 'https://pan.baidu.com/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0',
            3: 'https://openapi.baidu.com/oauth/2.0/authorize',
            4: 'https://openapi.baidu.com/oauth/2.0/login_success'
        },
        btn: {
            home: '.tcuLAu',
            main: '.wp-s-agile-tool-bar__header',
            share: '.module-share-top-bar .x-button-box'
        },
        api: [
            'Aria下载（生成 aria2c 命令）',
            '点击后复制 aria2c 命令，粘贴到支持 aria2c 协议的下载器或终端中。'
        ],
        aria: [
            'Aria下载（适用于 XDown 及 Linux Shell 命令行）',
            '点击链接复制地址到剪切板，粘贴到支持 aria2c 协议的下载器中，例如 XDown、Linux Shell，建议配合超级会员使用。'
        ],
        rpc: [
            'RPC下载（适用于 Motrix、Aria2 Tools、AriaNgGUI）',
            '点击按钮发送链接至本地或远程 RPC 服务，例如 Motrix，RPC 参数按本地配置填写，建议配合超级会员使用。'
        ],
        curl: [
            'cURL下载（适用于 Windows、Linux、MacOS 终端）',
            '点击链接复制地址到剪切板，粘贴到 Windows、Linux、MacOS 终端，支持断点续传，建议配合超级会员使用。'
        ],
        bc: [
            'BC下载（适用于比特彗星）',
            '点击链接复制地址到剪切板，粘贴到比特彗星下载器中，建议配合超级会员使用。'
        ],
        assistant: '请先登录网盘后再生成链接',
        tampermonkeyTip: '请安装更强大的 Tampermonkey BETA (红色图标) 替换 Tampermonkey (黑色图标)，然后重新安装本助手！',
        num: '865746',
        license: 'AGPL3',
        ua: 'pan.baidu.com',
        footer: '<div style=\"text-align: center;\">RPC配置说明已内置在本地配置中，修改后自动生效</div>'
    });

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const message = {
        success: (text) => {
            toast.fire({title: text, icon: 'success'});
        },
        error: (text) => {
            toast.fire({title: text, icon: 'error'});
        },
        warning: (text) => {
            toast.fire({title: text, icon: 'warning'});
        },
        info: (text) => {
            toast.fire({title: text, icon: 'info'});
        },
        question: (text) => {
            toast.fire({title: text, icon: 'question'});
        }
    };

    let base = {

        getCookie(name) {
            let cname = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
            }
            return "";
        },

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        deleteValue(name) {
            GM_deleteValue(name);
        },

        getStorage(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setStorage(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },

        setClipboard(text) {
            const value = String(text ?? '').replace(/(?:\r\n|\r|\n)+$/g, '');
            if (!value) return false;
            let copied = false;
            try {
                GM_setClipboard(value, 'text');
                copied = true;
            } catch (e) {
                // 继续尝试浏览器原生复制，兼容不同脚本管理器和操作系统。
            }
            const temp = document.createElement('textarea');
            temp.value = value;
            temp.setAttribute('readonly', 'readonly');
            temp.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;';
            document.body.appendChild(temp);
            temp.focus();
            temp.select();
            temp.setSelectionRange(0, value.length);
            try {
                copied = document.execCommand('copy') || copied;
            } catch (e) {
                // GM_setClipboard 成功时仍可正常返回。
            }
            document.body.removeChild(temp);
            return copied;
        },

        escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, (char) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char]));
        },

        escapeAttr(value) {
            return this.escapeHtml(value).replace(/`/g, '&#96;');
        },

        e(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },

        d(str) {
            return decodeURIComponent(escape(atob(str)));
        },

        getExtension(name) {
            const reg = /(?!\.)\w+$/;
            if (reg.test(name)) {
                let match = name.match(reg);
                return match[0].toUpperCase();
            }
            return '';
        },

        sizeFormat(value) {
            if (value === +value) {
                let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
                let index = Math.floor(Math.log(value) / Math.log(1024));
                let size = value / Math.pow(1024, index);
                size = size.toFixed(1);
                return size + unit[index];
            }
            return '';
        },

        sortByName(arr) {
            const handle = () => {
                return (a, b) => {
                    const p1 = a.filename ? a.filename : a.server_filename;
                    const p2 = b.filename ? b.filename : b.server_filename;
                    return p1.localeCompare(p2, "zh-CN");
                };
            };
            arr.sort(handle());
        },

        fixFilename(name) {
            return name.replace(/[!?&|`"'*\/:<>\\]/g, '_');
        },

        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },

        post(url, data, headers, type) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        get(url, headers, type, extra) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 204) {
                            requestObj.abort();
                            idm[extra.index] = true;
                        }
                        if (type === 'blob') {
                            res.status === 200 && base.blobDownload(res.response, extra.filename);
                            resolve(res);
                        } else {
                            resolve(res.response || res.responseText);
                        }
                    },
                    onprogress: (res) => {
                        if (extra && extra.filename && extra.index !== undefined) {
                            res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                        }
                    },
                    onloadstart() {
                        extra && extra.filename && extra.index !== undefined && (request[extra.index] = requestObj);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        getFinalUrl(url, headers) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    onload: (res) => {
                        resolve(res.finalUrl);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        stringify(obj) {
            let str = '';
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + '=' + encodeURIComponent(value[i]) + '&';
                        }
                    } else {
                        str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
            return str.slice(0, -1); // 去掉末尾的 "&"
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },

        sleep(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        getMajorVersion(version) {
            const [major] = (version || '').split('.');
            return /^\d+$/.test(major) ? major : null;
        },

        findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        initDefaultConfig() {
            let value = [{
                name: 'setting_rpc_domain',
                value: 'http://localhost'
            }, {
                name: 'setting_rpc_port',
                value: '16800'
            }, {
                name: 'setting_rpc_path',
                value: '/jsonrpc'
            }, {
                name: 'setting_rpc_token',
                value: ''
            }, {
                name: 'setting_rpc_dir',
                value: 'D:'
            }, {
                name: 'setting_baidu_appkey',
                value: 'IlLqBbU3GjQ0t46TRwFateTprHWl39zF'
            }, {
                name: 'setting_terminal_type',
                value: 'wc'
            }, {
                name: 'setting_theme_color',
                value: '#09AAFF'
            }, {
                name: 'setting_filter_selectors',
                value: DEFAULT_FILTER_SELECTORS.join('\n')
            }, {
                name: 'setting_init_code',
                value: ''
            }, {
                name: 'license',
                value: ''
            }];

            value.forEach((v) => {
                base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
            });
            const filterSelectors = String(base.getValue('setting_filter_selectors') || '');
            const safeFilterSelectors = filterSelectors
                .split(/\r?\n/)
                .map(selector => selector.trim())
                .filter(selector => selector && selector !== '.wp-s-core-pan.yunyiduo-guide-show')
                .join('\n');
            if (safeFilterSelectors !== filterSelectors) {
                base.setValue('setting_filter_selectors', safeFilterSelectors || DEFAULT_FILTER_SELECTORS.join('\n'));
            }
        },

        showSetting() {
            let dom = '', btn = '',
                colorList = ['#09AAFF', '#cc3235', '#526efa', '#518c17', '#ed944b', '#f969a5', '#bca280'];
            dom += `<div class="pl-setting-group pl-setting-connection"><div class="pl-setting-group-title">连接设置</div><div class="pl-setting-group-desc">用于生成下载链接和推送任务。</div><div class="pl-setting-fields">`;
            dom += `<label class="pl-setting-field"><span>RPC主机</span><input type="text" placeholder="需带上 http(s)://" class="pl-input listener-domain" value="${base.getValue('setting_rpc_domain')}"></label>`;
            dom += `<label class="pl-setting-field"><span>RPC端口</span><input type="text" placeholder="例如 16800" class="pl-input listener-port" value="${base.getValue('setting_rpc_port')}"></label>`;
            dom += `<label class="pl-setting-field"><span>RPC路径</span><input type="text" placeholder="默认 /jsonrpc" class="pl-input listener-path" value="${base.getValue('setting_rpc_path')}"></label>`;
            dom += `<label class="pl-setting-field"><span>RPC密钥</span><input type="text" placeholder="无密钥无需填写" class="pl-input listener-token" value="${base.getValue('setting_rpc_token')}"></label>`;
            dom += `<label class="pl-setting-field"><span>保存路径</span><input type="text" placeholder="例如 D:" class="pl-input listener-dir" value="${base.getValue('setting_rpc_dir')}"></label>`;
            dom += `<label class="pl-setting-field"><span>百度 AppKey</span><input type="text" placeholder="百度开放平台 AppKey" class="pl-input listener-appkey" value="${base.getValue('setting_baidu_appkey')}"></label></div></div>`;

            colorList.forEach((v) => {
                btn += `<div data-color="${v}" style="background: ${v};border: 1px solid ${v}" class="pl-color-box listener-color ${v === base.getValue('setting_theme_color') ? 'checked' : ''}"></div>`;
            });
            dom += `<div class="pl-setting-row"><div class="pl-setting-group"><div class="pl-setting-group-title">外观</div><div class="pl-setting-group-desc">调整脚本界面与命令生成方式。</div>`;
            dom += `<label class="pl-setting-field"><span>终端类型</span><select class="pl-input listener-terminal">`;
            Object.keys(terminalType).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_terminal_type') === k ? 'selected' : ''}>${terminalType[k]}</option>`;
            });
            dom += `</select></label>`;
            dom += `<div class="pl-setting-field"><span>主题颜色</span><div class="pl-color">${btn}</div></div>`;
            dom += `</div>`;
            dom += `<div class="pl-setting-group"><div class="pl-setting-group-title">页面过滤</div><div class="pl-setting-group-desc">每行填写一个 CSS 选择器，可添加多个需要自动隐藏并删除的 DIV 或其他页面元素。</div>`;
            dom += `<label class="pl-setting-field"><span>过滤元素</span><textarea class="pl-input listener-filter-selectors" placeholder="例如：&#10;.nd-operate-guidance&#10;#some-ad">${base.escapeHtml(base.getValue('setting_filter_selectors') || '')}</textarea></label>`;
            dom += `<div class="pl-setting-help">支持类名、ID 和属性选择器，例如 <code>.ad-box</code>、<code>#popup</code>、<code>div[data-ad]</code>。无效选择器会自动跳过。</div></div></div>`;
            dom = '<div class="pl-setting-panel pl-setting-wide">' + dom + '</div>';

            Swal.fire({
                title: '助手配置',
                html: dom,
                icon: 'info',
                showCloseButton: true,
                showConfirmButton: false,
                footer: LOCAL_PAN_CONFIG.footer,
                width: 940,
            }).then(() => {
                message.success('设置成功！');
                history.go(0);
            });

            doc.on('click', '.listener-color', async (e) => {
                base.setValue('setting_theme_color', e.target.dataset.color);
                message.success('设置成功！');
                history.go(0);
            });
            doc.on('input', '.listener-domain', async (e) => {
                base.setValue('setting_rpc_domain', e.target.value);
            });
            doc.on('input', '.listener-port', async (e) => {
                base.setValue('setting_rpc_port', e.target.value);
            });
            doc.on('input', '.listener-path', async (e) => {
                base.setValue('setting_rpc_path', e.target.value);
            });
            doc.on('input', '.listener-token', async (e) => {
                base.setValue('setting_rpc_token', e.target.value);
            });
            doc.on('input', '.listener-dir', async (e) => {
                base.setValue('setting_rpc_dir', e.target.value);
            });
            doc.on('input', '.listener-appkey', async (e) => {
                base.setValue('setting_baidu_appkey', e.target.value);
            });
            doc.on('change', '.listener-terminal', async (e) => {
                base.setValue('setting_terminal_type', e.target.value);
            });
            doc.on('input', '.listener-filter-selectors', async (e) => {
                base.setValue('setting_filter_selectors', e.target.value);
                base.removeFilteredElements();
            });
        },

        registerMenuCommand() {
            if (menuCommandReady) return;
            menuCommandReady = true;
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSetting();
            });
        },

        createTip() {
            if (tipReady) return;
            tipReady = true;
            $('body').append('<div class="pl-tooltip"></div>');

            doc.on('mouseenter mouseleave', '.listener-tip', (e) => {
                if (e.type === 'mouseenter') {
                    let filename = e.currentTarget.innerText;
                    let size = e.currentTarget.dataset.size;
                    let tip = `${filename}<span style="margin-left: 10px;color: #f56c6c;">${size}</span>`;
                    $(e.currentTarget).css({opacity: '0.5'});
                    $('.pl-tooltip').html(tip).css({
                        'left': e.pageX + 10 + 'px',
                        'top': e.pageY - e.currentTarget.offsetTop > 14 ? e.pageY + 'px' : e.pageY + 20 + 'px'
                    }).show();
                } else {
                    $(e.currentTarget).css({opacity: '1'});
                    $('.pl-tooltip').hide(0);
                }
            });
        },

        createLoading() {
            return $('<div class="pl-loading"><div class="pl-loading-box"><div><div></div><div></div></div></div></div>');
        },

        createDownloadIframe() {
            let $div = $('<div style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:;" id="downloadIframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        },

        getMirrorList(link, mirror, thread = 2) {
            let host = new URL(link).host;
            let mirrors = [];
            for (let i = 0; i < mirror.length; i++) {
                for (let j = 0; j < thread; j++) {
                    let item = link.replace(host, mirror[i]) + '&'.repeat(j);
                    mirrors.push(item);
                }
            }
            return mirrors.join('\n');
        },

        listenElement(element, callback) {
            const checkInterval = 500; // 检查元素的间隔时间（毫秒）
            let wasElementFound = false; // 用于跟踪元素是否之前已经找到

            function checkElement() {
                if (document.querySelector(element)) {
                    wasElementFound = true;
                    callback();
                } else if (wasElementFound) {
                    wasElementFound = false; // 元素消失后重置标志
                }

                setTimeout(checkElement, checkInterval);
            }

            checkElement();
        },

        getFilterSelectors() {
            return String(base.getValue('setting_filter_selectors') || '')
                .split(/\r?\n/)
                .map(selector => selector.trim())
                .filter(Boolean);
        },

        removeFilteredElements() {
            this.getFilterSelectors().forEach((selector) => {
                try {
                    document.querySelectorAll(selector).forEach((node) => node.remove());
                } catch (e) {
                    // 用户自定义选择器可能有误，跳过该行，不影响其他过滤规则。
                }
            });
            // 这是网盘页面根容器上的状态类，只能移除类名，不能删除整个容器。
            document.querySelectorAll('.wp-s-core-pan.yunyiduo-guide-show').forEach((node) => node.classList.remove('yunyiduo-guide-show'));
        },

        addPanLinkerStyle() {
            color = base.getValue('setting_theme_color');
            let css = `
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
            `;
            this.addStyle('panlinker-style', 'style', css);
        },

    };

    let baidu = {

        _getExtra() {
            let seKey = decodeURIComponent(base.getCookie('BDCLND'));
            return '{' + '"sekey":"' + seKey + '"' + "}";
        },

        _getSurl() {
            let reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
            if (reg.test(location.href)) {
                return location.href.match(reg)[0];
            }
            return '';
        },

        _getFidList() {
            let fidlist = [];
            selectList.forEach(v => {
                if (+v.isdir === 1) return;
                fidlist.push(v.fs_id);
            });
            return '[' + fidlist + ']';
        },

        _resetData() {
            progress = {};
            $.each(request, (key) => {
                (request[key]).abort();
            });
            $.each(ins, (key) => {
                clearInterval(ins[key]);
            });
            idm = {};
            ins = {};
            request = {};
        },

        setBDUSS() {
            return new Promise((resolve) => {
                const finish = (cookies, error) => {
                    if (error) {
                        resolve('');
                        return;
                    }
                    const BDUSS = (cookies || []).find(cookie => cookie?.name === 'BDUSS' && cookie.value)?.value || '';
                    if (BDUSS) {
                        base.setStorage('baiduyunPlugin_BDUSS', {BDUSS});
                    }
                    resolve(BDUSS);
                };
                try {
                    if (typeof GM_cookie === 'undefined') {
                        resolve('');
                        return;
                    }
                    if (typeof GM_cookie.list === 'function') {
                        GM_cookie.list({name: 'BDUSS'}, finish);
                        return;
                    }
                    if (typeof GM_cookie === 'function') {
                        GM_cookie('list', {name: 'BDUSS'}, finish);
                        return;
                    }
                    resolve('');
                } catch (e) {
                    resolve('');
                }
            });
        },

        getBDUSS() {
            let baiduyunPlugin_BDUSS = base.getStorage('baiduyunPlugin_BDUSS') ? base.getStorage('baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
            return baiduyunPlugin_BDUSS.BDUSS || '';
        },

        convertLinkToAria(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                filename = base.fixFilename(filename);
                // Aria2 稳定参数：断点续传、8 线程、10MB 分片，兼顾速度和服务器压力。
                return `aria2c "${link}" -c -s 8 -x 8 -k 1M --out "${filename}" --header "User-Agent: ${ua}" --header "Cookie: BDUSS=${BDUSS}"`;
            }
            return {
                link: LOCAL_PAN_CONFIG.assistant,
                text: LOCAL_PAN_CONFIG.tampermonkeyTip
            };
        },

        convertLinkToBC(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let cookie = `BDUSS=${BDUSS}`;
                let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&cookie=${encodeURIComponent(cookie)}&user_agent=${encodeURIComponent(ua)}ZZ`;
                return encodeURIComponent(`bc://http/${base.e(bc)}`);
            }
            return {
                link: LOCAL_PAN_CONFIG.assistant,
                text: LOCAL_PAN_CONFIG.tampermonkeyTip
            };
        },

        convertLinkToCurl(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let terminal = base.getValue('setting_terminal_type');
                filename = base.fixFilename(filename);
                return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -A "${ua}" -b "BDUSS=${BDUSS}"`);
            }
            return {
                link: LOCAL_PAN_CONFIG.assistant,
                text: LOCAL_PAN_CONFIG.tampermonkeyTip
            };
        },

        buildIINAUrl(link) {
            const params = new URLSearchParams({
                url: link,
                new_window: '1',
                'mpv_user-agent': LOCAL_PAN_CONFIG.ua
            });
            const BDUSS = this.getBDUSS();
            if (BDUSS) {
                params.set('mpv_http-header-fields', `Cookie: BDUSS=${BDUSS}`);
            }
            return `iina://open?${params.toString()}`;
        },

        addPageListener() {
            if (pageListenersReady) return;
            pageListenersReady = true;

            function _factory(e) {
                let target = $(e.target);
                let item = target.parents('.pl-item');
                let link = item.find('.pl-item-link');
                let progress = item.find('.pl-item-progress');
                let tip = item.find('.pl-item-tip');
                return {
                    item, link, progress, tip, target,
                };
            }

            function _reset(i) {
                ins[i] && clearInterval(ins[i]);
                request[i] && request[i].abort();
                progress[i] = 0;
                idm[i] = false;
            }

            const toggleDropdown = ($button, open) => {
                const timer = $button.data('pl-dropdown-timer');
                if (timer) {
                    clearTimeout(timer);
                    $button.removeData('pl-dropdown-timer');
                }
                if (open) {
                    $button.addClass('button-open');
                    $button.find('.pl-dropdown-menu').show();
                    $button.children('.menu').show();
                    return;
                }
                const closeTimer = setTimeout(() => {
                    $button.removeClass('button-open');
                    $button.find('.pl-dropdown-menu').hide();
                    $button.children('.menu').hide();
                    $button.removeData('pl-dropdown-timer');
                }, 120);
                $button.data('pl-dropdown-timer', closeTimer);
            };

            doc.on('mouseenter mouseleave', '.pl-button', (e) => {
                toggleDropdown($(e.currentTarget), e.type === 'mouseenter');
            });
            doc.on('mouseenter mouseleave', '.pl-button .pl-dropdown-menu, .pl-button > .menu', (e) => {
                toggleDropdown($(e.currentTarget).closest('.pl-button'), e.type === 'mouseenter');
            });

            doc.on('click', '.pl-button-mode', async (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                await this.setBDUSS();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                let o = _factory(e);
                let $width = o.item.find('.pl-progress-inner');
                let $text = o.item.find('.pl-progress-inner-text');
                let filename = o.link[0].dataset.filename;
                let index = o.link[0].dataset.index;
                let BDUSS = baidu.getBDUSS();
                let headers = {"User-Agent": LOCAL_PAN_CONFIG.ua};
                if (BDUSS) {
                    headers.Cookie = `BDUSS=${BDUSS}`;
                }
                _reset(index);
                o.link.hide();
                o.tip.hide();
                o.progress.show();
                base.get(o.link[0].dataset.link, headers, 'blob', {filename, index}).then((res) => {
                    if (res.status !== 200) {
                        o.progress.hide();
                        o.tip.find('.pl-tip-text').html(`下载失败（状态码：${res.status || '未知'}），请重试或改用 Aria。`);
                        o.tip.show();
                        o.link.show();
                        return;
                    }
                    o.item.find('.pl-progress-stop').hide();
                    o.item.find('.pl-progress-tip').html('下载完成，正在弹出浏览器保存框！');
                }).catch(() => {
                    o.progress.hide();
                    o.tip.find('.pl-tip-text').html('下载失败，请重试或改用 Aria。');
                    o.tip.show();
                    o.link.show();
                });
                ins[index] = setInterval(() => {
                    let prog = +progress[index] || 0;
                    o.item.find('.pl-progress-tip').html('正在下载，完成后浏览器会弹出保存框。');
                    o.progress.show();
                    $width.css('width', prog + '%');
                    $text.text(prog + '%');
                    if (prog === 100) {
                        clearInterval(ins[index]);
                        progress[index] = 0;
                    }
                }, 500);
            });
            doc.on('click', '.listener-retry', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-how', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.progress.hide();
                    o.tip.show();
                }

            });
            doc.on('click', '.listener-stop', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.tip.hide();
                    o.progress.hide();
                    o.link.show(0);
                }
            });
            doc.on('click', '.listener-back', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                let target = e.currentTarget;
                if (!target.dataset.link) {
                    $(target).removeClass('listener-copy-all').addClass('pl-btn-danger').html(`${LOCAL_PAN_CONFIG.tampermonkeyTip}👉<a href="${LOCAL_PAN_CONFIG.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    if (base.setClipboard(decodeURIComponent(target.dataset.link))) {
                        $(target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
                    } else {
                        message.error('复制失败，请检查浏览器剪贴板权限！');
                    }
                }
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else if (res === 'assistant') {
                    target.addClass('pl-btn-danger').html(`${LOCAL_PAN_CONFIG.tampermonkeyTip}👉<a href="${LOCAL_PAN_CONFIG.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-batch-rename', () => {
                this.showBatchRenameDialog();
            });
            doc.on('click', '.listener-iina-play', async (e) => {
                const target = e.currentTarget;
                if (target.dataset.busy === '1') return;
                if (pt === 'share') {
                    return message.warning('提示：请先保存到我的网盘后再用 IINA 播放！');
                }
                const selected = this.getSelectedList() || [];
                if (selected.length !== 1) {
                    return message.warning('提示：请选择一个视频文件！');
                }
                const fileItem = selected[0];
                if (+fileItem.isdir === 1) {
                    return message.warning('提示：文件夹不能用 IINA 播放！');
                }
                const filename = fileItem.server_filename || fileItem.filename || '';
                if (fileItem.mediaType !== 'video' && !/\.(mp4|mkv|avi|mov|wmv|flv|m4v|ts|m2ts|webm|rmvb|mpeg|mpg|3gp)$/i.test(filename)) {
                    return message.warning('提示：请选择视频文件！');
                }
                target.dataset.busy = '1';
                try {
                    await this.setBDUSS();
                    if (!this.getBDUSS()) throw new Error('未读取到百度登录 Cookie，请刷新后重试');
                    const link = await this.getFilePCSLink(fileItem);
                    location.href = this.buildIINAUrl(link);
                    message.success('已发送到 IINA 播放！');
                } catch (error) {
                    message.error(`提示：${error?.message || 'IINA 播放失败，请刷新后重试！'}`);
                } finally {
                    target.dataset.busy = '0';
                }
            });
            doc.on('click', '.listener-rpc-task', () => {
                const rpc = {
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                    path: base.getValue('setting_rpc_path'),
                    token: base.getValue('setting_rpc_token'),
                    dir: base.getValue('setting_rpc_dir'),
                };
                Swal.fire({
                    title: 'RPC任务',
                    html: `<pre style="text-align:left;white-space:pre-wrap;word-break:break-all;margin:0">${base.escapeHtml(JSON.stringify(rpc, null, 2))}</pre>`,
                    confirmButtonText: '知道了',
                    showCloseButton: true,
                });
            });
            document.documentElement.addEventListener('mouseup', (e) => {
                if (e.target.nodeName === 'A' && ~e.target.className.indexOf('pl-a')) {
                    e.stopPropagation();
                }
            }, true);
            const handleNativeDownload = async (e) => {
                if (nativeDownloadBusy) return;
                if (e.__plNativeDownloadHandled) return;
                e.__plNativeDownloadHandled = true;
                const row = e.target.closest && e.target.closest('tr.wp-s-pan-table__body-row, tr[data-id]');
                if (!row) return;
                const downloadBtn = e.target.closest && e.target.closest('button[title="下载"], .wp-s-agile-tool-bar__h-action-button');
                const icon = downloadBtn && (downloadBtn.matches && downloadBtn.matches('i.u-icon-download') ? downloadBtn : downloadBtn.querySelector && downloadBtn.querySelector('i.u-icon-download'));
                if (!icon || !row.contains(icon) || icon.closest('.pl-button')) return;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                if (e.type !== 'click') return;
                const fileItem = this.getFileItemFromRowDom(icon);
                if (!fileItem) {
                    message.error('提示：已拦截网盘下载，但未能识别该文件信息，请刷新后重试！');
                    return;
                }
                this.trySelectRowFromDom(icon);
                if (+fileItem.isdir === 1) {
                    message.warning('提示：文件夹不能直接生成 Aria 链接！');
                    return;
                }
                mode = 'aria';
                nativeDownloadRow = row;
                nativeDownloadBusy = true;
                try {
                    await this.getPCSLink(1, [fileItem]);
                } finally {
                    setTimeout(() => {
                        nativeDownloadBusy = false;
                    }, 300);
                }
            };
            document.addEventListener('click', handleNativeDownload, true);
        },

        addButton() {
            if (!pt) return;
            this.addPageListener();
            let $toolWrap;
            let $button = $(`<div class="g-dropdown-button pointer pl-button"><div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载助手</span></span></div><div class="menu" style="width:auto;z-index:41;border-color:${color}"><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="aria">Aria下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="rpc">RPC下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="curl">cURL下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="bc">BC下载</div><li class="g-button-menu listener-iina-play">用 IINA 播放</li><li class="g-button-menu listener-batch-rename">批量更名</li><li class="g-button-menu listener-open-setting">助手设置</li>${LOCAL_PAN_CONFIG.code == 200 && version < LOCAL_PAN_CONFIG.version ? LOCAL_PAN_CONFIG.new : ''}</div></div>`);
            if (pt === 'home') $toolWrap = $(LOCAL_PAN_CONFIG.btn.home);
            if (pt === 'main') {
                $toolWrap = $(LOCAL_PAN_CONFIG.btn.main);
                $button = $(`<div class="pl-button" style="position: relative; display: inline-block; margin-right: 8px;"><button class="u-button u-button--primary u-button--small is-round is-has-icon" style="background: ${color};border-color: ${color};font-size: 14px; padding: 8px 16px; border: none;"><i class="u-icon u-icon-download"></i><span>下载助手</span></button><ul class="dropdown-list nd-common-float-menu pl-dropdown-menu"><li class="sub cursor-p pl-button-mode" data-mode="aria">Aria下载</li><li class="sub cursor-p pl-button-mode" data-mode="rpc">RPC下载</li><li class="sub cursor-p pl-button-mode" data-mode="curl">cURL下载</li><li class="sub cursor-p pl-button-mode" data-mode="bc" >BC下载</li><li class="sub cursor-p listener-batch-rename">批量更名</li><li class="sub cursor-p listener-open-setting">助手设置</li>${LOCAL_PAN_CONFIG.code == 200 && version < LOCAL_PAN_CONFIG.version ? LOCAL_PAN_CONFIG.newX : ''}</ul></div>`);
                $button.find('.listener-batch-rename').before('<li class="sub cursor-p listener-iina-play">用 IINA 播放</li>');
            }
            if (pt === 'share') $toolWrap = $(LOCAL_PAN_CONFIG.btn.share);
            if (!$toolWrap.length || $toolWrap.children('.pl-button').length) return;
            $toolWrap.prepend($button);
        },

        applyRenameDeleteText(text, deleteText) {
            let result = text;
            if (deleteText) {
                deleteText.split(/\s+/).filter(Boolean).forEach((text) => {
                    if (text === '\\s') {
                        result = result.replace(/\s+/g, '');
                        return;
                    }
                    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    result = result.replace(new RegExp(escapedText, 'gi'), '');
                });
                result = result.replace(/\s{2,}/g, ' ').trimEnd();
            }
            return result;
        },

        buildSeasonRename(filename, seasonCode, deleteText = '', useSeason = true, useDeleteText = true) {
            if (!useSeason && (!useDeleteText || !deleteText)) return null;
            const extMatch = filename.match(/(\.[^./\\]+)$/);
            const extension = extMatch?.[1] || '';
            const stem = extension ? filename.slice(0, -extension.length) : filename;

            if (!useSeason) {
                const newname = `${this.applyRenameDeleteText(stem, deleteText)}${extension}`;
                return newname !== filename ? newname : null;
            }
            if (/^S\d+E\d+(?:\s|\.|$)/i.test(filename)) return null;
            const match = stem.match(/^(\d+)(.*)$/);
            if (!match) return null;
            const episodeCode = String(Number(match[1])).padStart(2, '0');
            const suffix = useDeleteText ? this.applyRenameDeleteText(match[2], deleteText) : match[2];
            return `S${seasonCode}E${episodeCode}${suffix}${extension}`;
        },

        getBdstoken() {
            try {
                const data = typeof locals?.dump === 'function' ? locals.dump() : locals;
                const token = data?.bdstoken?.value || data?.bdstoken || data?.userInfo?.bdstoken;
                if (token) return token;
            } catch (e) {
            }
            const windowToken = window.locals?.bdstoken?.value || window.locals?.bdstoken || window.locals?.userInfo?.bdstoken;
            if (windowToken) return windowToken;

            // 新版网盘将登录上下文写入页面脚本，油猴隔离环境无法直接读取页面 window.locals。
            for (const script of document.scripts) {
                const text = script.textContent || '';
                if (!text.includes('bdstoken')) continue;
                const match = text.match(/["']bdstoken["']\s*:\s*["']([^"']+)["']/);
                if (match?.[1]) return match[1];
            }
            return '';
        },

        async showBatchRenameDialog() {
            const selected = this.getSelectedList() || [];
            if (!selected.length) {
                return message.error('提示：请先勾选要更名的文件！');
            }

            const seasonDialog = await Swal.fire({
                title: '批量更名',
                html: `<div style="max-width:440px;margin:0 auto;text-align:left;">
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:14px;line-height:22px;color:#262626;"><input id="pl-use-season" type="checkbox" checked>应用 Season 号</label>
                    <input id="pl-season-number" class="pl-rename-input" value="01" inputmode="numeric" autocomplete="off" style="display:block;width:100%;height:40px;margin:0 0 16px;padding:4px 11px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;background:#fff;color:#262626;font-size:14px;line-height:1.5;outline:none;transition:border-color .2s,box-shadow .2s;">
                    <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:14px;line-height:22px;color:#262626;"><input id="pl-use-delete-text" type="checkbox" checked>应用删除字符（多个字符用空格分隔，\\s 表示空格）</label>
                    <input id="pl-delete-text" class="pl-rename-input" placeholder="例如：4k ~ - \\s" autocomplete="off" style="display:block;width:100%;height:40px;margin:0;padding:4px 11px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;background:#fff;color:#262626;font-size:14px;line-height:1.5;outline:none;transition:border-color .2s,box-shadow .2s;">
                </div>`,
                showCancelButton: true,
                confirmButtonText: '生成预览',
                cancelButtonText: '取消',
                showCloseButton: true,
                focusConfirm: false,
                didOpen: () => {
                    const seasonInput = document.getElementById('pl-season-number');
                    const deleteInput = document.getElementById('pl-delete-text');
                    const seasonCheck = document.getElementById('pl-use-season');
                    const deleteCheck = document.getElementById('pl-use-delete-text');
                    const syncEnabled = () => {
                        seasonInput.disabled = !seasonCheck.checked;
                        deleteInput.disabled = !deleteCheck.checked;
                    };
                    seasonCheck.addEventListener('change', syncEnabled);
                    deleteCheck.addEventListener('change', syncEnabled);
                    syncEnabled();
                    seasonInput.focus();
                    seasonInput.select();
                },
                preConfirm: () => {
                    const season = document.getElementById('pl-season-number').value.trim();
                    const deleteText = document.getElementById('pl-delete-text').value.trim();
                    const useSeason = document.getElementById('pl-use-season').checked;
                    const useDeleteText = document.getElementById('pl-use-delete-text').checked;
                    if (useSeason && !/^\d+$/.test(season)) {
                        Swal.showValidationMessage('Season 号只能输入数字');
                        return false;
                    }
                    return {season, deleteText, useSeason, useDeleteText};
                }
            });
            if (!seasonDialog.isConfirmed) return;

            const buildPreviewData = (season, deleteText, useSeason, useDeleteText) => {
                const seasonCode = useSeason ? String(Number(season)).padStart(2, '0') : '';
                const renameList = [];
                const previewList = [];
                const skippedList = [];

                selected.forEach((item) => {
                    const filename = item.server_filename || item.filename || '';
                    if (+item.isdir === 1) {
                        skippedList.push(`${filename || '未命名项目'}（文件夹）`);
                        return;
                    }
                    if (!item.path) {
                        skippedList.push(`${filename || '未命名项目'}（缺少文件路径）`);
                        return;
                    }
                    const newname = this.buildSeasonRename(filename, seasonCode, deleteText, useSeason, useDeleteText);
                    if (!newname) {
                        skippedList.push(`${filename || '未命名项目'}（当前规则不适用或名称未变化）`);
                        return;
                    }
                    renameList.push({path: item.path, newname});
                    previewList.push({filename, newname});
                });
                return {seasonCode, deleteText, useSeason, useDeleteText, renameList, previewList, skippedList};
            };
            const renderRows = (previewList) => previewList.map((item) => `<tr><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;word-break:break-all;cursor:text;">${base.escapeHtml(item.filename)}</td><td style="padding:9px 12px;border-bottom:1px solid #f0f0f0;color:#1677ff;word-break:break-all;cursor:text;">${base.escapeHtml(item.newname)}</td></tr>`).join('');
            const renderSkipped = (skippedList) => skippedList.length ? `<div style="margin-top:12px;padding:10px 12px;background:#fff7e6;border:1px solid #ffd591;border-radius:6px;text-align:left;color:#ad6800;word-break:break-all;user-select:text;-webkit-user-select:text;">将跳过 ${skippedList.length} 项：<br>${skippedList.map(base.escapeHtml).join('<br>')}</div>` : '';

            let previewData = buildPreviewData(seasonDialog.value.season, seasonDialog.value.deleteText, seasonDialog.value.useSeason, seasonDialog.value.useDeleteText);
            if (!previewData.renameList.length) {
                return Swal.fire({
                    icon: 'info',
                    title: '没有可更名的文件',
                    text: '当前规则没有产生名称变化；应用 Season 时仅处理数字开头且尚未采用 SxxExx 格式的文件。',
                    confirmButtonText: '知道了'
                });
            }

            let previewFresh = true;
            const confirmDialog = await Swal.fire({
                title: '批量更名预览',
                html: `<div style="margin-bottom:12px;padding:12px 14px;border:1px solid #d9d9d9;border-radius:6px;background:#fafafa;text-align:left;">
                    <div style="display:grid;grid-template-columns:140px minmax(200px,1fr) auto;gap:10px;align-items:end;">
                        <label style="font-size:13px;color:#262626;"><span style="display:flex;align-items:center;gap:6px;"><input id="pl-preview-use-season" type="checkbox" ${previewData.useSeason ? 'checked' : ''}>应用 Season 号</span><input id="pl-preview-season" class="pl-rename-input" value="${base.escapeAttr(previewData.seasonCode || seasonDialog.value.season)}" inputmode="numeric" autocomplete="off" style="display:block;width:100%;height:36px;margin-top:5px;padding:4px 10px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;background:#fff;font-size:13px;outline:none;"></label>
                        <label style="font-size:13px;color:#262626;"><span style="display:flex;align-items:center;gap:6px;"><input id="pl-preview-use-delete-text" type="checkbox" ${previewData.useDeleteText ? 'checked' : ''}>应用删除字符</span><input id="pl-preview-delete-text" class="pl-rename-input" value="${base.escapeAttr(previewData.deleteText)}" placeholder="例如：4k ~ - \\s" autocomplete="off" style="display:block;width:100%;height:36px;margin-top:5px;padding:4px 10px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;background:#fff;font-size:13px;outline:none;"></label>
                        <button id="pl-refresh-rename-preview" type="button" class="pl-btn-primary" style="height:36px;margin:0;white-space:nowrap;">刷新预览</button>
                    </div>
                    <div id="pl-rename-preview-status" style="margin-top:8px;font-size:12px;color:#8c8c8c;">当前规则：${previewData.useSeason ? `S${base.escapeHtml(previewData.seasonCode)}` : '不添加 Season'}，${previewData.useDeleteText ? `删除字符：${base.escapeHtml(previewData.deleteText || '无')}` : '不删除字符'}</div>
                </div>
                <div style="max-height:360px;overflow:auto;border:1px solid #f0f0f0;border-radius:6px;"><table class="pl-rename-preview-table" style="width:100%;border-collapse:collapse;text-align:left;font-size:13px;"><thead style="position:sticky;top:0;background:#fafafa;z-index:1;"><tr><th style="padding:9px 12px;">原文件名</th><th style="padding:9px 12px;">新文件名</th></tr></thead><tbody id="pl-rename-preview-body">${renderRows(previewData.previewList)}</tbody></table></div><div id="pl-rename-preview-skipped">${renderSkipped(previewData.skippedList)}</div>`,
                width: 760,
                showCancelButton: true,
                confirmButtonText: '确认更名',
                cancelButtonText: '取消',
                showCloseButton: true,
                focusCancel: true,
                didOpen: () => {
                    const seasonInput = document.getElementById('pl-preview-season');
                    const deleteInput = document.getElementById('pl-preview-delete-text');
                    const seasonCheck = document.getElementById('pl-preview-use-season');
                    const deleteCheck = document.getElementById('pl-preview-use-delete-text');
                    const refreshButton = document.getElementById('pl-refresh-rename-preview');
                    const status = document.getElementById('pl-rename-preview-status');
                    const markChanged = () => {
                        previewFresh = false;
                        status.textContent = '规则已修改，请刷新预览';
                        status.style.color = '#d46b08';
                    };
                    seasonInput.addEventListener('input', markChanged);
                    deleteInput.addEventListener('input', markChanged);
                    seasonCheck.addEventListener('change', markChanged);
                    deleteCheck.addEventListener('change', markChanged);
                    refreshButton.addEventListener('click', () => {
                        const season = seasonInput.value.trim();
                        const deleteText = deleteInput.value.trim();
                        const useSeason = seasonCheck.checked;
                        const useDeleteText = deleteCheck.checked;
                        if (useSeason && !/^\d+$/.test(season)) {
                            status.textContent = 'Season 号只能输入数字';
                            status.style.color = '#ff4d4f';
                            return;
                        }
                        previewData = buildPreviewData(season, deleteText, useSeason, useDeleteText);
                        document.getElementById('pl-rename-preview-body').innerHTML = renderRows(previewData.previewList);
                        document.getElementById('pl-rename-preview-skipped').innerHTML = renderSkipped(previewData.skippedList);
                        previewFresh = true;
                        status.textContent = `当前规则：${useSeason ? `S${previewData.seasonCode}` : '不添加 Season'}，${useDeleteText ? `删除字符：${deleteText || '无'}` : '不删除字符'}，可更名 ${previewData.renameList.length} 个文件`;
                        status.style.color = previewData.renameList.length ? '#389e0d' : '#ff4d4f';
                    });
                },
                preConfirm: () => {
                    if (!previewFresh) {
                        Swal.showValidationMessage('规则已修改，请先刷新预览');
                        return false;
                    }
                    if (!previewData.renameList.length) {
                        Swal.showValidationMessage('当前规则下没有可更名的文件');
                        return false;
                    }
                    return previewData;
                }
            });
            if (!confirmDialog.isConfirmed) return;
            const {renameList, skippedList} = confirmDialog.value;

            const bdstoken = this.getBdstoken();
            if (!bdstoken) {
                return message.error('提示：未读取到登录信息，请刷新百度网盘后重试！');
            }

            Swal.fire({
                title: '正在批量更名',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => Swal.showLoading()
            });

            const url = `https://pan.baidu.com/api/filemanager?opera=rename&async=2&onnest=fail&channel=chunlei&web=1&app_id=250528&clienttype=0&bdstoken=${encodeURIComponent(bdstoken)}`;
            let rawResponse = '';
            try {
                let res = await base.post(url, base.stringify({filelist: JSON.stringify(renameList)}), {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                });
                rawResponse = typeof res === 'string' ? res : JSON.stringify(res, null, 2);
                if (typeof res === 'string') res = JSON.parse(res);
                if (+res.errno !== 0) {
                    throw new Error(`百度接口错误码：${res.errno ?? '未知'}${res.errmsg ? `，${res.errmsg}` : ''}`);
                }
                Swal.close();
                message.success(`批量更名已提交：${renameList.length} 个文件${skippedList.length ? `，跳过 ${skippedList.length} 项` : ''}`);
                setTimeout(() => location.reload(), 1000);
            } catch (e) {
                const errorInfo = [
                    '网盘直链下载助手NG - 批量更名失败',
                    `时间：${new Date().toLocaleString()}`,
                    `更名文件数：${renameList.length}`,
                    `错误信息：${e?.message || '未知错误'}`,
                    '',
                    '百度接口响应：',
                    rawResponse || '未收到响应'
                ].join('\n');
                const errorDialog = await Swal.fire({
                    icon: 'error',
                    title: '批量更名失败',
                    html: `<textarea readonly style="display:block;width:100%;height:220px;padding:10px 12px;box-sizing:border-box;border:1px solid #d9d9d9;border-radius:6px;background:#fafafa;color:#262626;font:12px/1.6 monospace;resize:vertical;outline:none;">${base.escapeHtml(errorInfo)}</textarea>`,
                    width: 680,
                    showCancelButton: true,
                    confirmButtonText: '复制错误信息',
                    cancelButtonText: '关闭',
                    showCloseButton: true
                });
                if (errorDialog.isConfirmed) {
                    if (base.setClipboard(errorInfo)) {
                        message.success('错误信息已复制到剪贴板！');
                    } else {
                        message.error('复制失败，请检查浏览器剪贴板权限！');
                    }
                }
            }
        },

        async getToken() {
            const openTab = () => {
                const clientId = encodeURIComponent(base.getValue('setting_baidu_appkey') || '');
                const authorizeUrl = `${LOCAL_PAN_CONFIG.pcs[3]}?client_id=${clientId}&response_type=token&redirect_uri=oob&confirm_login=0&scope=basic,netdisk`;
                GM_openInTab(authorizeUrl, {active: false, insert: true, setParent: true});
                base.deleteValue('baidu_access_token');
            };

            const waitForToken = () => new Promise((resolve) => {
                let attempts = 0;
                const interval = setInterval(() => {
                    const token = base.getValue('baidu_access_token');
                    if (token) {
                        clearInterval(interval);
                        resolve(token);
                    }
                    attempts++;
                    if (attempts > 60) {
                        clearInterval(interval);
                        resolve('');
                    }
                }, 1000);
            });

            if (manageHandler === 'Tampermonkey' && base.getMajorVersion(manageVersion) >= 5) {
                openTab();
                return waitForToken();
            }
            let res = await base.getFinalUrl(LOCAL_PAN_CONFIG.pcs[3]);

            if (!res.includes('authorize') && !res.includes('access_token=')) {
                openTab();
                return waitForToken();
            }
            if (res.includes('authorize')) {
                const clientId = encodeURIComponent(base.getValue('setting_baidu_appkey') || '');
                const authorizeUrl = `${LOCAL_PAN_CONFIG.pcs[3]}?client_id=${clientId}&response_type=token&redirect_uri=oob&confirm_login=0&scope=basic,netdisk`;
                let html = await base.get(authorizeUrl, {}, 'text');
                let bdstoken = html.match(/name="bdstoken"\s+value="([^"]+)"/)?.[1];
                let client_id = html.match(/name="client_id"\s+value="([^"]+)"/)?.[1];
                let data = {
                    grant_permissions_arr: 'netdisk',
                    bdstoken: bdstoken,
                    client_id: client_id,
                    response_type: "token",
                    display: "page",
                    grant_permissions: "basic,netdisk"
                };
                await base.post(authorizeUrl, base.stringify(data), {
                    'Content-Type': 'application/x-www-form-urlencoded',
                });
                let res2 = await base.getFinalUrl(authorizeUrl);
                let accessToken = res2.match(/access_token=([^&]+)/)?.[1];
                accessToken && base.setValue('baidu_access_token', accessToken);
                return accessToken;
            }
            let accessToken = res.match(/access_token=([^&]+)/)?.[1];
            accessToken && base.setValue('baidu_access_token', accessToken);
            return accessToken;
        },

        async getPCSLink(maxRequestTime = 1, customList = null, downloadMode = mode) {
            selectList = customList || this.getSelectedList();
            let fidList = this._getFidList(), url, res;

            if (pt === 'home' || pt === 'main') {
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                fidList = encodeURIComponent(fidList);
                let accessToken = base.getValue('baidu_access_token') || await this.getToken();
                url = `${LOCAL_PAN_CONFIG.pcs[0]}&fsids=${fidList}&access_token=${accessToken}`;
                res = await base.get(url, {"User-Agent": LOCAL_PAN_CONFIG.ua});
            }
            if (pt === 'share') {
                this.getShareData();
                if (!params.bdstoken) {
                    return message.error('提示：请先登录网盘！');
                }
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                let dialog = await Swal.fire({
                    toast: true,
                    icon: 'info',
                    title: `提示：请将文件<span class="tag-danger">[保存到网盘]</span>👉前往<span class="tag-danger">[我的网盘]</span>中下载！`,
                    showConfirmButton: true,
                    confirmButtonText: '点击保存',
                    position: 'top',
                });
                if (dialog.isConfirmed) {
                    $('.tools-share-save-hb')[0].click();
                }
                return;
            }
            if (res.errno === 0) {
                const generated = this.generateDom(res.list, downloadMode);
                this.showMainDialog(
                    pan[downloadMode][0],
                    generated.html,
                    pan[downloadMode][1],
                    downloadMode,
                    generated.clipboardText
                );
            } else if (res.errno === 112) {
                return message.error('提示：页面过期，请刷新重试！');
            } else if (res.errno === 9019) {
                maxRequestTime--;
                await this.getToken();
                if (maxRequestTime > 0) {
                    await this.getPCSLink(maxRequestTime, customList, downloadMode);
                } else {
                    message.error('提示：获取下载链接失败！请刷新网页后重试！');
                }
            } else {
                base.deleteValue('baidu_access_token');
                message.error('提示：获取下载链接失败！请刷新网页后重试！');
            }
        },

        async getFilePCSLink(fileItem, maxRequestTime = 1) {
            if (!fileItem?.fs_id) throw new Error('未读取到文件信息');
            const accessToken = base.getValue('baidu_access_token') || await this.getToken();
            if (!accessToken) throw new Error('未获取到百度授权信息');
            const url = `${LOCAL_PAN_CONFIG.pcs[0]}&fsids=${encodeURIComponent(`[${fileItem.fs_id}]`)}&access_token=${encodeURIComponent(accessToken)}`;
            const res = await base.get(url, {"User-Agent": LOCAL_PAN_CONFIG.ua});
            if (res?.errno === 9019) {
                base.deleteValue('baidu_access_token');
                if (maxRequestTime > 0) {
                    await this.getToken();
                    return this.getFilePCSLink(fileItem, maxRequestTime - 1);
                }
                throw new Error('百度授权已过期，请重新点击后完成授权');
            }
            if (res?.errno !== 0 || !res?.list?.[0]?.dlink) {
                throw new Error(res?.errmsg || '获取视频原始地址失败');
            }
            return `${res.list[0].dlink}&access_token=${accessToken}`;
        },

        async getVideoPagePCSLink() {
            const filePath = new URLSearchParams(location.search).get('path');
            if (!filePath) throw new Error('未读取到当前视频路径');

            const metaUrl = `https://pan.baidu.com/api/filemetas?target=${encodeURIComponent(JSON.stringify([filePath]))}&dlink=1`;
            const metaRes = await base.get(metaUrl, {"User-Agent": LOCAL_PAN_CONFIG.ua});
            const fileInfo = metaRes?.info?.[0];
            if (metaRes?.errno !== 0 || !fileInfo?.fs_id) {
                throw new Error(metaRes?.errmsg || '未读取到当前视频信息');
            }
            return this.getFilePCSLink(fileInfo);
        },

        addIINAButton() {
            if (document.querySelector('.pl-iina-button')) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'pl-iina-button';
            button.innerHTML = '<span class="pl-iina-button-icon">▶</span><span>用 IINA 播放</span>';
            button.addEventListener('click', async () => {
                if (button.disabled) return;
                button.disabled = true;
                button.lastElementChild.textContent = '正在获取原始地址';
                try {
                    await this.setBDUSS();
                    if (!this.getBDUSS()) throw new Error('未读取到百度登录 Cookie，请刷新后重试');
                    const link = await this.getVideoPagePCSLink();
                    location.href = this.buildIINAUrl(link);
                    message.success('已发送到 IINA 播放！');
                } catch (e) {
                    message.error(`提示：${e?.message || 'IINA 播放失败，请刷新后重试！'}`);
                } finally {
                    button.disabled = false;
                    button.lastElementChild.textContent = '用 IINA 播放';
                }
            });
            document.body.appendChild(button);
        },

        generateDom(list, downloadMode = mode) {
            let content = '<div class="pl-main"><div class="pl-table-head"><div class="pl-th-name">文件名</div><div class="pl-th-size">大小</div><div class="pl-th-action">操作</div></div>';
            let alinkAllText = '';
            base.sortByName(list);
            list.forEach((v, i) => {
                if (v.isdir === 1) return;
                let filename = v.server_filename || v.filename;
                let safeFilename = base.escapeHtml(filename);
                let filenameAttr = base.escapeAttr(filename);
                let ext = base.getExtension(filename);
                let safeExt = base.escapeHtml(ext);
                let size = base.sizeFormat(v.size);
                let safeSize = base.escapeAttr(size);
                let dlink = v.dlink + '&access_token=' + base.getValue('baidu_access_token');
                let dlinkAttr = base.escapeAttr(dlink);
                let dlinkText = base.escapeHtml(dlink);
                if (downloadMode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a listener-link-api" href="${dlinkAttr}" data-filename="${filenameAttr}" data-link="${dlinkAttr}" data-index="${i}">${dlinkText}</a>
                                <div class="pl-item-tip" style="display: none"><span class="pl-tip-text">点击后将由脚本下载，完成后由浏览器保存。</span> <span class="pl-back listener-back">返回</span></div>
                                <div class="pl-item-progress" style="display: none">
                                    <div class="pl-progress">
                                        <div class="pl-progress-outer"></div>
                                        <div class="pl-progress-inner" style="width:5%">
                                          <div class="pl-progress-inner-text">0%</div>
                                        </div>
                                    </div>
                                    <span class="pl-progress-stop listener-stop">取消下载</span>
                                    <span class="pl-progress-tip">正在准备下载</span>
                                    <span class="pl-progress-how listener-how">下载说明</span>
                                </div></div>`;
                }
                if (downloadMode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, LOCAL_PAN_CONFIG.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${base.escapeAttr(alink.link)}" data-filename="${filenameAttr}" data-link="${base.escapeAttr(alink.link)}">${base.escapeHtml(decodeURIComponent(alink.text))}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        let alinkText = base.escapeHtml(decodeURIComponent(alink));
                        let alinkAttr = base.escapeAttr(encodeURIComponent(alink));
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alinkAttr}" title="点击复制aria2c链接" data-filename="${filenameAttr}" data-link="${alinkAttr}">${alinkText}</a> </div>`;
                    }
                }
                if (downloadMode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filenameAttr}" data-link="${dlinkAttr}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (downloadMode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, LOCAL_PAN_CONFIG.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${base.escapeAttr(alink.link)}" data-filename="${filenameAttr}" data-link="${base.escapeAttr(alink.link)}">${base.escapeHtml(decodeURIComponent(alink.text))}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        let alinkText = base.escapeHtml(decodeURIComponent(alink));
                        let alinkAttr = base.escapeAttr(encodeURIComponent(alink));
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alinkAttr}" title="点击复制curl链接" data-filename="${filenameAttr}" data-link="${alinkAttr}">${alinkText}</a> </div>`;
                    }
                }
                if (downloadMode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, LOCAL_PAN_CONFIG.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${base.escapeAttr(alink.link)}" data-filename="${filenameAttr}" data-link="${base.escapeAttr(alink.link)}">${base.escapeHtml(decodeURIComponent(alink.text))}</a> </div>`;
                    } else {
                        let alinkHref = base.escapeAttr(decodeURIComponent(alink));
                        let alinkText = base.escapeHtml(decodeURIComponent(alink));
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${safeSize}">${safeFilename}</div>
                                <div class="pl-item-size">${safeSize}</div>
                                <a class="pl-item-link pl-a" href="${alinkHref}" title="点击用比特彗星下载" data-filename="${filenameAttr}" data-link="${base.escapeAttr(alink)}">${alinkText}</a> </div>`;
                    }

                }
            });
            content += '</div>';
            if (downloadMode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${base.escapeAttr(encodeURIComponent(alinkAllText))}">复制全部链接</button></div>`;
            if (downloadMode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (downloadMode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${base.escapeAttr(encodeURIComponent(alinkAllText))}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return {
                html: content,
                clipboardText: downloadMode === 'aria' || downloadMode === 'curl' ? alinkAllText : ''
            };
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };
            let BDUSS = this.getBDUSS();
            if (!BDUSS) return 'assistant';

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`User-Agent: ${LOCAL_PAN_CONFIG.ua}`, `Cookie: BDUSS=${BDUSS}`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"User-Agent": LOCAL_PAN_CONFIG.ua}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return require('system-core:context/context.js').instanceForSystem.list.getSelected();
            } catch (e) {
                return document.querySelector('.wp-s-core-pan').__vue__.selectedList;
            }
        },

        getCurrentFileList() {
            try {
                return require('system-core:context/context.js').instanceForSystem.list.listData || [];
            } catch (e) {
                try {
                    return document.querySelector('.wp-s-core-pan').__vue__.fileList || [];
                } catch (err) {
                    return [];
                }
            }
        },

        getFileItemFromRowDom(dom) {
            const row = dom.closest && dom.closest('tr.wp-s-pan-table__body-row, tr[data-id]');
            const fileId = row?.dataset?.id || '';
            const list = this.getCurrentFileList();
            const byId = list.find(v => String(v.fs_id) === String(fileId));
            if (byId) return byId;

            const nameNode = row?.querySelector?.('.wp-s-pan-list__file-name-title-text');
            const fileName = (nameNode?.innerText || '').trim().replace(/\s+/g, ' ');
            if (fileName) {
                const byName = list.find(v => {
                    const name = (v.server_filename || v.filename || '').trim().replace(/\s+/g, ' ');
                    return name && name === fileName;
                });
                if (byName) return byName;
            }
            return null;
        },

        getRowCheckboxFromDom(dom) {
            const row = dom.closest && (dom.closest('.wp-s-pan-list__item, .wp-s-pan-list__row, .wp-s-pan-list__cell, li, tr, [role="row"]') || dom.parentElement);
            if (!row) return null;
            return row.querySelector('input[type="checkbox"], .wp-s-pan-list__checkbox, .u-checkbox, .check-box, [role="checkbox"]');
        },

        trySelectRowFromDom(dom) {
            const checkbox = this.getRowCheckboxFromDom(dom);
            if (!checkbox) return false;
            const checked = checkbox.getAttribute('aria-checked') === 'true' || checkbox.classList.contains('is-checked') || checkbox.checked;
            if (!checked) {
                checkbox.click();
            }
            return true;
        },

        tryUnselectRowFromDom(dom) {
            const checkbox = this.getRowCheckboxFromDom(dom);
            if (!checkbox) return false;
            const checked = checkbox.getAttribute('aria-checked') === 'true' || checkbox.classList.contains('is-checked') || checkbox.checked;
            if (checked) {
                checkbox.click();
            }
            return true;
        },

        resolveFileItemFromDom(dom) {
            const nameNode = dom.closest && dom.closest('.wp-s-pan-list__file-name');
            const fileName = (nameNode?.innerText || dom.innerText || dom.getAttribute?.('title') || '').trim().replace(/\s+/g, ' ');
            const list = this.getCurrentFileList();
            const byName = list.find(v => {
                const name = (v.server_filename || v.filename || '').trim().replace(/\s+/g, ' ');
                return name && fileName && name === fileName;
            });
            if (byName) return byName;

            const seen = new Set();
            const scan = (value, depth = 0) => {
                if (!value || depth > 6) return null;
                if (typeof value !== 'object') return null;
                if (seen.has(value)) return null;
                seen.add(value);
                if (Array.isArray(value)) {
                    for (const item of value) {
                        const found = scan(item, depth + 1);
                        if (found) return found;
                    }
                    return null;
                }
                if (value.fs_id && (value.filename || value.server_filename)) {
                    return value;
                }
                for (const key of Object.keys(value)) {
                    const found = scan(value[key], depth + 1);
                    if (found) return found;
                }
                return null;
            };

            const pool = [];
            for (let node = dom; node; node = node.parentElement) {
                try {
                    const reactNode = this.findReact(node);
                    reactNode && pool.push(reactNode);
                } catch (e) {
                }
                for (const key of Object.keys(node)) {
                    if (key.startsWith('__reactProps$') || key.startsWith('__reactFiber$')) {
                        pool.push(node[key]);
                    }
                }
            }
            pool.push(dom);
            for (const item of pool) {
                const found = scan(item);
                if (found) return found;
            }
            return null;
        },

        getLogid() {
            let ut = require("system-core:context/context.js").instanceForSystem.tools.baseService;
            return ut.base64Encode(base.getCookie("BAIDUID"));
        },

        getShareData() {
            let res = locals.dump();
            params.shareType = 'secret';
            params.sign = '';
            params.timestamp = '';
            params.bdstoken = res.bdstoken.value;
            params.channel = 'chunlei';
            params.clienttype = 0;
            params.web = 1;
            params.app_id = 250528;
            params.encrypt = 0;
            params.product = 'share';
            params.logid = this.getLogid();
            params.primaryid = res.shareid.value;
            params.uk = res.share_uk.value;
            params.shareType === 'secret' && (params.extra = this._getExtra());
            params.surl = this._getSurl();
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/disk\/home/.test(path)) return 'home';
            if (/^\/disk\/main/.test(path)) return 'main';
            if (/^\/pfile\/video/.test(path)) return 'video';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
            return '';
        },

        showMainDialog(title, html, footer, downloadMode, clipboardText = '') {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            }).then(() => {
                this._resetData();
            });
            if (downloadMode === 'aria') {
                if (!clipboardText.trim()) {
                    message.error('未读取到百度登录 Cookie，无法生成 aria2c 命令，请刷新百度网盘后重试！');
                    return;
                }
                const copied = base.setClipboard(clipboardText);
                copied
                    ? message.success('aria2c 链接已自动复制到剪切板！')
                    : message.error('自动复制失败，请点击“复制全部链接”重试！');
                if (nativeDownloadRow) {
                    setTimeout(() => {
                        this.tryUnselectRowFromDom(nativeDownloadRow);
                        nativeDownloadRow = null;
                    }, 0);
                }
            }
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            pan = LOCAL_PAN_CONFIG;
            base.setValue('setting_init_code', LOCAL_PAN_CONFIG.num);
            base.setValue('license', LOCAL_PAN_CONFIG.license);
            if (pt === 'video') {
                this.addIINAButton();
                base.registerMenuCommand();
                return;
            }
            base.removeFilteredElements();
            if (!window.__plYunyiduoObserver) {
                window.__plYunyiduoObserver = new MutationObserver(() => base.removeFilteredElements());
                window.__plYunyiduoObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
            }
            if (!yunyiduoTimer) {
                yunyiduoTimer = setInterval(() => base.removeFilteredElements(), 1000);
            }
            // 页面过滤规则可在助手设置中修改，默认保留现有广告与云一朵规则。
            this.addButton();
            base.createTip();
            base.registerMenuCommand();
        },

        async initAuthorize() {
            let ins = setInterval(() => {
                if (/openapi.baidu.com\/oauth\/2.0\/authorize/.test(location.href)) {
                    let confirmButton = document.querySelector('#auth-allow');
                    if (confirmButton) {
                        confirmButton.click();
                        return;
                    }
                }
                if (/openapi.baidu.com\/oauth\/2.0\/login_success/.test(location.href)) {
                    if (location.href.includes('access_token')) {
                        let token = location.href.match(/access_token=(.*?)&/)[1];
                        base.setValue('baidu_access_token', token);
                        window.close();
                    }
                }
            }, 200);
        }
    };

    let main = {
        init() {
            if (/openapi.baidu.com\/oauth/.test(location.href)) {
                baidu.initAuthorize();
                return;
            }
            if (/(pan|yun).baidu.com/.test(location.host)) {
                baidu.initPanLinker();
            }
        }
    };

    main.init();
})();
