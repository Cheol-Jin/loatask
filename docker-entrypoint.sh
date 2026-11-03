#!/bin/sh
set -eu

# Render Secret File의 CA 인증서로 DB 서버의 인증서를 검증합니다.
if [ ! -f /etc/secrets/aiven-ca.pem ]; then
  echo 'Required secret file aiven-ca.pem is missing.' >&2
  exit 1
fi
TRUSTSTORE_PASSWORD="$(head -c 24 /dev/urandom | base64)"
export TRUSTSTORE_PASSWORD
keytool -importcert -noprompt -alias aiven-ca \
  -file /etc/secrets/aiven-ca.pem -keystore /tmp/aiven-truststore.p12 \
  -storetype PKCS12 -storepass:env TRUSTSTORE_PASSWORD >/dev/null 2>&1

exec java -Xms64m -Xmx256m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC \
  -Djavax.net.ssl.trustStore=/tmp/aiven-truststore.p12 \
  -Djavax.net.ssl.trustStorePassword="$TRUSTSTORE_PASSWORD" \
  -jar /app/app.jar --spring.profiles.active=prod
