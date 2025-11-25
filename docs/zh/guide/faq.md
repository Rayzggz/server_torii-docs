# 常见问题

## 如何启动/重启/停止服务？

如果你使用的是 Makefile 安装的，Makefile 会将 Server Torii 注册为一个服务，你可以使用以下命令来启动、重启和停止服务：
- 启动服务：`systemctl start server_torii`
- 重启服务：`systemctl restart server_torii`
- 停止服务：`systemctl stop server_torii`
- 查看服务状态：`systemctl status server_torii`
- 设置开机自启：`systemctl enable server_torii`
- 取消开机自启：`systemctl disable server_torii`


## 如何在运行时修改配置？

当前不支持在运行时修改配置。配置仅在启动时进行加载，运行时无法修改。
修改配置后需要重启服务才能生效。

## CDN 与 Server Torii 是否兼容？

是的，Server Torii 可以与 CDN 一起使用。 只要确保使用 Nginx 模块 `ngx_http_realip_module` 来正确获取客户端的真实 IP 地址即可。
并在 Nginx 接入 Server Torii 配置中通过 `proxy_set_header Torii-Real-IP $remote_addr;` 将真实 IP 地址传递给 Server Torii。

