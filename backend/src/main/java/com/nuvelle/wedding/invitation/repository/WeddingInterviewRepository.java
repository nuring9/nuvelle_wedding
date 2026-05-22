package com.nuvelle.wedding.invitation.repository;

import com.nuvelle.wedding.invitation.entity.WeddingInterview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeddingInterviewRepository extends JpaRepository<WeddingInterview, Long> {

    Optional<WeddingInterview> findByInvitationId(Long invitationId);
}