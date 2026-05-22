package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.WeddingInterview;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WeddingInterviewResponse {

    private Long id;
    private String question1;
    private String answer1;
    private String question2;
    private String answer2;
    private String question3;
    private String answer3;
    private String question4;
    private String answer4;
    private String question5;
    private String answer5;

    public static WeddingInterviewResponse from(WeddingInterview interview) {
        return WeddingInterviewResponse.builder()
                .id(interview.getId())
                .question1(interview.getQuestion1())
                .answer1(interview.getAnswer1())
                .question2(interview.getQuestion2())
                .answer2(interview.getAnswer2())
                .question3(interview.getQuestion3())
                .answer3(interview.getAnswer3())
                .question4(interview.getQuestion4())
                .answer4(interview.getAnswer4())
                .question5(interview.getQuestion5())
                .answer5(interview.getAnswer5())
                .build();
    }
}