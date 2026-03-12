package com.joaorabelo.teamflow.config;

import com.joaorabelo.teamflow.entity.Member;
import com.joaorabelo.teamflow.entity.Team;
import com.joaorabelo.teamflow.entity.User;
import com.joaorabelo.teamflow.enums.MemberStatus;
import com.joaorabelo.teamflow.enums.Role;
import com.joaorabelo.teamflow.enums.TeamStatus;
import com.joaorabelo.teamflow.repository.MemberRepository;
import com.joaorabelo.teamflow.repository.TeamRepository;
import com.joaorabelo.teamflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Dados já inicializados. Pulando seed.");
            return;
        }

        log.info("Inicializando dados de demonstração...");

        // Usuários
        User admin = User.builder()
                .name("João Rabelo")
                .email("admin@teamflow.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ROLE_ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        User manager = User.builder()
                .name("Ana Lima")
                .email("manager@teamflow.com")
                .password(passwordEncoder.encode("manager123"))
                .role(Role.ROLE_MANAGER)
                .active(true)
                .build();
        userRepository.save(manager);

        // Equipes
        Team frontend = Team.builder()
                .name("Frontend Squad")
                .description("Equipe responsável pelo desenvolvimento de interfaces e experiência do usuário.")
                .department("Engenharia")
                .status(TeamStatus.ACTIVE)
                .build();
        teamRepository.save(frontend);

        Team backend = Team.builder()
                .name("Backend Core")
                .description("Equipe responsável pela arquitetura de APIs e serviços de dados.")
                .department("Engenharia")
                .status(TeamStatus.ACTIVE)
                .build();
        teamRepository.save(backend);

        Team design = Team.builder()
                .name("UX/UI Design")
                .description("Equipe de design de produto, pesquisa de usuário e sistemas de design.")
                .department("Produto")
                .status(TeamStatus.ACTIVE)
                .build();
        teamRepository.save(design);

        Team devops = Team.builder()
                .name("DevOps & Infra")
                .description("Equipe de infraestrutura, CI/CD e confiabilidade de sistemas.")
                .department("Infraestrutura")
                .status(TeamStatus.ACTIVE)
                .build();
        teamRepository.save(devops);

        // Membros
        memberRepository.save(Member.builder().name("Carlos Mendes").email("carlos@teamflow.com")
                .position("Tech Lead").department("Engenharia").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2023, 1, 15)).team(frontend).build());

        memberRepository.save(Member.builder().name("Beatriz Costa").email("beatriz@teamflow.com")
                .position("Frontend Developer").department("Engenharia").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2023, 3, 10)).team(frontend).build());

        memberRepository.save(Member.builder().name("Rafael Torres").email("rafael@teamflow.com")
                .position("Frontend Developer").department("Engenharia").status(MemberStatus.ON_LEAVE)
                .joinDate(LocalDate.of(2023, 6, 1)).team(frontend).build());

        memberRepository.save(Member.builder().name("Fernanda Alves").email("fernanda@teamflow.com")
                .position("Backend Engineer").department("Engenharia").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2022, 11, 20)).team(backend).build());

        memberRepository.save(Member.builder().name("Lucas Pereira").email("lucas@teamflow.com")
                .position("Senior Backend Developer").department("Engenharia").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2022, 8, 5)).team(backend).build());

        memberRepository.save(Member.builder().name("Mariana Souza").email("mariana@teamflow.com")
                .position("UX Designer").department("Produto").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2023, 2, 28)).team(design).build());

        memberRepository.save(Member.builder().name("Pedro Nunes").email("pedro@teamflow.com")
                .position("UI Designer").department("Produto").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2023, 7, 12)).team(design).build());

        memberRepository.save(Member.builder().name("Juliana Ramos").email("juliana@teamflow.com")
                .position("DevOps Engineer").department("Infraestrutura").status(MemberStatus.ACTIVE)
                .joinDate(LocalDate.of(2022, 5, 3)).team(devops).build());

        memberRepository.save(Member.builder().name("André Oliveira").email("andre@teamflow.com")
                .position("SRE Engineer").department("Infraestrutura").status(MemberStatus.INACTIVE)
                .joinDate(LocalDate.of(2022, 9, 18)).team(devops).build());

        log.info("Dados de demonstracao inicializados com sucesso!");
        log.info("Admin: admin@teamflow.com / admin123");
        log.info("Manager: manager@teamflow.com / manager123");
    }
}
