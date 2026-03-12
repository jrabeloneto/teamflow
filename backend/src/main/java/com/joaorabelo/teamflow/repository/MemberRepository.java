package com.joaorabelo.teamflow.repository;

import com.joaorabelo.teamflow.entity.Member;
import com.joaorabelo.teamflow.enums.MemberStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);

    List<Member> findByTeamId(Long teamId);

    Page<Member> findByStatus(MemberStatus status, Pageable pageable);

    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.position) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Member> findBySearchTerm(@Param("search") String search, Pageable pageable);

    long countByStatus(MemberStatus status);

    long countByTeamId(Long teamId);
}
