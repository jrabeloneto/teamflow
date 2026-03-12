package com.joaorabelo.teamflow.service;

import com.joaorabelo.teamflow.dto.request.TeamRequest;
import com.joaorabelo.teamflow.dto.response.TeamResponse;
import com.joaorabelo.teamflow.entity.Member;
import com.joaorabelo.teamflow.entity.Team;
import com.joaorabelo.teamflow.enums.TeamStatus;
import com.joaorabelo.teamflow.exception.ResourceNotFoundException;
import com.joaorabelo.teamflow.repository.MemberRepository;
import com.joaorabelo.teamflow.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;

    public TeamResponse create(TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .department(request.getDepartment())
                .status(request.getStatus() != null ? request.getStatus() : TeamStatus.ACTIVE)
                .build();

        if (request.getManagerId() != null) {
            Member manager = memberRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado: " + request.getManagerId()));
            team.setManager(manager);
        }

        return toResponse(teamRepository.save(team));
    }

    @Transactional(readOnly = true)
    public Page<TeamResponse> findAll(String search, TeamStatus status, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return teamRepository.findBySearchTerm(search, pageable).map(this::toResponse);
        }
        if (status != null) {
            return teamRepository.findByStatus(status, pageable).map(this::toResponse);
        }
        return teamRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TeamResponse findById(Long id) {
        return toResponse(teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada: " + id)));
    }

    public TeamResponse update(Long id, TeamRequest request) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada: " + id));

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setDepartment(request.getDepartment());
        if (request.getStatus() != null) team.setStatus(request.getStatus());

        if (request.getManagerId() != null) {
            Member manager = memberRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado: " + request.getManagerId()));
            team.setManager(manager);
        } else {
            team.setManager(null);
        }

        return toResponse(teamRepository.save(team));
    }

    public void delete(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResourceNotFoundException("Equipe não encontrada: " + id);
        }
        teamRepository.deleteById(id);
    }

    private TeamResponse toResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .department(team.getDepartment())
                .status(team.getStatus())
                .managerId(team.getManager() != null ? team.getManager().getId() : null)
                .managerName(team.getManager() != null ? team.getManager().getName() : null)
                .memberCount(team.getMembers() != null ? team.getMembers().size() : 0)
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }
}
