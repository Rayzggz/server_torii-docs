# Upgrade Guide

Server Torii is currently actively adding new features and improving some existing features. It's ready to be used to protect your site, but during version updates, there may be some breaking changes. 

Therefore, when updating, please refer to this upgrade guide. The version numbers listed below indicate releases with breaking changes.

If a version number is skipped, it means that version has no breaking changes or functional update.

If you are upgrading across multiple versions, please follow the upgrade guides for all intermediate versions sequentially.

This guide also documents the functional updates for each version to help you quickly configure new features.

## Upgrading to 1.1.0

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
Please refer to the [External Mitigation Service Configuration](/advanced/external_migration.html) for setup instructions.

#### New Error Pages

Some errors will now be output via an error page template.
You can customize the content of the error page by modifying `config/error_page/error.html`.