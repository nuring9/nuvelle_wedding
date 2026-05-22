package com.nuvelle.wedding.bgm.repository;

import com.nuvelle.wedding.bgm.entity.Bgm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BgmRepository extends JpaRepository<Bgm, Long> {

    List<Bgm> findAllByIsActiveTrueOrderBySortOrderAsc();

    Optional<Bgm> findByIdAndIsActiveTrue(Long bgmId);
}