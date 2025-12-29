# Configuration Advanced

## config/torii.yml
```yml
port: "25555"  # Server Torii listening port; not exposed publicly, only Nginx needs access
web_path: "/torii" # Base URL path for Server Torii
error_page: "/www/server_torii/config/error_page" # Directory for custom error pages
log_path: "/www/server_torii/log/" # Directory for storing logs
node_name: "Server Torii" # Node name used for display on the output page, can be used to distinguish nodes in a distributed deployment.
connecting_host_headers: # Host header, used to determine the domain name of the request.
  - "Torii-Real-Host"
connecting_ip_headers: # IP header, used to determine the User IP of the request.
  - "Torii-Real-IP"
connecting_uri_headers: # URI header, used to determine the URI of the request.
  - "Torii-Original-URI"
connecting_feature_control_headers: # Feature control header, used to toggle features.
  - "Torii-Feature-Control"

sites:
  - host: "default_site" # This is the default site configuration, corresponding to requests that do not match any other sites. The rule_path below is the path to the rules file.
    rule_path: "/www/server_torii/config/rules/default"
  - host: "example.com" # This is the configuration for the example.com site. This is an exact match; when matching, priority is given to exact matches, and wildcard matching will only occur if no exact match is found.
    rule_path: "/www/server_torii/config/rules/example.com"
  - host: "*.example.com" # This is a wildcard configuration. Currently, it only supports using one * wildcard at the beginning. It does not support usage in the middle or at the end. For example, abc.*.com or abc.com.* are not supported.
    rule_path: "/www/server_torii/config/rules/example.com"
```
---

## Server.yml
Each enabled set to true indicates that the corresponding feature is activated.
Other details are explained in the following sections.

