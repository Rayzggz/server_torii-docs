# Configuration

## Quick Setup

::: tip
The Basic Quick Setup focuses on the critical configuration items for running Server Torii. 
It’s intended to help you get started quickly with the default configuration.
For detailed usage, please refer to the subsequent sections.
:::

1. Copy and create the config file
```sh
   cp -r server_torii/config_example server_torii/config
 ```
2. Edit config/torii.yml

Focus on the following key settings:

`port` Ensure it is not occupied

`web_path` Ensure this path is not used by your website

`error_page` Correctly set the storage path for error pages

`log_path` Correctly set the storage path for logs

`sites` Site configuration files
The default example configuration file only contains the `default_site` site configuration and rule files under the path config/rules/default.
For Basic Quick Setup, you need to delete the `example.com` and `*.example.com` site configurations.

Assuming we install server_torii in the `/www/server_torii` directory, the content of the config/torii.yml file is as follows:

```yml
    port: "25555"  # Server Torii listening port; not exposed publicly, only Nginx needs access
    web_path: "/torii" # Base URL path for Server Torii
    error_page: "/www/server_torii/config/error_page" # Directory for custom error pages
    log_path: "/www/server_torii/log/" # Directory for storing logs
    node_name: "Server Torii"
    connecting_host_headers:
      - "Torii-Real-Host"
    connecting_ip_headers:
      - "Torii-Real-IP"
    connecting_uri_headers:
      - "Torii-Original-URI"
    connecting_feature_control_headers:
      - "Torii-Feature-Control"
      - 
    sites:
      - host: "default_site" #This is the default site configuration corresponding to requests that do not match any other sites.
        rule_path: "/www/server_torii/config/rules/default"
```

3. Update your Nginx configuration

The ngx_torii module uses the similar directives as Nginx’s auth_request module.

In the server block or location where you want to protection, add:
```nginx
#Send auth check to Server Torii
torii_auth_request /torii/checker;
error_page 445 = @torii_page;
torii_auth_request_set $torii_action_uri $upstream_http_torii_action;  

# Receive auth checks from torii_auth_request
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

4. Reload Nginx



