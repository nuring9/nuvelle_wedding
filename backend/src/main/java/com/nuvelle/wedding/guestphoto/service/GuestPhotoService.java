package com.nuvelle.wedding.guestphoto.service;

import com.nuvelle.wedding.file.s3.S3Uploader;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.guestphoto.dto.GuestPhotoResponse;
import com.nuvelle.wedding.guestphoto.entity.GuestPhoto;
import com.nuvelle.wedding.guestphoto.repository.GuestPhotoRepository;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.InvitationStatus;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuestPhotoService {
    private final GuestPhotoRepository guestPhotoRepository;
    private final InvitationRepository invitationRepository;
    private final S3Uploader s3Uploader;

    @Transactional
    public GuestPhotoResponse upload(String slug, MultipartFile file,
                                     String uploaderName, String message) {
        Invitation invitation = invitationRepository.findBySlugAndStatus(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        if(!invitation.isGuestPhotoEnabled()){
            throw new CustomException(ErrorCode.GUEST_PHOTO_NOT_ALLOWED);
        }

        String imageUrl = s3Uploader.upload(file, "guest-photos");

        GuestPhoto photo = GuestPhoto.builder()
                .invitation(invitation)
                .imageUrl(imageUrl)
                .uploaderName(uploaderName)
                .message(message)
                .build();

        guestPhotoRepository.save(photo);

        return GuestPhotoResponse.from(photo);

    }

    // 게스트 사진 목록 조회
    @Transactional(readOnly = true)
    public List<GuestPhotoResponse> getList(String slug){
        Invitation invitation = invitationRepository
                .findBySlugAndStatus(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        return guestPhotoRepository
                .findAllByInvitationIdOrderByCreatedAtDesc(invitation.getId())
                .stream()
                .map(GuestPhotoResponse :: from)
                .collect(Collectors.toList());
    }
}
