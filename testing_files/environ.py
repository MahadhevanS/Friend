# import os
# import certifi

# # Set SSL_CERT_FILE to use the certifi certificate file
# os.environ["SSL_CERT_FILE"] = certifi.where()

import httpx

# Test SSL certificate configuration
response = httpx.get('https://www.google.com')  # Should work without SSL errors
print(response.status_code)
