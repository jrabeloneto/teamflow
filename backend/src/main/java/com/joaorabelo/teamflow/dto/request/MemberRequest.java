package com.joaorabelo.teamflow.dto.request;

import com.joaorabelo.teamflow.enums.MemberStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MemberRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String position;

    @Size(max = 50)
    private String department;

    private String avatarUrl;

    private MemberStatus status = MemberStatus.ACTIVE;

    private LocalDate joinDate;

    private Long teamId;
}
