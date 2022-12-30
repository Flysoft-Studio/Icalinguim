# Icalinguim · [![License](https://img.shields.io/aur/license/icalingua++)](https://github.com/Flysoft-Studio/Icalinguim/blob/develop/LICENSE)

**🛠️WIP: 此项目正在进行中，可能有很多 bug，欢迎大家提交 PR。**

Icalinguim 是 Icalingua++ 的分支，为 Icalingua++ 带来更强大的功能，如消息加密等，同时欢迎社区向此仓库或向上游仓库提交 PR，让两个项目都变得更好。

Icalingua 这个名字是日语中「光」和拉丁语中「语言」的组合。

更多信息可查看 [https://github.com/Icalingua-plus-plus/Icalingua-plus-plus](https://github.com/Icalingua-plus-plus/Icalingua-plus-plus)

### 计划

-   [x] 完成语言统一
-   [x] 加密通讯
-   [ ] 简化操作逻辑 (WIP)
-   [ ] 解决部分视频无法解码的问题

### 其他信息

1. Icalinguim 只提供 x86_64 版本，并且只提供给 Windows，macOS 两个平台，如果您的设备使用 i686，arm，aarch64 架构处理器，亦或者使用 Linux，请自行编译，或者 Fork 此项目并使用 Icalingua++ 的 Workflow 稍加修改后使用 GitHub Action 编译（可能需要半小时完成编译）。
2. Icalinguim 支持直接使用 Icalingua++ 保存的数据，无需额外迁移。
3. 由于 Electron 内置解码器问题，部分视频可能无法播放。

### 常用启动参数

-   禁用硬件加速: `--dha`
-   启动时隐藏主界面: `--hide`
-   指定配置: `--config xxx.yaml`

### 免责声明

本开源项目仅用于学习和交流会话前端框架实现，一切开发旨在学习，请勿用于非法用途。本项目使用 AGPL-3.0 许可，完全免费开源，不收取任何费用。请勿将本项目用于商业用途。**因使用本项目调用不同 Adapter 后端接口（如 oicq）产生的一切问题与后果由使用者自行承担，项目开发者不承担任何责任。**

⚠️ 本项目基于 AGPL 发行。修改、再发行和运行服务需要遵守 AGPL 许可证，源码需要和服务一起提供。
