# NGIX

## SSL / HTTPS

We need to provide the web-app as a secure homepage to enable secure cookies for our user login system. Therefor a self assigned certificate will be generated and placed in the NGINX Docker. Use `generate-cert.sh` to generate the certificate if it is missing.

If we'd use HTTP, Cookies would not work for most browsers, what would prevent the website from working.