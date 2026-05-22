package com.nuvelle.wedding.guestphoto.controller;

import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.guestphoto.dto.GuestPhotoResponse;
import com.nuvelle.wedding.guestphoto.service.GuestPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GuestPhotoController {
    private final GuestPhotoService guestPhotoService;

    @PostMapping(
            value = "/api/public/invitations/{slug}/guest-photos",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<GuestPhotoResponse>> upload(
            @PathVariable String slug,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "uploaderName", required = false) String uploaderName,
            @RequestParam(value = "message", required = false) String message) {

        GuestPhotoResponse response = guestPhotoService.upload(slug, file, uploaderName, message);
        return ResponseEntity.ok(ApiResponse.success("사진이 업로드되었습니다.", response));
    }

    @GetMapping("/api/public/invitations/{slug}/guest-photos")
    public ResponseEntity<ApiResponse<List<GuestPhotoResponse>>> getList(@PathVariable String slug) {
        List<GuestPhotoResponse> responses = guestPhotoService.getList(slug);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

}
