package com.joaorabelo.teamflow.controller;

import com.joaorabelo.teamflow.dto.request.TeamRequest;
import com.joaorabelo.teamflow.dto.response.TeamResponse;
import com.joaorabelo.teamflow.enums.TeamStatus;
import com.joaorabelo.teamflow.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@Tag(name = "Equipes", description = "Gerenciamento de equipes")
@SecurityRequirement(name = "bearerAuth")
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @Operation(summary = "Criar nova equipe")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<TeamResponse> create(@Valid @RequestBody TeamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(teamService.create(request));
    }

    @GetMapping
    @Operation(summary = "Listar equipes com paginação e filtros")
    public ResponseEntity<Page<TeamResponse>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) TeamStatus status,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(teamService.findAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar equipe por ID")
    public ResponseEntity<TeamResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar equipe")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<TeamResponse> update(@PathVariable Long id, @Valid @RequestBody TeamRequest request) {
        return ResponseEntity.ok(teamService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir equipe")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
