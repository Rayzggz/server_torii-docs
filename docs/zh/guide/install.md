# 安装

::: warning 警告
Server Torii 目前仍在积极的添加新的功能，并且完善部分现有功能的配置。你已经可以用它来保护你的站点，但是在版本更新的时候，有可能会发生一些破坏性更新。因此，在更新的时候，请注意参考更新指南。
:::

::: tip
安装前，请确保你的服务器已经安装了适当的环境，详情请参照[环境准备](./prerequisites.md)
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

[快速开始配置](./configuration.md)

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
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module
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


## 宝塔面板 自动安装 ngx_torii

::: danger 警告
这个方法需要卸载当前的 Nginx 并重新安装，可能会对正在运行的服务造成影响

如希望尽量减少对服务的影响，并且当前 Nginx 在安装时选择的是编译安装，可以使用下面的“宝塔面板 替换安装 ngx_torii”指南
:::


1. 在软件商店卸载Nginx
2. 在软件商店安装Nginx 选择「编译安装」选项
3. 「添加自定义模块」中添加 `ngx_torii` 模块
* 名称： `ngx_torii`
* 描述： `Server Torii Nginx Module`
* 参数： `--add-module=/www/server/nginx/src/ngx_torii`
* 前置脚本：
::: danger 警告

如果您的服务器位于中华人民共和国境内

您的服务器可能无法从 GitHub 上下载代码 从而导致安装失败

您可以将下面前置脚本的 `git clone https://github.com/Rayzggz/ngx_torii` 替换为GitHub镜像站点的地址
:::

```sh
mkdir -p /www/server/nginx/src
cd /www/server/nginx/src
git clone https://github.com/Rayzggz/ngx_torii
```

4. 按照宝塔的提示完成安装

## 宝塔面板 替换安装 ngx_torii

::: warning 警告
使用这个方法需要保证您当前的 Nginx 是通过宝塔面板编译安装的
如果 `/www/server/nginx/src` 文件夹内存在源码文件，则说明当前 Nginx 是通过编译安装的
:::

::: tip 如何获取编译参数

编译安装需要知道当前的 Nginx 的编译参数，通过运行 `nginx -V` 获取
例如：
```
# nginx -V

nginx version: nginx/1.21.4
built by gcc 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04) 
built with OpenSSL 1.1.1w  11 Sep 2023
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module
```

请使用 `configure arguments:` 后面的内容，下文中将使用 `ARG` 来代替这块内容。

:::

请逐步按照下面的指南操作

```sh
# 1. 进入宝塔 Nginx 源码目录，下载 ngx_torii 模块代码
#    如果您的服务器位于中华人民共和国境内
#    您的服务器可能无法从 GitHub 上下载代码 从而导致安装失败
#    您可以将下面的 git clone 地址替换为GitHub镜像站点的地址
mkdir -p /www/server/nginx/src
cd /www/server/nginx/src
git clone https://github.com/Rayzggz/ngx_torii


# 2. 宝塔提供的部分 Nginx 版本需要引入 LuaJIT 环境变量
export LUAJIT_LIB=/usr/local/lib
export LUAJIT_INC=/usr/local/include/luajit-2.1/
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH

# 3. 配置 Nginx，添加 ngx_torii 模块
# 这里的 ARG 请替换为上文获取到的编译参数
./configure ARG --add-module=/www/server/nginx/src/ngx_torii

# 4. 编译 Nginx
make

# 5. 停止 Nginx 服务
/etc/init.d/nginx stop

# 6. 备份当前 Nginx 可执行文件
mv /www/server/nginx/sbin/nginx  /www/server/nginx/sbin/nginx.bak

# 7. 安装新编译的 Nginx 可执行文件
cp /www/server/nginx/src/objs/nginx /www/server/nginx/sbin/

# 8. 启动 Nginx 服务
/etc/init.d/nginx start

# 9. 验证 Nginx 是否正确加载 ngx_torii 模块
nginx -V
编译参数的末尾应该包含 --add-module=/www/server/nginx/src/ngx_torii

```
