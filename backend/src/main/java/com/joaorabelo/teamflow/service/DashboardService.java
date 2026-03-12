package com.joaorabelo.teamflow.service;

import com.joaorabelo.teamflow.dto.response.DashboardResponse;
import com.joaorabelo.teamflow.dto.response.MemberResponse;
import com.joaorabelo.teamflow.dto.response.TeamResponse;
import com.joaorabelo.teamflow.entity.Member;
import com.joaorabelo.teamflow.entity.Team;
import com.joaorabelo.teamflow.enums.MemberStatus;
import com.joaorabelo.teamflow.enums.TeamStatus;
import com.joaorabelo.teamflow.repository.MemberRepository;
import com.joaorabelo.teamflow.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;

    public DashboardResponse getDashboard() {
        long totalTeams = teamRepository.count();
        long activeTeams = teamRepository.countByStatus(TeamStatus.ACTIVE);
        long totalMembers = memberRepository.count();
        long activeMembers = memberRepository.countByStatus(MemberStatus.ACTIVE);
        long inactiveMembers = memberRepository.countByStatus(MemberStatus.INACTIVE);
        long onLeaveMembers = memberRepository.countByStatus(MemberStatus.ON_LEAVE);

        List<TeamResponse> recentTeams = teamRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::toTeamResponse)
                .collect(Collectors.toList());

        List<MemberResponse> recentMembers = memberRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(this::toMemberResponse)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalTeams(totalTeams)
                .activeTeams(activeTeams)
                .totalMembers(totalMembers)
                .activeMembers(activeMembers)
                .inactiveMembers(inactiveMembers)
                .onLeaveMembers(onLeaveMembers)
                .recentTeams(recentTeams)
                .recentMembers(recentMembers)
                .build();
    }

    private TeamResponse toTeamResponse(Team team) {
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

    private MemberResponse toMemberResponse(Member member) {
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
