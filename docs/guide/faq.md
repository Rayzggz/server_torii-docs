# Frequently Asked Questions

## How to start/restart/stop the service?
If you installed using the Makefile, the Makefile will register Server Torii as a service. You can use the following commands to start, restart, and stop the service:

- Start service: `systemctl start torii`
- Restart service: `systemctl restart torii`
- Stop service: `systemctl stop torii`
- Check service `status: systemctl status torii`
- Set to start on boot: `systemctl enable torii`
- Unset from starting on boot: `systemctl disable torii`


## How to modify the configuration at runtime?

Currently, modifying the configuration at runtime is not supported. The configuration is loaded only at startup and cannot be changed while the service is running.
After modifying the configuration, the service needs to be restarted for the changes to take effect.

## How to disable a specific feature?
Currently, there is no direct option to disable features; this will be added in subsequent versions.

For CAPTCHA, it will only be enabled when the incoming request header is set to on.
For IP/URL Allowlists and Blocklists, keep the configuration file empty.
For HTTP FLOOD Attack Mitigation, as it uses a segmented circular counter, you can set a very large request limit and a very small time interval to effectively disable HTTP FLOOD mitigation. For example, 100000/1s.
For Crawlers Verification, set it to false.