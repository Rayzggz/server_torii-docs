# 配置详情

## config/torii.yml
```yml
port: "25555"  # Server Torii 监听端口  此端口不需要公开 仅供 Nginx 访问
web_path: "/torii" # Server Torii 访问路径
error_page: "/www/server_torii/config/error_page" # 错误页面存放路径 
log_path: "/www/server_torii/log/" # 日志存放路径
node_name: "Server Torii" # 节点名称 用于在输出页面中显示 在分布式部署时可用于区分节点
connecting_host_headers: # Host 头部 通过这个头部来判断请求的域名
  - "Torii-Real-Host"
connecting_ip_headers: # IP 头部 通过这个头部来判断请求的 IP
  - "Torii-Real-IP"
connecting_uri_headers: # URI 头部 通过这个头部来判断请求的 URI
  - "Torii-Original-URI"
connecting_feature_control_headers: # 控制 头部 通过这个头部来开关功能
  - "Torii-Feature-Control"

sites:
  - host: "default_site" #这个是默认站点配置 对应没有匹配到其他站点的请求，下面的 rule_path 是规则文件路径
    rule_path: "/www/server_torii/config/rules/default"
  - host: "example.com" # 这个是 example.com 站点的配置 这样是是精确匹配  匹配的时候优先进行精确匹配 只有没有匹配到精确匹配时才会进行通配符匹配
    rule_path: "/www/server_torii/config/rules/example.com"
  - host: "*.example.com" # 这个是通配符配置 当前仅支持在开头使用一个星号 * 通配符  不支持中间或者结尾使用 例如 abc.*.com 或者 abc.com.*  这样是不支持的
    rule_path: "/www/server_torii/config/rules/example.com"
```

## Server.yml
每个 enabled 为 true 的时候，表示启用对应的功能
其他细节解释在后面的部分

```yaml
IPAllow:
  enabled: true
IPBlock:
  enabled: true
URLAllow:
  enabled: true
URLBlock:
  enabled: true
CAPTCHA:
  enabled: true
  secret_key: "0378b0f84c4310279918d71a5647ba5d"
  captcha_validate_time: 600
  captcha_challenge_session_timeout: 120
  hcaptcha_secret: ""
HTTPFlood:
  enabled: true
  HTTPFloodSpeedLimit:
    - "150/10s"
  HTTPFloodSameURILimit:
    - "50/10s"
VerifyBot:
  enabled: true
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


### CAPTCHA:
验证码质询 用于拦截恶意请求
此功能当前不支持与 ExternalMigration 同时启用

#### `secret_key`
一个密钥 用于加密和解密人机验证的 cookie，这个cookie会在用户进行和通过人机验证后设置到浏览器中，主要用于判断用户是否通过了人机验证。
如果在分布式部署中，只要所有节点的密钥都是一样的，不同节点都可以验证 cookie 的有效性
#### `captcha_validate_time`
人机验证的有效时间，单位是秒，即验证通过后，间隔多久后需要重新验证
#### `captcha_challenge_session_timeout`
人机验证的会话超时时间，单位是秒，即用户在打开人机验证页面后，要在多长时间内完成验证
#### `hcaptcha_secret`
hcaptcha 的 secret key 用于验证用户的 hcaptcha 验证码


### HTTPFlood:
速率限制 用于CC 防御
#### `HTTPFloodSpeedLimit`
`  - "150/10s"`

一个速率限制器，表示每个IP在 10 秒内允许 150 次请求，超过这个限制会返回 429 错误
#### `HTTPFloodSameURILimit`
`  - "50/10s"`

一个速率限制器，表示每个IP在 10 秒内允许 50 次相同的 URI ，超过这个限制会返回 429 错误
这个配置可以很好地缓解对于同一个 URI 的攻击

### VerifyBot:
通过 UA 和 反向DNS 来验证是否是真实的搜索引擎爬虫
只有 UA 声明是以下搜索引擎爬虫的请求才会进行验证，正常的用户请求不会进行验证
对于验证成功的爬虫请求，将会直接放行，不会进行其他如 CAPTCHA、HTTPFlood 的检查，以保证爬虫的抓取效率
对于验证失败的爬虫请求，将会直接返回 403 禁止访问

verify_google_bot 验证谷歌爬虫

verify_bing_bot 验证必应爬虫

verify_baidu_bot 验证百度爬虫

verify_yandex_bot 验证Yandex爬虫

verify_sogou_bot 验证搜狗爬虫

verify_apple_bot 验证苹果爬虫

### ExternalMigration:
如果流量过大，服务器无法承载，可以使用这个配置将请求重定向到外部缓解设施
例如 Cloudflare 或者等候室（Waiting Room）等
通过外部服务验证/等候后再返回到 Server Torii 进行访问
此功能当前不支持与 CAPTCHA 同时启用

#### `redirect_url`
重定向的 URL 地址，如果用户没有合法的 cookie，则会重定向到这个地址

#### `secret_key`
一个密钥 用于加密和解密重定向的 cookie，这个cookie会在用户进行和通过验证后设置到浏览器中，主要用于判断用户是否通过了验证。 如果在分布式部署中，只要所有节点的密钥都是一样的，不同节点都可以验证 cookie 的有效性

#### `session_timeout`
在外部缓解设施验证通过后 发放的 cookie 的有效时间，单位是秒，即验证通过后，间隔多久后需要重新验证

外部缓解服务配置流程请参考 [External Migration](../advanced/external_migration.md)

---

### IP_AllowList.conf
IP 允许列表
命中允许列表的 IP 将会被直接放行 不进行其他检查

一行一个IP 支持 CIDR 格式

---
### IP_BlockList.conf
IP 禁止列表
命中禁止列表的 IP 将会被直接阻断 返回 403 禁止访问

一行一个IP 支持 CIDR 格式

---
### URL_AllowList.conf
URL 允许列表
命中允许列表的 URL 将会被直接放行 不进行其他检查

一行一个URL 支持正则表达式

---

### URL_BlockList.conf
URL 禁止列表
命中禁止列表的 URL 将会被直接阻断 返回 403 禁止访问

一行一个URL 支持正则表达式

---

## Nginx 模块 ngx_torii配置

工作方式可以参考 `https://nginx.org/en/docs/http/ngx_http_auth_request_module.html`

