package com.joaorabelo.teamflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private long totalTeams;
    private long activeTeams;
    private long totalMembers;
    private long activeMembers;
    private long inactiveMembers;
    private long onLeaveMembers;
    private List<TeamResponse> recentTeams;
    private List<MemberResponse> recentMembers;
}
