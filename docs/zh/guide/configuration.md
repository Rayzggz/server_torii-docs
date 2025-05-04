# 配置

## 基础快速配置

::: tip 提示
基础快速配置主要关心 Server Torii 的运行关键配置项，
主要是为了让你快速上手使用 Server Torii 并且按照默认配置运行起来。
具体使用还是需要参考后面的详细配置。
:::

1. 复制 server_torii 下的 config_example 文件夹， 重命名为 config
2. 修改 config/torii.yml 文件

我们主要需要关注以下几个配置项：

`port` 确保不会被占用

`web_path` 确保这个路径不会被你的网站使用

`rule_path` 正确设置规则文件存放路径

`error_page` 正确设置错误页面存放路径

`log_path` 正确设置日志存放路径

```yml
    port: "25555"  # Server Torii 监听端口  此端口不需要公开 仅供 Nginx 访问
    web_path: "/torii" # Server Torii 访问路径
    rule_path: "/www/server_torii/config/rules" # 规则文件存放路径 这里的相当于默认 server_torii 程序是在 /www/server_torii 目录下
    error_page: "/www/server_torii/config/error_page" # 错误页面存放路径 
    log_path: "/www/server_torii/log/" # 日志存放路径
```

3. 修改 Nginx 配置文件

ngx_torii 的配置方式与 Nginx 的 auth_request 模块完全一致

在需要使用 Server Torii 的站点配置文件中添加以下配置

下面配置中所有的路径 `/torii` 需要与上面配置的 `web_path` 一致

```nginx
torii_auth_request /torii/checker;  #这一行放在你需要保护的块中 例如放在反向代理的 location 块中

# 下面这些配置放在 server 块中 用于接收 torii_auth_request 配置的验证请求
location /torii/checker {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Captcha-Status off;
}

location /torii {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
}
```

4. 重载 Nginx 使配置生效


## 配置详情

### config/torii.yml
```yml
port: "25555"  # Server Torii 监听端口  此端口不需要公开 仅供 Nginx 访问
web_path: "/torii" # Server Torii 访问路径
rule_path: "/www/server_torii/config/rules" # 规则文件存放路径 这里的相当于默认 server_torii 程序是在 /www/server_torii 目录下
error_page: "/www/server_torii/config/error_page" # 错误页面存放路径 
log_path: "/www/server_torii/log/" # 日志存放路径
node_name: "Server Torii" # 节点名称 用于在输出页面中显示 在分布式部署时可用于区分节点
connecting_host_headers: # Host 头部 通过这个头部来判断请求的域名
  - "Torii-Real-Host"
connecting_ip_headers: # IP 头部 通过这个头部来判断请求的 IP
  - "Torii-Real-IP"
connecting_uri_headers: # URI 头部 通过这个头部来判断请求的 URI
  - "Torii-Original-URI"
connecting_captcha_status_headers: # 验证码状态头部 通过这个头部来判断请求的开关
  - "Torii-Captcha-Status"
```

### CAPTCHA.yml 
#### `secret_key`
一个密钥 用于加密和解密人机验证的 cookie，这个cookie会在用户进行和通过人机验证后设置到浏览器中，主要用于判断用户是否通过了人机验证。
如果在分布式部署中，只要所有节点的密钥都是一样的，不同节点都可以验证 cookie 的有效性
#### `captcha_validate_time`
人机验证的有效时间，单位是秒，即验证通过后，间隔多久后需要重新验证
#### `captcha_challenge_session_timeout`
人机验证的会话超时时间，单位是秒，即用户在打开人机验证页面后，要在多长时间内完成验证
#### `hcaptcha_secret`
hcaptcha 的 secret key 用于验证用户的 hcaptcha 验证码

### HTTPFlood.yml
当前此功能无法关闭 可以设置为 一个很大的值来关闭， 使用 1s 来减少性能损耗
#### `HTTPFloodSpeedLimit`
`  - "150/10s"`

一个速率限制器，表示每个IP在 10 秒内允许 150 次请求，超过这个限制会返回 429 错误
#### `HTTPFloodSameURILimit`
`  - "50/10s"`

一个速率限制器，表示每个IP在 10 秒内允许 50 次相同的 URI ，超过这个限制会返回 429 错误
这个配置可以很好的缓解对于同一个 URI 的攻击

### IP_AllowList.conf
IP 允许列表 

一行一个IP 支持 CIDR 格式

### IP_BlockList.conf
IP 禁止列表

一行一个IP 支持 CIDR 格式

### URL_AllowList.conf
URL 允许列表

一行一个URL 支持正则表达式

### URL_BlockList.conf
URL 禁止列表

一行一个URL 支持正则表达式

### VerifyBot.yml
通过 UA 和 反向DNS 来验证是否是真实的搜索引擎爬虫

verify_google_bot 验证谷歌爬虫

verify_bing_bot 验证必应爬虫

verify_baidu_bot 验证百度爬虫

verify_yandex_bot 验证Yandex爬虫

verify_sogou_bot 验证搜狗爬虫

verify_apple_bot 验证苹果爬虫

### Nginx 模块 ngx_torii配置

工作方式可以参照 `https://nginx.org/en/docs/http/ngx_http_auth_request_module.html`

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
    torii_auth_request /torii/checker;   #这一行将所有通过的请求都发送到 /torii/checker 这个地址
}

# 下面这些配置放在 server 块中 用于接收 torii_auth_request 配置的验证请求
# proxy_set_header 是与 torii.yml 中的配置项对应的 用于传递对应的信息
location /torii/checker {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Captcha-Status on; # 这个配置是用于开启人机验证的 关则设置为 off
}

# 下面这个配置是用于处理其他 Server Torii 的请求 例如人机验证 健康检查等
location /torii {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
}
```





