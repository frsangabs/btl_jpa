# Etapa 1: Build com Maven e Java
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# Copia o pom.xml e a pasta src
COPY pom.xml .
COPY src ./src

# Build do projeto, pulando os testes
RUN mvn clean package -DskipTests

# Etapa 2: Imagem mínima só para rodar o jar
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copia o jar da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta usada pelo Render
EXPOSE 8080

# Comando para iniciar o Spring Boot
ENTRYPOINT ["java","-jar","app.jar"]
