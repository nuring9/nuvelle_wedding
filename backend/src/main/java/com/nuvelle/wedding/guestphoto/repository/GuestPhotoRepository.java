package com.nuvelle.wedding.guestphoto.repository;

import com.nuvelle.wedding.guestphoto.entity.GuestPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestPhotoRepository extends JpaRepository<GuestPhoto, Long> {

    List<GuestPhoto> findAllByInvitationIdOrderByCreatedAtDesc(Long invitationId);
}