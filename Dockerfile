FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /workspace
COPY gradlew build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src
RUN chmod +x gradlew && ./gradlew --no-daemon clean build --max-workers=2 -Dorg.gradle.jvmargs="-Xmx384m -XX:MaxMetaspaceSize=256m"

FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /workspace/build/libs/*-SNAPSHOT.jar /app/app.jar
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh && chown -R 10001:10001 /app
USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/app/docker-entrypoint.sh"]
