package com.joaorabelo.teamflow.dto.response;

import com.joaorabelo.teamflow.enums.TeamStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamResponse {
    private Long id;
    private String name;
    private String description;
    private String department;
    private TeamStatus status;
    private Long managerId;
    private String managerName;
    private int memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
