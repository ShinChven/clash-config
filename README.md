# Clash Config

> - Clash config generator.
> - Proxies and rules are separated into different files.
> - Run `clash-config` to generate clash configuration file.

This project is under development.

## Prerequisites

- bash
- [nodejs](https://nodejs.org/)
- any clash GUI

## Install

- Clone this project to your local.
- Run `npm install` to install dependencies.
- Run `npm link` to link this project to your global env, `clash-config` command will be available.

## Add Proxy Configurations

- Create a yaml file for each proxy provider in `~/.config/clash/proxies`.
- [Official examples for clash configuration](https://github.com/Dreamacro/clash/wiki/configuration).

Here's a short example.

```yaml
name: "ss"
type: ss
server: server
port: 443
cipher: chacha20-ietf-poly1305
password: "password"
# plugin: v2ray-plugin
# plugin-opts:
  # mode: websocket # no QUIC now
  # tls: true # wss
  # skip-cert-verify: true
  # host: bing.com
  # path: "/"
  # mux: true
  # headers:
  #   custom: value
```

```yaml
name: "vmess"
type: vmess
server: server
port: 443
uuid: uuid
alterId: 32
cipher: auto
# udp: true
# tls: true
# skip-cert-verify: true
# servername: example.com # priority over wss host
# network: ws
# ws-opts:
#   path: /path
#   headers:
#     Host: v2ray.com
#   max-early-data: 2048
#   early-data-header-name: Sec-WebSocket-Protocol
```

## Generate Config File

- Run `clash-config` to generate config files.
- Config files will be generated in `~/.config/clash/configs/config-generated.yaml`.
- You can edit the `config-name` field in `~/.config/clash/configs/base.yaml` to change the name of the generated config file.

## Manage Rules

- Create a yaml file for each rule group in `~/.config/clash/rules`.
- Default rules will be copy to your clash config directory if `~/.config/clash/rules` not exists.
- Please see an example on how to config rules in [`~/.config/clash/rules/`](/rules).

## Config Directory Explanation

After this program is used, here what's in your clash config directory.

```text
├── base.yaml               # base config
├── config-generated.yaml   # generated config
├── proxies                 # proxy config directory
│   ├── proxy.yaml          # proxy config
└── rules                   # rule groups directory
    ├── DIRECT.yaml
    ├── adblock.yaml
    ├── apple.yaml
    ├── blizzard.yaml
    ├── chat.yaml
    ├── china.yaml
    ├── gaming.yaml
    ├── global-medias.yaml
    ├── global-sites.yaml
    ├── google.yaml
    ├── hk-tw.yaml
    ├── jp-kr.yaml
    ├── microsoft.yaml
    ├── netflix.yaml
    ├── pikpak.yaml
    ├── purge.yaml
    └── youtube.yaml
```