```yaml
IPAllow:
  enabled: true
IPBlock:
  enabled: true
URLAllow:
  enabled: true
URLBlock:
  enabled: true
CAPTCHA:
  enabled: true
  secret_key: "0378b0f84c4310279918d71a5647ba5d"
  captcha_validate_time: 600
  captcha_challenge_session_timeout: 120
  hcaptcha_secret: ""
  CaptchaFailureLimit:
    - "300/300s"
  failure_block_duration: 1200
HTTPFlood:
  enabled: true
  HTTPFloodSpeedLimit:
    - "150/10s"
  HTTPFloodSameURILimit:
    - "50/10s"
  HTTPFloodFailureLimit:
    - "300/300s"
  failure_block_duration: 1200
VerifyBot:
  enabled: true
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

### CAPTCHA：
CAPTCHA settings, used to challenge users
This feature currently does not support being enabled simultaneously with ExternalMigration.

#### `secret_key`
A shared key for encrypting/decrypting the clearance cookie. In clustered setups, all nodes must use the same key to validate cookies.
#### `captcha_validate_time`
Time (in seconds) for which a passed captcha remains valid before re‑challenge.
#### `captcha_challenge_session_timeout`
Time (in seconds) allowed to complete the captcha after the challenge page loads.
#### `hcaptcha_secret`
Your hCaptcha secret key for server‑side verification.
#### `CaptchaFailureLimit`
Rate limit settings for failed attempts.

If you set a: `  - "300/300s"`, then:
Allows up to 300 failed attempts per IP every 300 seconds. A 403 response is returned on excess. And blocks the IP for the duration specified in `failure_block_duration`.

Note: Any failed attempt counts towards this limit, including request page, submitting incorrect CAPTCHA.
If a user get a normal HTML page for upstream service in some case, then request JS/CSS/Images from that page, each of these static resource requests will also count as a failed attempt if the user has not yet passed the CAPTCHA challenge.
In such cases, user may not get the CAPTCHA challenge page since they can access the normal HTML page. User can try to refresh the page to get the challenge again.
It is recommended to set a reasonable limit to avoid excessive blocking of legitimate users.

#### `failure_block_duration`
Duration (in seconds) to block IPs exceeding the failure limit.

When Any IP exceeds the defined `CaptchaFailureLimit`, it will be blocked for the duration specified here, receiving a 403 Forbidden response.
All failed attempts in `CaptchaFailureLimit` Counter will be cleared, which means the user can try again after the block duration.


Additionally, you need to integrate the hcaptcha verification widget on the HTML page. Please modify the `config/error_page/CAPTCHA.html` file and add your hcaptcha site key.
For more details, refer to [hCaptcha Official Documentation](https://docs.hcaptcha.com/#add-the-hcaptcha-widget-to-your-webpage).


### HTTPFlood：
Speed limit settings for HTTP flood protection.
#### `HTTPFloodSpeedLimit`
`  - "150/10s"`
Allows up to 150 requests per IP every 10 seconds (429 on excess).

#### `HTTPFloodSameURILimit`
`  - "50/10s"`
Allows up to 50 requests per IP to the same URI every 10 seconds (429 on excess). Helps mitigate URI‑focused floods.

#### `HTTPFloodFailureLimit`
Rate limit settings for above 429 attempts.
This means if an IP violates the above HTTPFlood limits too many times, it will be blocked.


If you set a: `  - "300/300s"`, then:
Allows up to 300 failed attempts per IP every 300 seconds. A 403 response is returned on excess. And blocks the IP for the duration specified in `failure_block_duration`.

Note: If a user get a normal HTML page for upstream service in some case, then request JS/CSS/Images from that page, each of these static resource requests will also count as a failed attempt.
In such cases, User may not get the 429 page since they can access the normal HTML page. User can try to refresh the page to get the 429 page.
It is recommended to set a reasonable limit to avoid excessive blocking of legitimate users.

#### `failure_block_duration`
Duration (in seconds) to block IPs exceeding the failure limit.

When Any IP exceeds the defined `HTTPFloodFailureLimit`, it will be blocked for the duration specified here, receiving a 403 Forbidden response.
All failed attempts in `HTTPFloodFailureLimit` Counter will be cleared, which means the user can try again after the block duration.


### VerifyBot:
Use User‑Agent and reverse‑DNS to verify legitimate crawlers
Only requests from the following search engine crawlers with a UA declaration will be validated, normal user requests will not undergo validation.
For successfully validated crawler requests, they will be allowed through directly without any additional checks such as CAPTCHA or HTTPFlood, to ensure the efficiency of crawling.
For failed validation of crawler requests, a 403 Forbidden access response will be returned directly.

verify_google_bot # Googlebot

verify_bing_bot # Bingbot

verify_baidu_bot # Baidu spider

verify_yandex_bot # Yandex crawler

verify_sogou_bot # Sogou spider

verify_apple_bot # Applebot

### ExternalMigration:
If the traffic is too high and the server cannot handle it, this configuration can be used to redirect requests to external mitigation facilities such as Cloudflare or waiting room.
After verification/waiting through an external service, requests will return to Server Torii for access.
This feature currently does not support being enabled simultaneously with CAPTCHA.

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
Blocklisted addresses are immediately blocked and return 403 Forbidden.

---

### URL_AllowList.conf
One URL pattern (regex) per line
Allowlisted URIs bypass all checks.

---

### URL_BlockList.conf
One URL pattern (regex) per line
Blocklisted URIs are immediately blocked and return 403 Forbidden.

---

##  ngx_torii Module Configuration
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
    torii_auth_request /torii/checker;
    error_page 445 = @torii_page;
    torii_auth_request_set $torii_action_uri $upstream_http_torii_action; 
}


# The following configurations are placed in the server block to receive auth requests for the torii_auth_request configuration.
# proxy_set_header corresponds to the configuration items in torii.yml and is used to pass relevant information.
# The usage of the Torii-Feature-Control header will be introduced later. This request header needs to be placed in both /torii/checker and /torii locations, and the values must remain consistent.
# You can place this proxy_set_header Torii-Feature-Control "________"; in a separate file and then include it to ensure that the values are consistent across both locations.
location /torii/checker {
    proxy_pass http://127.0.0.1:25555/torii/checker;
    proxy_set_header Torii-Real-IP $remote_addr;
    proxy_pass_request_body off;
    proxy_set_header Content-Length "";
    proxy_set_header Torii-Original-URI $request_uri;
    proxy_set_header Torii-Real-Host $host;
    proxy_set_header Torii-Feature-Control "________";
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
    proxy_set_header Torii-Feature-Control "________";
}
```

## Usage of Torii-Feature-Control Header
This header is used to control the feature switches of Server Torii for the current request.
The value of this header is a string composed of multiple characters, each representing a feature switch.
When processing requests, the Server Torii will decide whether to enable or disable certain features based on the value of this header.
Please ensure that the other configurations for the corresponding features are correctly set in the `Server.yml` configuration.
This switch control only takes effect for the current request and does not affect settings in the global configuration file.

The position and meaning of each character are as follows:
- 1st character: IPAllow feature
- 2nd character: IPBlock feature
- 3rd character: URLAllow feature
- 4th character: URLBlock feature
- 5th character: VerifyBot feature
- 6th character: HTTPFlood feature
- 7th character: CAPTCHA feature
- 8th character: ExternalMigration feature

Each character can take the following values:
- '1': Enable the corresponding function, which will override settings in the configuration file.
- '0': Disable the corresponding function, which will override settings in the configuration file.
- '_': Inherit settings from the default configuration file.
For example:
- "1_0___1_": Enable IPAllow feature, disable URLAllow feature, enable CAPTCHA feature, other features inherit default configuration.

Taking the switch for CAPTCHA as an example, in this case, you can set the CAPTCHA feature to be off in the configuration file, but by using this request header, you can turn on the CAPTCHA feature.
Thus, without adding this request header, the CAPTCHA feature is off. However, after adding this request header, the CAPTCHA feature is turned on, achieving the effect of enabling functionality on demand.

You can use this header for flexible configurationYou can use this.
For example, you can enable or disable certain features for specific URIs through the location configuration in Nginx. 
You can also dynamically adjust feature based on backend load, request count, etc., using external scripts such as Shell or Lua.