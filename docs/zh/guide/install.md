# 安装

安装分为两部分 ngx_torii  和 server_torii

ngx_torii 是一个 Nginx 模块，是 server_torii 的连接器，用于将 Nginx 收到的请求发送给 server_torii 检查

## ngx_torii

### 编译安装


::: warning 如何获取编译参数

编译安装需要知道当前的 nginx 的编译参数，通过运行 `nginx -V` 获取
例如：
```
# nginx -V

nginx version: nginx/1.21.4
built by gcc 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04) 
built with OpenSSL 1.1.1w  11 Sep 2023
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module```

请使用 `configure arguments:` 后面的内容，下文中将使用 `ARG` 来代替这块内容。

:::

ngx_torii 代码仓库：
`https://github.com/Rayzggz/ngx_torii`

此项目基于Nginx内置模块 ngx_http_auth_request_module 进行了简单修改以支持 server_torii

使用 `git clone https://github.com/Rayzggz/ngx_torii` 获取代码

```sh
$ cd nginx-1.x.x
$ ./configure ARG --add-module=/path/to/ngx_torii
$ make && make install
```


### 宝塔面板安装



