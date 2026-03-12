package com.joaorabelo.teamflow.dto.request;

import com.joaorabelo.teamflow.enums.TeamStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TeamRequest {

    @NotBlank(message = "Nome da equipe é obrigatório")
    @Size(min = 2, max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @Size(max = 50)
    private String department;

    private TeamStatus status = TeamStatus.ACTIVE;

    private Long managerId;
}
