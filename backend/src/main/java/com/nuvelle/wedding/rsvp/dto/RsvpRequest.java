package com.nuvelle.wedding.rsvp.dto;

import com.nuvelle.wedding.rsvp.entity.AttendanceStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class RsvpRequest {

    @NotBlank(message = "이름은 필수입니다.")
    @Size(max = 50, message = "이름은 50자 이하여야 합니다.")
    private String guestName;

    @NotNull(message = "참석 여부는 필수입니다.")
    private AttendanceStatus attendanceStatus;

    @Min(value = 1, message = "참석 인원은 1명 이상이어야 합니다.")
    private int guestCount;

    private String message;

    @Size(max = 20, message = "전화번호는 20자 이하여야 합니다.")
    private String phone;
}