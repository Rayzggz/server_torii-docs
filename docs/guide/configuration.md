# Configuration

## Basic Quick Setup

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

```yml
    port: "25555"  # Server Torii listening port; not exposed publicly, only Nginx needs access
    web_path: "/torii" # Base URL path for Server Torii
    rule_path: "/www/server_torii/config/rules" # Directory for rule files (this example assumes /www/server_torii as the install dir)
    error_page: "/www/server_torii/config/error_page" # Directory for custom error pages
    log_path: "/www/server_torii/log/" # Directory for storing logs
```

3. Update your Nginx configuration

The ngx_torii module uses the similar directives as Nginx’s auth_request module.

In the server block or location where you want to protection, add:
```nginx
torii_auth_request /torii/checker;  #Send auth check to Server Torii

# Receive auth checks from torii_auth_request
location /torii/checker {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Captcha-Status off;
}

# Handle all other Server Torii endpoints (captcha pages, health checks, etc.)
location /torii {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
}
```

4. Reload Nginx


## More Configuration

### config/torii.yml
```yml
port: "25555"  # Server Torii listening port; not exposed publicly, only Nginx needs access
web_path: "/torii" # Base URL path for Server Torii
rule_path: "/www/server_torii/config/rules" # Directory for rule files (this example assumes /www/server_torii as the install dir)
error_page: "/www/server_torii/config/error_page" # Directory for custom error pages
log_path: "/www/server_torii/log/" # Directory for storing logs
node_name: "Server Torii" # Node name used for display on the output page, can be used to distinguish nodes in a distributed deployment.
connecting_host_headers: # Host header, used to determine the domain name of the request.
  - "Torii-Real-Host"
connecting_ip_headers: # IP header, used to determine the User IP of the request.
  - "Torii-Real-IP"
connecting_uri_headers: # URI header, used to determine the URI of the request.
  - "Torii-Original-URI"
connecting_captcha_status_headers: # Turn on or Turn off the CAPTCHA
  - "Torii-Captcha-Status"
```
---

### Server.yml
```yaml
CAPTCHA:
  secret_key: "0378b0f84c4310279918d71a5647ba5d"
  captcha_validate_time: 600
  captcha_challenge_session_timeout: 120
  hcaptcha_secret: ""
HTTPFlood:
  HTTPFloodSpeedLimit:
    - "150/10s"
  HTTPFloodSameURILimit:
    - "50/10s"
VerifyBot:
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

#### CAPTCHA：
CAPTCHA settings, used to challenge users
#### `secret_key`
A shared key for encrypting/decrypting the clearance cookie. In clustered setups, all nodes must use the same key to validate cookies.
#### `captcha_validate_time`
Time (in seconds) for which a passed captcha remains valid before re‑challenge.
#### `captcha_challenge_session_timeout`
Time (in seconds) allowed to complete the captcha after the challenge page loads.
#### `hcaptcha_secret`
Your hCaptcha secret key for server‑side verification.

#### HTTPFlood：
Speed limit settings for HTTP flood protection.
This feature cannot be disabled in current version. To turn it off with minimize the influence, set extremely high limits and very short intervals. (like 1000000/1s )
#### `HTTPFloodSpeedLimit`
`  - "150/10s"`
Allows up to 150 requests per IP every 10 seconds (429 on excess).

#### `HTTPFloodSameURILimit`
`  - "50/10s"`

Allows up to 50 requests per IP to the same URI every 10 seconds (429 on excess). Helps mitigate URI‑focused floods.

#### VerifyBot:
Use User‑Agent and reverse‑DNS to verify legitimate crawlers:

verify_google_bot # Googlebot

verify_bing_bot # Bingbot

verify_baidu_bot # Baidu spider

verify_yandex_bot # Yandex crawler

verify_sogou_bot # Sogou spider

verify_apple_bot # Applebot

#### ExternalMigration:
If the traffic is too high and the server cannot handle it, this configuration can be used to redirect requests to external mitigation facilities such as Cloudflare or a waiting room.
After verification/waiting through an external service, requests will return to Server Torii for access.

#### `enabled`
Enable if set to `true`.

#### `redirect_url`
The URL address for redirection.
if the user does not have a valid cookie, they will be redirected to this address.

#### `secret_key`
A key used for encrypting and decrypting the redirect cookie.
This cookie will be set in the browser after the user has been verified and is mainly used to determine whether the user has passed verification.
In distributed deployments, as long as all nodes share the same key, different nodes can validate the cookies.

#### `session_timeout`
The validity period of the cookie issued after successful verification at external mitigation facilities, measured in seconds.

For details on configuring external mitigation services, please refer to [External Migration](../advanced/external_migration.md).

---

### IP_AllowList.conf
One IP (or CIDR) per line
Allowlisted addresses bypass all checks.

---

### IP_BlockList.conf
One IP (or CIDR) per line
Blocklisted addresses are immediately blocked.

---

### URL_AllowList.conf
One URL pattern (regex) per line
Allowlisted URIs are immediately blocked.

---

### URL_BlockList.conf
One URL pattern (regex) per line
Blocklisted URIs are immediately blocked.

---

###  ngx_torii Module Configuration
The ngx_torii module uses the similar directives as Nginx’s auth_request module.

You can reference the document of ngx_http_auth_request_module `https://nginx.org/en/docs/http/ngx_http_auth_request_module.html`

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

Example Reverse‑Proxy with Server Torii:
```nginx
#Reverse‑proxy your upstream service
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
    torii_auth_request /torii/checker;   #Route through Server Torii
}

# Receive the auth check
location /torii/checker {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Captcha-Status on; #set to off to disable captcha
}

# Handle Torii’s own endpoints (captcha, health, etc.)
location /torii {
    proxy_pass http://127.0.0.1:25555;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
}
```





