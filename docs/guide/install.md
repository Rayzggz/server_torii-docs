# Installation

::: warning
Server Torii is currently actively adding new features and improving some existing features. 
It's ready to be used to protect your site, but during version updates, there may be some breaking changes. 
Therefore, Make sure to read the Upgrade Guide when updating.
:::


The installation contain two parts: ngx_torii and server_torii.

ngx_torii is a Nginx module that serves as a connector for server_torii, forwarding requests from Nginx to server_torii.

## Install server_torii

1. Create a working directory
   You may choose any directory you prefer:
```sh
mkdir -p /www/server_torii
cd /www/server_torii
```
2.Clone the repository
```sh
git clone https://github.com/Rayzggz/server_torii.git
cd server_torii
```

3. Configuration

Edit the configuration file according to the Configuration Guide.

[Basic Quick Setup](./configuration.md#basic-quick-setup)

4. Build and install

The Makefile provides an installation target which:
- Compiles the binary in the current directory
- Places the executable in this directory
- Registers server_torii as a system service
- Starts the service immediately
- Adds it to the system startup sequence

To compile and install:
```sh
make install
```

If you prefer to run it differently, you can compile and execute it like any standard Go application.


## Compiling and Installing ngx_torii


::: tip How to get Nginx compile arguments

You need to get the compile arguments of Nginx by running `nginx -V`
Example：
```
# nginx -V

nginx version: nginx/1.21.4
built by gcc 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04) 
built with OpenSSL 1.1.1w  11 Sep 2023
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module
```
Use the `configure arguments:` part of the output, which will be referred to as `ARG` in the following sections.

:::

ngx_torii Repo URL:
`https://github.com/Rayzggz/ngx_torii`
This Module is a simple modification of the built-in Nginx module ngx_http_auth_request_module to support server_torii

Use `git clone https://github.com/Rayzggz/ngx_torii` to clone the repository.

```sh
$ cd nginx-1.x.x
$ ./configure ARG --add-module=/path/to/ngx_torii
$ make
$ make install
```


## Installing ngx_torii via the aaPanel built-in Nginx compilation feature

::: danger Warning
This method requires uninstalling the current Nginx and reinstalling it, which may affect the services that are currently running.

If you want to minimize the impact on services and the current Nginx was installed using compilation, you can use the following "Installing ngx_torii via overwriting Nginx of aaPanel" method.
:::


1. Uninstall the Nginx in App store
2. Reinstall Nginx, choose the 「Compiled」
3. Click 「Adding custom modules」
* Name： `ngx_torii`
* Description： `Server Torii Nginx Module`
* Parameter： `--add-module=/www/server/nginx/src/ngx_torii`
* Prefix script:
```sh
mkdir -p /www/server/nginx/src
cd /www/server/nginx/src
git clone https://github.com/Rayzggz/ngx_torii
```

4. Confirm and Install


## Installing ngx_torii via overwriting Nginx of aaPanel

::: warning
Using this method requires ensuring that your current Nginx is compiled and installed via the aaPanel. If there are source files in the `/www/server/nginx/src` folder, it indicates that the current Nginx is installed through compilation.
:::

::: tip How to get Nginx compile arguments

You need to get the compile arguments of Nginx by running `nginx -V`
Example：
```
# nginx -V

nginx version: nginx/1.21.4
built by gcc 13.3.0 (Ubuntu 13.3.0-6ubuntu2~24.04) 
built with OpenSSL 1.1.1w  11 Sep 2023
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/www/server/nginx --add-module=/www/server/nginx/src/ngx_devel_kit --add-module=/www/server/nginx/src/lua_nginx_module --add-module=/www/server/nginx/src/ngx_cache_purge --add-module=/www/server/nginx/src/nginx-sticky-module --with-openssl=/www/server/nginx/src/openssl --with-pcre=pcre-8.43 --with-http_v2_module --with-stream --with-stream_ssl_module --with-stream_ssl_preread_module --with-http_stub_status_module --with-http_ssl_module --with-http_image_filter_module --with-http_gzip_static_module --with-http_gunzip_module --with-ipv6 --with-http_sub_module --with-http_flv_module --with-http_addition_module --with-http_realip_module --with-http_mp4_module --with-http_auth_request_module --add-module=/www/server/nginx/src/ngx_http_substitutions_filter_module-master --with-ld-opt=-Wl,-E --with-cc-opt=-Wno-error --with-ld-opt=-ljemalloc --with-http_dav_module --add-module=/www/server/nginx/src/nginx-dav-ext-module
```
Use the `configure arguments:` part of the output, which will be referred to as `ARG` in the following sections.

:::


Please follow the steps below step-by-step.

```sh
# 1. Enter Nginx of aaPanel source directory and download ngx_torii module code.
mkdir -p /www/server/nginx/src
cd /www/server/nginx/src
git clone https://github.com/Rayzggz/ngx_torii


# 2. Some versions of Nginx provided by aaPanel require export LuaJIT environment variables.
export LUAJIT_LIB=/usr/local/lib
export LUAJIT_INC=/usr/local/include/luajit-2.1/
export LD_LIBRARY_PATH=/usr/local/lib/:$LD_LIBRARY_PATH

# 3. Configure Nginx and add ngx_torii module.
# Here ARG should be replaced with compile parameters obtained earlier.
./configure ARG --add-module=/www/server/nginx/src/ngx_torii

# 4 . Compile Nginx 
make

# 5 . Stop Nginx service 
/etc/init.d/nginx stop

# 6 . Backup current executable file of Nginx 
mv /www/server/nginx/sbin/nginx  /www/server/nginx/sbin/nginx.bak

# 7 . Overwrite the new compiled executable file of Nginx
cp /www/server/nginx/src/objs/nginx /www/server/nginx/sbin/

# 8 . Start up Nginx service
/etc/init.d/nginx start

# 9 . Verify if Nginx has correctly loaded ngx_torii module
nginx -V
The end ofthe compileparameters should include --add-module=/www/server/nginx/src/ngx_torii
 
```
