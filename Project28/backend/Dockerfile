FROM maven:3.8.4-openjdk-11-slim
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/stall-backend-1.0.0.jar"]
