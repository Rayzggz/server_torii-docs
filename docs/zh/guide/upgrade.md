# 升级指南

Server Torii 目前仍在积极的添加新的功能，并且完善部分现有功能的配置。你已经可以用它来保护你的站点，但是在版本更新的时候，有可能会发生一些破坏性更新。

因此，在更新的时候，请参照此升级指南 ，下列版本号均为破坏性更新版本号。

如果跳过了某个版本号，即此版本没有破坏性更新或功能更新。

如果需要跨版本更新，请逐步参照所有中间版本的升级指南。

同时此升级指南将会记录每个版本的功能性更新，帮助对新功能进行快速配置

## 升级到 1.3.0

### 破坏更新

#### 修改配置文件结构

`torii.yml` 已更新 

假设我们将 server_torii 放在 `/www/server_torii` 目录下
config/torii.yml 文件内容如下：

```yml
    port: "25555"  # Server Torii 监听端口  此端口不需要公开 仅供 Nginx 访问
    web_path: "/torii" # Server Torii 访问路径
    error_page: "/www/server_torii/config/error_page" # 错误页面存放路径 
    log_path: "/www/server_torii/log/" # 日志存放路径
    node_name: "Server Torii"
    connecting_host_headers:
      - "Torii-Real-Host"
    connecting_ip_headers:
      - "Torii-Real-IP"
    connecting_uri_headers:
      - "Torii-Original-URI"
    connecting_feature_control_headers:
      - "Torii-Feature-Control"

    sites:
      - host: "default_site" #这个是默认站点配置 对应没有匹配到其他站点的请求
        rule_path: "/www/server_torii/config/rules/default"
```

前版本的 `config/rules/` 中的其他配置文件已移动到站点规则目录下
按照匹配规则 放在 `config/rules/default/` 目录 或者 其他站点规则目录下 需要与 `torii.yml` 中的 `rule_path` 配置一致

#### 修改 Nginx 配置文件
`ngx_torii` 模块已更新 需要拉取最新仓库重新编译 Nginx

同样的，Nginx 配置文件也需要更新，请参考配置指南



## 升级到 1.2.0

此版本已撤销， 请直接升级到 1.3.0


##  升级到 1.1.0

### 破坏更新

#### 合并配置文件

前版本的 `config/rules` 路径下的YAML配置文件 `CAPTCHA.yml` 、 `HTTPFlood.yml` 和 `VerifyBot.yml` 已经合并为 `Server.yml` 中的 `CAPTCHA` 、 `HTTPFlood` 和 `VerifyBot` 部分。

你可以简单的将这三个文件的内容复制到 `Server.yml` 中相应的部分。请注意YAML的缩进格式。

新配置如下
```yaml
CAPTCHA:
  secret_key: "0378b0f84c4310279918d71a5647ba5d"
  captcha_validate_time: 600
  captcha_challenge_session_timeout: 120
  hcaptcha_secret: ""
HTTPFlood:
  HTTPFloodSpeedLimit:
    - "150/10s"
  HTTPFloodSameURILimit:
    - "50/10s"
VerifyBot:
  verify_google_bot: true
  verify_bing_bot: true
  verify_baidu_bot: true
  verify_yandex_bot: true
  verify_sogou_bot: true
  verify_apple_bot: true
ExternalMigration:
  enabled: false
  redirect_url: "https://example.com/migration"
  secret_key: "0378b0f84c4310279918d71a5647ba5d"
  session_timeout: 1800
```

### 功能更新

#### 外部缓解服务
Server Torii 现在支持外部缓解服务。你可以配置 Server Torii 将用户重定向到外部服务进行验证。
请参照 [外部缓解服务配置](../advanced/external_migration.md) 进行配置。

#### 新增错误页面
部分错误将会通过错误页面模板输出
可修改 `config/error_page/error.html` 进行自定义错误页面内容
