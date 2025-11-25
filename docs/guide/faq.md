# Frequently Asked Questions

## How to start/restart/stop the service?
If you installed using the Makefile, the Makefile will register Server Torii as a service. You can use the following commands to start, restart, and stop the service:

- Start service: `systemctl start server_torii`
- Restart service: `systemctl restart server_torii`
- Stop service: `systemctl stop server_torii`
- Check service `status: systemctl status server_torii`
- Set to start on boot: `systemctl enable server_torii`
- Unset from starting on boot: `systemctl disable server_torii`


## How to modify the configuration at runtime?

Currently, modifying the configuration at runtime is not supported. The configuration is loaded only at startup and cannot be changed while the service is running.
After modifying the configuration, the service needs to be restarted for the changes to take effect.


## Is CDN compatible with Server Torii?

Yes, Server Torii can be used with a CDN. Just make sure to use the Nginx module `ngx_http_realip_module` to correctly obtain the client's real IP address. Additionally, in the Nginx configuration for connecting to Server Torii, pass the real IP address to Server Torii using `proxy_set_header Torii-Real-IP $remote_addr;`.