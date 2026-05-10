package com.nuvelle.wedding.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // 공통
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "입력값이 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),

    // 인증
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 올바르지 않습니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    REFRESH_TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "Refresh Token을 찾을 수 없습니다."),
    REFRESH_TOKEN_MISMATCH(HttpStatus.UNAUTHORIZED, "Refresh Token이 일치하지 않습니다."),

    // 템플릿
    TEMPLATE_NOT_FOUND(HttpStatus.NOT_FOUND, "템플릿을 찾을 수 없습니다."),

    // 청첩장
    INVITATION_NOT_FOUND(HttpStatus.NOT_FOUND, "청첩장을 찾을 수 없습니다."),
    INVITATION_ACCESS_DENIED(HttpStatus.FORBIDDEN, "본인의 청첩장만 수정할 수 있습니다."),
    INVITATION_NOT_PUBLISHED(HttpStatus.FORBIDDEN, "발행된 청첩장이 아닙니다."),
    SLUG_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용 중인 슬러그입니다."),

    // 파일
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 초과되었습니다."),

    // RSVP
    RSVP_NOT_ALLOWED(HttpStatus.FORBIDDEN, "RSVP가 비활성화된 청첩장입니다."),

    // 방명록
    GUESTBOOK_NOT_ALLOWED(HttpStatus.FORBIDDEN, "방명록이 비활성화된 청첩장입니다."),
    GUESTBOOK_NOT_FOUND(HttpStatus.NOT_FOUND, "방명록 항목을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
