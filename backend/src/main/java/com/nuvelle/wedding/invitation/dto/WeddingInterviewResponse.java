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
    private String question6;
    private String answer6;
    private String question7;
    private String answer7;
    private String question8;
    private String answer8;
    private String question9;
    private String answer9;
    private String question10;
    private String answer10;

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
                .question6(interview.getQuestion6())
                .answer6(interview.getAnswer6())
                .question7(interview.getQuestion7())
                .answer7(interview.getAnswer7())
                .question8(interview.getQuestion8())
                .answer8(interview.getAnswer8())
                .question9(interview.getQuestion9())
                .answer9(interview.getAnswer9())
                .question10(interview.getQuestion10())
                .answer10(interview.getAnswer10())
                .build();
    }
}
