package com.nuvelle.wedding.rsvp.repository;

import com.nuvelle.wedding.rsvp.entity.Rsvp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RsvpRepository extends JpaRepository<Rsvp, Long> {

    List<Rsvp> findAllByInvitationIdOrderByCreatedAtDesc(Long invitationId);

    int countByInvitationId(Long invitationId);
}