package com.joaorabelo.teamflow.service;

import com.joaorabelo.teamflow.dto.request.MemberRequest;
import com.joaorabelo.teamflow.dto.response.MemberResponse;
import com.joaorabelo.teamflow.entity.Member;
import com.joaorabelo.teamflow.entity.Team;
import com.joaorabelo.teamflow.enums.MemberStatus;
import com.joaorabelo.teamflow.exception.DuplicateResourceException;
import com.joaorabelo.teamflow.exception.ResourceNotFoundException;
import com.joaorabelo.teamflow.repository.MemberRepository;
import com.joaorabelo.teamflow.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    public MemberResponse create(MemberRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("E-mail já cadastrado: " + request.getEmail());
        }

        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .position(request.getPosition())
                .department(request.getDepartment())
                .avatarUrl(request.getAvatarUrl())
                .status(request.getStatus() != null ? request.getStatus() : MemberStatus.ACTIVE)
                .joinDate(request.getJoinDate())
                .build();

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada: " + request.getTeamId()));
            member.setTeam(team);
        }

        return toResponse(memberRepository.save(member));
    }

    @Transactional(readOnly = true)
    public Page<MemberResponse> findAll(String search, MemberStatus status, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return memberRepository.findBySearchTerm(search, pageable).map(this::toResponse);
        }
        if (status != null) {
            return memberRepository.findByStatus(status, pageable).map(this::toResponse);
        }
        return memberRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public MemberResponse findById(Long id) {
        return toResponse(memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado: " + id)));
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> findByTeam(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new ResourceNotFoundException("Equipe não encontrada: " + teamId);
        }
        return memberRepository.findByTeamId(teamId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MemberResponse update(Long id, MemberRequest request) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado: " + id));

        if (!member.getEmail().equals(request.getEmail()) && memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("E-mail já cadastrado: " + request.getEmail());
        }

        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPhone(request.getPhone());
        member.setPosition(request.getPosition());
        member.setDepartment(request.getDepartment());
        member.setAvatarUrl(request.getAvatarUrl());
        if (request.getStatus() != null) member.setStatus(request.getStatus());
        member.setJoinDate(request.getJoinDate());

        if (request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Equipe não encontrada: " + request.getTeamId()));
            member.setTeam(team);
        } else {
            member.setTeam(null);
        }

        return toResponse(memberRepository.save(member));
    }

    public void delete(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membro não encontrado: " + id);
        }
        memberRepository.deleteById(id);
    }

    private MemberResponse toResponse(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .position(member.getPosition())
                .department(member.getDepartment())
                .avatarUrl(member.getAvatarUrl())
                .status(member.getStatus())
                .joinDate(member.getJoinDate())
                .teamId(member.getTeam() != null ? member.getTeam().getId() : null)
                .teamName(member.getTeam() != null ? member.getTeam().getName() : null)
                .createdAt(member.getCreatedAt())
                .updatedAt(member.getUpdatedAt())
                .build();
    }
}
