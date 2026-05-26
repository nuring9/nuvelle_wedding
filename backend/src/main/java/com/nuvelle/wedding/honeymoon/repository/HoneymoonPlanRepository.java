package com.nuvelle.wedding.honeymoon.repository;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HoneymoonPlanRepository extends JpaRepository<HoneymoonPlan, Long> {

    List<HoneymoonPlan> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM HoneymoonPlan p LEFT JOIN FETCH p.days WHERE p.id = :planId")
    Optional<HoneymoonPlan> findByIdWithDays(@Param("planId") Long planId);
}