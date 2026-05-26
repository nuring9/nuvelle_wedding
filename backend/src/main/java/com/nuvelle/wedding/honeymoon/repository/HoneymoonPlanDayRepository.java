package com.nuvelle.wedding.honeymoon.repository;

import com.nuvelle.wedding.honeymoon.entity.HoneymoonPlanDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HoneymoonPlanDayRepository extends JpaRepository<HoneymoonPlanDay, Long> {

    Optional<HoneymoonPlanDay> findByIdAndPlanId(Long dayId, Long planId);
}