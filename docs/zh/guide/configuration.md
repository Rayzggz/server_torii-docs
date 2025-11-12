# 配置

## 快速开始配置

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

`error_page` 正确设置错误页面存放路径

`log_path` 正确设置日志存放路径

`sites` 站点配置文件
默认示例配置文静仅包含了 `default_site` 站点配置
和路径 config/rules/default 下的规则文件
快速配置时，需要删掉 `example.com` 和 `*.example.com` 站点配置

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

3. 修改 Nginx 配置文件

ngx_torii 的配置方式与 Nginx 的 auth_request 模块完全一致

在需要使用 Server Torii 的站点配置文件中添加以下配置

下面配置中所有的路径 `/torii` 需要与上面配置的 `web_path` 一致

```nginx
#放在你需要保护的块中 例如放在反向代理的 location 块中
torii_auth_request /torii/checker;
error_page 445 = @torii_page;
torii_auth_request_set $torii_action_uri $upstream_http_torii_action;  


# 下面这些配置放在 server 块中 用于接收 torii_auth_request 配置的验证请求
location /torii/checker {
    proxy_pass http://127.0.0.1:25555/torii/checker;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
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
}
```

4. 重载 Nginx 使配置生效






