package com.nuvelle.wedding.invitation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor
public class InvitationAccount {

    @Column(name = "account_side", length = 20)
    private String side; // GROOM 또는 BRIDE

    @Column(name = "account_label", length = 50)
    private String label; // 신랑, 신랑 아버지 등 표시 이름

    @Column(name = "bank_name", length = 50)
    private String bankName; // 은행명

    @Column(name = "account_number", length = 50)
    private String accountNumber; // 계좌번호

    @Column(name = "account_holder", length = 50)
    private String accountHolder; // 예금주

    @Column(name = "remittance_link", length = 500)
    private String remittanceLink; // 계좌별 카카오뱅크 송금 URL

    public InvitationAccount(
            String side,
            String label,
            String bankName,
            String accountNumber,
            String accountHolder,
            String remittanceLink
    ) {
        this.side = side;
        this.label = label;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.remittanceLink = remittanceLink;
    }
}
