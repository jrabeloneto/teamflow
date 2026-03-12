package com.joaorabelo.teamflow.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "TeamFlow API",
        version = "1.0.0",
        description = "API REST para gerenciamento de equipes e membros",
        contact = @Contact(
            name = "João Rabelo",
            email = "joaocunharabelo@gmail.com"
        )
    ),
    servers = {
        @Server(url = "/", description = "Servidor atual")
    }
)
@SecurityScheme(
    name = "bearerAuth",
    description = "JWT Bearer Token",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
