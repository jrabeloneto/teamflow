package com.joaorabelo.teamflow.controller;

import com.joaorabelo.teamflow.dto.request.MemberRequest;
import com.joaorabelo.teamflow.dto.response.MemberResponse;
import com.joaorabelo.teamflow.enums.MemberStatus;
import com.joaorabelo.teamflow.service.MemberService;
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

import java.util.List;

@RestController
@RequestMapping("/api/v1/members")
@RequiredArgsConstructor
@Tag(name = "Membros", description = "Gerenciamento de membros")
@SecurityRequirement(name = "bearerAuth")
public class MemberController {

    private final MemberService memberService;

    @PostMapping
    @Operation(summary = "Criar novo membro")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<MemberResponse> create(@Valid @RequestBody MemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.create(request));
    }

    @GetMapping
    @Operation(summary = "Listar membros com paginação e filtros")
    public ResponseEntity<Page<MemberResponse>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) MemberStatus status,
            @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(memberService.findAll(search, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar membro por ID")
    public ResponseEntity<MemberResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(memberService.findById(id));
    }

    @GetMapping("/team/{teamId}")
    @Operation(summary = "Listar membros de uma equipe")
    public ResponseEntity<List<MemberResponse>> findByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(memberService.findByTeam(teamId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar membro")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<MemberResponse> update(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return ResponseEntity.ok(memberService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir membro")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
