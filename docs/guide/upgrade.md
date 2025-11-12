# Upgrade Guide

Server Torii is currently actively adding new features and improving some existing features. It's ready to be used to protect your site, but during version updates, there may be some breaking changes. 

Therefore, when updating, please refer to this upgrade guide. The version numbers listed below indicate releases with breaking changes.

If a version number is skipped, it means that version has no breaking changes or functional update.

If you are upgrading across multiple versions, please follow the upgrade guides for all intermediate versions sequentially.

This guide also documents the functional updates for each version to help you quickly configure new features.


### Upgrade to 1.3.0

### Breaking Changes

#### Modify Configuration File Structure

`torii.yml` has been updated.

Assuming we place `server_torii` in the `/www/server_torii` directory, the content of the `config/torii.yml` file is as follows:

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

Other configuration files from the previous version's `config/rules/` have been moved to the site rules directory.
They should be placed in either the `config/rules/default/` directory or other site rules directories, consistent with the `rule_path` configuration in `torii.yml`.

#### Modify Nginx Configuration File
The `ngx_torii` module has been updated. You need to pull the latest repository and recompile Nginx.

Similarly, the Nginx configuration file also needs to be updated. Please refer to the configuration guide.

## Upgrade to 1.2.0

This version has been withdrawn, please upgrade directly to 1.3.0.

## Upgrade to 1.1.0

### Breaking Changes

#### Configuration File

The YAML configuration files `CAPTCHA.yml`, `HTTPFlood.yml`, and `VerifyBot.yml`, previously located in the `config/rules` path, have been merged into the `CAPTCHA`, `HTTPFlood`, and `VerifyBot` sections within `Server.yml`.

You can simply copy the contents of these three files into the corresponding sections of `Server.yml`. Please be careful with the YAML indentation format.

The new configuration is as follows:

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

### Feature Updates

#### External Mitigation Service

Server Torii now supports an external mitigation service. You can configure Server Torii to redirect users to an external service for verification.
Please refer to the [External Mitigation Service Configuration](../advanced/external_migration.md) for setup instructions.

#### New Error Pages

Some errors will now be output via an error page template.
You can customize the content of the error page by modifying `config/error_page/error.html`.