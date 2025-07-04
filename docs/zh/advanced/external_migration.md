# 外部缓解服务配置

本文档详细说明了如何配置和集成外部缓解服务。

## 1\. 配置参数

以下是在 Server.yml 启用和配置此功能所需的参数。

| 参数                | 类型  | 描述                                      |
|:------------------|:----|:----------------------------------------|
| `enabled`         | 布尔值 | `true` 或 `false`，用于开启或关闭此功能。            |
| `redirect_url`    | 字符串 | 指定要重定向到的外部验证服务的 URL。                    |
| `secret_key`      | 字符串 | 用于生成和验证 HMAC 签名的密钥。请确保其足够复杂和安全。         |
| `session_timeout` | 整数  | 指定会话超时时间（以秒为单位）。用户在此时间后需要跳转到外部验证服务重新验证。 |

## 2\. 重定向到外部服务

当 Server Torii 将用户重定向到外部服务时，URL 会包含以下查询参数。您需要保存这些参数，以便在外部服务验证用户后能够正确地将其重定向回来。

### 查询参数

| 参数             | 描述                     |
|:---------------|:-----------------------|
| `domain`       | 原始请求的域名。               |
| `session_id`   | Server Torii 生成的会话 ID。 |
| `original_uri` | 用户最初尝试访问的 URI。         |
| `hmac`         | 用于验证请求合法性的 HMAC 签名。    |

### 重定向 URL 示例

```
https://example.com/your-verification-page?domain=your-website.com&session_id=somesessionid&original_uri=%2Fprotected%2Fresource&hmac=abc123xyz456
```

### HMAC 签名计算

HMAC 签名用于确保请求的完整性和安全性，必须在外部验证服务端进行严格验证，以防止任意重定向等安全问题。

**计算方法：**
使用 `secret_key` 创建一个 HMAC（基于 SHA512 算法）对象，然后将 `domain`、`timestampStr` 和 `original_uri` 以冒号（`:`）拼接后写入 HMAC，用于生成签名。

**示例：**

```
hmac = HMAC-SHA512(secretKey, domain + ":" + timestampStr + ":" + originalUri)
```

## 3\. 将用户回调到 Server Torii

在您的外部服务完成用户验证后，必须将用户重定向回 Server Torii 的固定回调端点：`/torii/external_migration`。

### 回调参数

在回调时，您需要在 URL 查询中提供以下参数：

| 参数             | 描述                  |
|:---------------|:--------------------|
| `original_uri` | 用户最初请求的原始 URI。      |
| `timestamp`    | 当前的时间戳。             |
| `hmac`         | 根据回调参数新生成的 HMAC 签名。 |

### HMAC 签名计算 (回调)

**计算方法：**
使用 `secret_key` 创建一个 HMAC（基于 SHA512 算法）对象，然后将 `sessionID`、`timestamp` 和 `original_uri` 直接拼接后写入 HMAC，用于生成签名。

**示例：**

```
hmac = HMAC-SHA512(secretKey, sessionID + timestamp + original_uri)
```

::: warning 警告
为确保安全性和正确性，您必须在计算完 HMAC 后立即将用户重定向回 Server Torii 的回调端点。
:::
