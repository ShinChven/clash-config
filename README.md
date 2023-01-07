# Clash Config

> - Clash config generator.
> - Proxies and rules are separated into different files, this generator will merge them and generate rule groups.
> - Editing clash config now is an easy thing.

```text
base.yaml             ──|
proxies/*.yaml        ──|──>    config-generated.yaml
subscriptions/*.yaml  ──|
rules/*.yaml          ──|
```

## Usage

### Generate Config File

```bash
# Generate the config file
clash-config
```

### Add A Proxy Config

```bash
# Add a proxy
clash-config add-proxy <uri> [name]
```

- uri: The proxy uri, `ss://` and `vmess://` are supported.
- name: The proxy name, if not provided, the proxy name will be generated automatically.

### Add A Subscription

```bash
# Add a subscription
clash-config subscribe <type> <url> [name]
```

- type: The subscription type, `clash` and `v2ray` are supported.
- url: The proxy subscription url.
- name: The proxy subscription name, if not provided, the proxy subscription name will be generated automatically.

### Add A Rule Config

```bash
# Add a rule to rule group, 
# GROUP_NAME is optional, if the value is empty or the group does not exist, the default group "My Rules" will be used.
# RULE_TYPE is optional, the default value is "DOMAIN-SUFFIX"
clash-config add-rule <RULE_VALUE> [GROUP_NAME] [RULE_TYPE]
clash-config add-rule google.com "My Rules" "DOMAIN-SUFFIX" 
```

After a new rule is added, you should run `clash-config` to generate or refresh the config file.

This project is under development.

### Search Rule

Search the managed rule. Those you edited manually will not be searched.

```bash
clash-config search-rule <RULE_VALUE>
```

## Prerequisites

- bash
- [nodejs](https://nodejs.org/)
- any clash GUI

## Install

- Clone this project to your local.
- Run `npm install` to install dependencies.
- Run `npm link` to link this project to your global env, `clash-config` command will be available.

## Proxy Configurations

- Create a yaml file for each proxy provider in `~/.config/clash/proxies`.
- [Official examples for clash configuration](https://github.com/Dreamacro/clash/wiki/configuration).

Here's some short examples.

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

> Preset rules in this project are collected from other projects like [ACL4SSR](https://github.com/ACL4SSR/ACL4SSR). 
> You should manage your own rules.

- Create a yaml file for each rule group in `~/.config/clash/rules`.
- Default rules will be copy to your clash config directory if `~/.config/clash/rules` not exists.
- Please see an example on how to config rules in [`~/.config/clash/rules/`](/rules).

## Rules Explained

- Main: The default rule to choose from the following modes:
  - Low latency: Choose the proxy with the lowest latency.
  - Fallback
  - Load balance
  - Manual: You can choose a proxy manually.
  - DIRECT: Direct connection.
- Rule Groups:
  - Choose from the proxy modes above or 'DIRECT' or 'REJECT'.

## Config Directory Explained

After this program is used, here what's in your clash config directory `~/.config/clash`.

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
