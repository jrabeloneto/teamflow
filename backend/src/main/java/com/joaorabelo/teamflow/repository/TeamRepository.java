package com.joaorabelo.teamflow.repository;

import com.joaorabelo.teamflow.entity.Team;
import com.joaorabelo.teamflow.enums.TeamStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Page<Team> findByStatus(TeamStatus status, Pageable pageable);

    @Query("SELECT t FROM Team t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(t.department) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Team> findBySearchTerm(@Param("search") String search, Pageable pageable);

    List<Team> findByStatus(TeamStatus status);

    long countByStatus(TeamStatus status);
}
