# 安装

::: warning 警告
Server Torii 目前仍在积极的添加新的功能，并且完善部分现有功能的配置。你已经可以用它来保护你的站点，但是在版本更新的时候，有可能会发生一些破坏性更新。因此，在更新的时候，请注意参考更新指南。
:::

安装分为两部分 ngx_torii  和 server_torii

ngx_torii 是一个 Nginx 模块，是 server_torii 的连接器，用于将 Nginx 收到的请求发送给 server_torii 检查

## 安装 Sever_torii

1. 创建工作目录
   可改为任意其他目录
```sh
mkdir -p /www/server_torii
cd /www/server_torii
```
2. 下载 server_torii
```sh
git clone https://github.com/Rayzggz/server_torii.git
cd server_torii
```

3. 参照配置指南修改配置文件

[基础快速配置](/zh/guide/configuration.html#基础快速配置)

4. 使用Makefile编译
   install 目标会在当前工作目录进行编译 编译后的可执行程序将放置在当前目录下 并且将 server_torii 添加到系统服务中 最后会自动启动 server_torii 并将其添加到开机启动项中

如果希望以其他方式运行 可以按照标准 go 程序的方式编译和运行
```sh
make install
```




接来在 Nginx 或 OpenResty 等 Nginx 兼容的 Web 服务上安装 ngx_torii 模块 


## 编译安装 ngx_torii


::: tip 如何获取编译参数

编译安装需要知道当前的 Nginx 的编译参数，通过运行 `nginx -V` 获取
例如：
```
# nginx -V

nginx version: nginx/1.21.4
built by gcc 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04) 
built with OpenSSL 1.1.1w  11 Sep 2023
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module```
```

请使用 `configure arguments:` 后面的内容，下文中将使用 `ARG` 来代替这块内容。

:::

ngx_torii 代码仓库：
`https://github.com/Rayzggz/ngx_torii`

此项目基于Nginx内置模块 ngx_http_auth_request_module 进行了简单修改以支持 server_torii

使用 `git clone https://github.com/Rayzggz/ngx_torii` 获取代码

```sh
$ cd nginx-1.x.x
$ ./configure ARG --add-module=/path/to/ngx_torii
$ make
$ make install
```


## 宝塔面板安装 ngx_torii

::: danger 警告

使用宝塔面板软件商店安装可能会导致较长时间的服务中断

如希望尽量减少对服务的影响，并且当前 Nginx 在安装时选择的是编译安装，可以选用前述的 编译安装

宝塔面板默认 Nginx  路径 `/www/server/nginx/src/`

编译完成后使用 `/www/server/nginx/src/objs/nginx` 这个编译后的可执行文件 替换 `/www/server/nginx/sbin/` 内的宝塔Nginx文件，然后重启Nginx

:::


1. 在软件商店卸载Nginx
2. 在软件商店安装Nginx 选择「编译安装」选项
3. 「添加自定义模块」中添加 `ngx_torii` 模块
* 名称： `ngx_torii`
* 描述： `Server Torii Nginx Module`
* 参数： `--add-module=/www/server/nginx/src/ngx_torii`
* 前置脚本
```sh
mkdir -p /www/server/nginx/src
cd /www/server/nginx/src
git clone https://github.com/Rayzggz/ngx_torii
```

4. 按照宝塔的提示完成安装



