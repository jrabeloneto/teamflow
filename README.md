# TeamFlow — Sistema de Gerenciamento de Equipes

Plataforma completa para gestão de equipes e membros, desenvolvida com **Java 17 + Spring Boot 3** no backend e **Angular 17** no frontend.

## Tecnologias

### Backend
- **Java 17** + **Spring Boot 3.5**
- **Spring Security** + **JWT** (autenticação stateless)
- **Spring Data JPA** + **Hibernate**
- **H2** (desenvolvimento) / **PostgreSQL** (produção)
- **SpringDoc OpenAPI** (documentação Swagger)
- **Lombok** (redução de boilerplate)

### Frontend
- **Angular 17** (Standalone Components)
- **Angular Material** (componentes UI)
- **RxJS** (programação reativa)
- **TypeScript 5**

## Funcionalidades

- Autenticação completa com JWT (login, registro)
- Dashboard com métricas em tempo real
- CRUD completo de Equipes com paginação e filtros
- CRUD completo de Membros com paginação e busca
- Controle de status (ativo, inativo, férias)
- Guards de rota e interceptors HTTP
- Dados de demonstração pré-carregados

## Executar localmente

### Backend
```bash
cd backend
mvn spring-boot:run
```
API disponível em `http://localhost:8080`
Swagger UI em `http://localhost:8080/swagger-ui.html`

### Frontend
```bash
cd frontend
npm install
ng serve
```
Aplicação disponível em `http://localhost:4200`

## Credenciais de demonstração

| Usuário | E-mail | Senha | Papel |
|---------|--------|-------|-------|
| Admin | admin@teamflow.com | admin123 | ADMIN |
| Manager | manager@teamflow.com | manager123 | MANAGER |

## Autor

**João da Cunha Rabelo Neto**
Estudante de Engenharia de Software — CEUNI-FAMETRO, 4° Período
