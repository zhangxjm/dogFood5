FROM maven:3.8-eclipse-temurin-8 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B || true

COPY src ./src
RUN mvn package -DskipTests -B

FROM eclipse-temurin:8-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/nail-schedule-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
