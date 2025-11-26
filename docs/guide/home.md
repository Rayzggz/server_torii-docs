# Introduction

A high-performance, distributed, lightweight DDoS mitigation and scrubbing program.

## ⛩️?

⛩️（鳥居（とりい））is a structure built at the entrance of Japanese shrines, symbolizing a sacred boundary that blocks the intrusion of evil.

Server Torii is like a Torii gate for the digital world, quietly standing guard in front of your server. 🛡️⛩️


## ⭐ Features
- Easy to integrate with existing Nginx or OpenResty
- Distribute Compatible
- HTTP FLOOD Mitigation
- CAPTCHA Challenge
- Crawlers Verification
- Custom Error Page
- External Mitigation (using services such as Cloudflare for mitigation)
- IP Address Block List
- IP Address Allow List
- URL Block List
- URL Allow List


## Environment Requirements

Server Torii was developed based on the following environment:
- Ubuntu 24.04 LTS
- Nginx 1.28.0
- Go 1.24.0

Technically, Server Torii is compatible with the following environments:
- Various Linux distributions
- Nginx 1.10 and above
- Go 1.21.0 and above (Generally, Go after this version will automatically install the correct version of the toolchain.)

For other operating systems (such as Windows and macOS), Server Torii is technically compatible but has not been tested, and some issues may arise.
The Nginx connector ngx_torii for Server Torii has only been tested and used on Linux; compiling the Nginx module in other environments is extremely rare and not recommended.

## How to contribute to this project?
You can submit pull requests:

Project Repository: https://github.com/Rayzggz/server_torii

Documentation: https://github.com/Rayzggz/server_torii-docs



