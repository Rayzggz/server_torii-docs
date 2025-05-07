# 常见问题

## 如何启动/重启/停止服务？

如果你使用的是 Makefile 安装的，Makefile 会将 Server Torii 注册为一个服务，你可以使用以下命令来启动、重启和停止服务：
- 启动服务：`systemctl start torii`
- 重启服务：`systemctl restart torii`
- 停止服务：`systemctl stop torii`
- 查看服务状态：`systemctl status torii`
- 设置开机自启：`systemctl enable torii`
- 取消开机自启：`systemctl disable torii`


## 如何在运行时修改配置？

当前不支持在运行时修改配置。配置仅在启动时进行加载，运行时无法修改。
修改配置后需要重启服务才能生效。

## 如何关闭某项功能？

当前没有提供直接的关闭功能的选项，这将会在后续版本中添加。

对于 人机验证 只有当传入请求头为 on 时才会开启人机验证。
对于 IP URL 的允许列表和阻止列表，保持配置文件为空即可。
对于 CC清洗，由于使用分段循环计算器，可以设置一个非常大的值允许请求数量和极小的时间间隔来关闭 CC 清洗。 例如 100000/1s。
对于 搜索引擎爬虫验证，设置为 false 即可。