```nginx
Syntax:    torii_auth_request uri | off;
Default:   torii_auth_request off;
Context:   http, server, location
```


```nginx
Syntax:    torii_auth_request_set $variable value;
Default:   —
Context:   http, server, location
```

例子：
这个是一个反向代理站点 将用户的请求发送到本地的 3001 端口 并且让这些请求通过 Server Torii 的清洗
```nginx
#这部分是正常的Nginx 反向代理配置
location / 
{
    proxy_pass http://localhost:3001/;
    proxy_set_header Host localhost;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_http_version 1.1;
    torii_auth_request /torii/checker;
    error_page 445 = @torii_page;
    torii_auth_request_set $torii_action_uri $upstream_http_torii_action; 
}

# 下面这些配置放在 server 块中 用于接收 torii_auth_request 配置的验证请求
# proxy_set_header 是与 torii.yml 中的配置项对应的 用于传递对应的信息
# 后面会介绍 Torii-Feature-Control 头部的用法 这个请求头需要放在 /torii/checker 和 /torii 两个 location 中 并且值要保持一致
# 可以把这个 proxy_set_header Torii-Feature-Control "________"; 放到一个单独的文件中，然后通过 include 引入 以保证两个 location 中的值一致
location /torii/checker {
    proxy_pass http://127.0.0.1:25555/torii/checker;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Feature-Control "________";
}

location @torii_page {
    proxy_pass http://127.0.0.1:25555/torii/checker_pages/$torii_action_uri;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_intercept_errors off;
}

location /torii {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_intercept_errors off;
    proxy_set_header Torii-Feature-Control "________";
}
```

## Torii-Feature-Control 请求头的用法
这个请求头用于控制请求的功能开关
这个请求头的值是一个字符串 由多个字符组成 每个字符代表一个功能的开关
Server Torii 在处理请求时会根据这个请求头的值来决定启用或者禁用某些功能
请确保在 `Server.yml` 配置中已对相应功能的密钥等其他配置进行了正确设置
这个开关控制只会对当前请求生效，不会影响全局配置文件中的设置

每个字符的位置和含义如下：
- 第1个字符：IPAllow 功能开关
- 第2个字符：IPBlock 功能开关
- 第3个字符：URLAllow 功能开关
- 第4个字符：URLBlock 功能开关
- 第5个字符：VerifyBot 功能开关
- 第6个字符：HTTPFlood 功能开关
- 第7个字符：CAPTCHA 功能开关
- 第8个字符：ExternalMigration 功能开关

每个字符的取值可以是：
- '1'：启用对应的功能，这个会覆盖配置文件中的设置
- '0'：禁用对应的功能，这个会覆盖配置文件中的设置
- '_'：继承默认配置文件中的设置
例如：
- "1_0___1_"：启用 IPAllow 功能，禁用 URLAllow 功能，启用 CAPTCHA 功能，其他功能继承默认配置

以 CAPTCHA 的开关为例子，也就是说，在这种情况下，你可以在配置文件中，将 CAPTCHA 功能设置为关闭，但是通过这个请求头，将 CAPTCHA 功能开启
这样在没有加上这个请求头的情况下，CAPTCHA 功能是关闭的，但是在加上这个请求头后，CAPTCHA 功能被开启，从而实现了按需开启功能的效果

你可以利用这个头部来灵活配置
例如，你可以通过 Nginx 配置的 location 来针对特定 URI 开启或者关闭某些功能
你也可以通过外部脚本，例如 Shell Lua 等等 来依据后端负载、请求数量等动态调整功能开关，以达到最佳的防护效果和性能表现。
