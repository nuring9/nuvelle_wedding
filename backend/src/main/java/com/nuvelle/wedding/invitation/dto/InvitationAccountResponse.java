package com.nuvelle.wedding.invitation.dto;

import com.nuvelle.wedding.invitation.entity.InvitationAccount;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InvitationAccountResponse {
    private String side;
    private String label;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
    private String remittanceLink;

    public static InvitationAccountResponse from(InvitationAccount account) {
        return InvitationAccountResponse.builder()
                .side(account.getSide())
                .label(account.getLabel())
                .bankName(account.getBankName())
                .accountNumber(account.getAccountNumber())
                .accountHolder(account.getAccountHolder())
                .remittanceLink(account.getRemittanceLink())
                .build();
    }
}
