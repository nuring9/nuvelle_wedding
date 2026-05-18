package com.nuvelle.wedding.invitation.repository;

import com.nuvelle.wedding.invitation.entity.InvitationGallery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationGalleryRepository extends JpaRepository<InvitationGallery, Long> {

    List<InvitationGallery> findAllByInvitationIdOrderBySortOrderAsc(Long invitationId);

    Optional<InvitationGallery> findByIdAndInvitationId(Long id, Long invitationId);

    int countByInvitationId(Long invitationId);

}
