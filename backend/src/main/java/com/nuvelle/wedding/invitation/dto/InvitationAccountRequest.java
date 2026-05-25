package com.nuvelle.wedding.invitation.dto;

import lombok.Getter;

@Getter
public class InvitationAccountRequest {
    private String side;
    private String label;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String remittanceLink;
}
