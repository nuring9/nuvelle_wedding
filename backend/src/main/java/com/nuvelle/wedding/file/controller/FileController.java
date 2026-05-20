package com.nuvelle.wedding.file.controller;

import com.nuvelle.wedding.file.dto.FileDeleteRequest;
import com.nuvelle.wedding.file.dto.FileUploadResponse;
import com.nuvelle.wedding.file.service.FileService;
import com.nuvelle.wedding.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // 파일 업로드
    // directory 예시: invitations/main, invitations/gallery, templates/thumbnail
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FileUploadResponse>> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "invitations/main") String directory) {
        FileUploadResponse response = fileService.upload(file, directory);
        return ResponseEntity.ok(ApiResponse.success("파일이 업로드되었습니다.", response));
    }

    // 파일 삭제
    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> delete(
            @Valid @RequestBody FileDeleteRequest request) {
        fileService.delete(request.getFileUrl());
        return ResponseEntity.ok(ApiResponse.success("파일이 삭제되었습니다."));
    }
}