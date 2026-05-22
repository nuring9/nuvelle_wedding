package com.nuvelle.wedding.invitation.service;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import com.nuvelle.wedding.invitation.dto.WeddingInterviewRequest;
import com.nuvelle.wedding.invitation.dto.WeddingInterviewResponse;
import com.nuvelle.wedding.invitation.entity.Invitation;
import com.nuvelle.wedding.invitation.entity.WeddingInterview;
import com.nuvelle.wedding.invitation.repository.InvitationRepository;
import com.nuvelle.wedding.invitation.repository.WeddingInterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WeddingInterviewService {
    private final WeddingInterviewRepository interviewRepository;
    private final InvitationRepository invitationRepository;

    @Transactional
    public WeddingInterviewResponse save(Long invitationId, WeddingInterviewRequest request,
                                         CustomUserDetails userDetails) {

        // 대상 청첩장 먼저 조회
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new CustomException(ErrorCode.INVITATION_NOT_FOUND));

        // 현재 로그인한 사용자가 이 청첩장의 작성자인지
        if (!invitation.isOwnedBy(userDetails.getUserId())) {
            throw new CustomException(ErrorCode.INVITATION_ACCESS_DENIED);
        }

        WeddingInterview interview = interviewRepository
                .findByInvitationId(invitationId)
                .orElse(null);
        // 조회 결과가 있으면 그 인터뷰를 꺼내고, 없으면 null

        if (interview == null) {
            interview = WeddingInterview.builder()
                    .invitation(invitation)
                    .question1(request.getQuestion1())
                    .answer1(request.getAnswer1())
                    .question2(request.getQuestion2())
                    .answer2(request.getAnswer2())
                    .question3(request.getQuestion3())
                    .answer3(request.getAnswer3())
                    .question4(request.getQuestion4())
                    .answer4(request.getAnswer4())
                    .question5(request.getQuestion5())
                    .answer5(request.getAnswer5())
                    .build();
            interviewRepository.save(interview);
        } else {
            interview.update(
                    request.getQuestion1(), request.getAnswer1(),
                    request.getQuestion2(), request.getAnswer2(),
                    request.getQuestion3(), request.getAnswer3(),
                    request.getQuestion4(), request.getAnswer4(),
                    request.getQuestion5(), request.getAnswer5()
            );
        }
        return WeddingInterviewResponse.from(interview);
    }

    @Transactional(readOnly = true)
    public WeddingInterviewResponse get(Long invitationId) {
        return interviewRepository.findByInvitationId(invitationId)
                .map(WeddingInterviewResponse::from)
                .orElse(null);
    }
}
