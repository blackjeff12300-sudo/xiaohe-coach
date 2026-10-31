# 鹤习 · 小鹤双拼教练

一个手机优先、无需后端的静态 Web App，可直接部署到 GitHub Pages。支持手机与 PC 自适应界面、键位诊断、专项练习、零声母训练、中文跟打测速、自选文本和本地学习记录。

## 功能

- **水平诊断**：24 道随机题，覆盖特殊声母、韵母键位、两键音节和零声母，输出分项表现与初步等级。
- **自适应弱项练习**：根据最近练习表现选择较弱类别，并优先复习做错的项目。
- **专项训练**：声母、韵母、音节编码、零声母和综合随机练习。
- **真实中文跟打测速**：可选 30 / 60 / 120 秒和不同素材，或粘贴自己的文本，统计字/分钟与文本准确率。
- **键位速查**：可点击小鹤键盘查看每个按键映射。
- **手机 / PC 适配**：自动识别触屏或桌面环境，也允许手动切换；手机练习提供屏幕字母键盘。
- **PWA / 离线缓存**：部署到 HTTPS 后，可添加到手机主屏幕；首次加载后支持离线打开。
- **隐私**：无账号、无服务器、无数据上传。诊断与练习记录存储在当前浏览器的 `localStorage`。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个 repository，例如 `xiaohe-coach`。
2. 将本文件夹内的所有文件上传到 repository 根目录：`index.html`、`styles.css`、`app.js`、`manifest.webmanifest`、`sw.js`、`icon.svg`、`icon-192.png`、`icon-512.png`。
3. 打开 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 里选择 **Deploy from a branch**。
5. Branch 选择 `main`，目录选择 `/(root)`，按 **Save**。
6. 等待 GitHub Pages 部署完成，打开显示的 `https://你的用户名.github.io/xiaohe-coach/` 地址。

> 若 repository 名称不是 `xiaohe-coach`，Pages 地址中的路径会使用你的 repository 名称。项目使用相对路径，通常无需修改代码。

## 添加到手机

- **Android / Chrome**：打开 GitHub Pages 地址，使用浏览器菜单中的「安装应用」或「添加到主屏幕」。
- **iPhone / Safari**：打开网址，点分享按钮，再选择「加入主屏幕」。

## 重要说明

1. 本工具诊断的是用户对小鹤双拼键位与编码规则的掌握程度，并不读取或验证系统当前启用的输入法方案。
2. 跟打测速会比较最终输入的中文文本，但浏览器无法确认用户是否真的使用了小鹤双拼；测速前请自行切换到小鹤双拼，并避免复制粘贴。
3. 诊断等级是依据本应用题库得出的学习参考，不是标准化考试或专业认证。
4. 目前按小鹤双拼常见布局设计。不同输入法对个别零声母音节可能提供兼容输入方式；练习题以页面列出的规则为准。
5. 清除浏览器网站数据或更换设备 / 浏览器后，本地记录可能消失。需要跨设备同步时，后续可以再加入账号与云端数据库。

## 项目结构

```text
xiaohe-coach/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── sw.js
├── icon.svg
├── icon-192.png
├── icon-512.png
└── README.md
```

## 本地预览

建议通过本地静态服务器打开（Service Worker 不支持普通 `file://` 页面）：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。
