package com.nuvelle.wedding.file.service;

import com.nuvelle.wedding.file.dto.FileUploadResponse;
import com.nuvelle.wedding.file.s3.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Uploader s3Uploader;

    // 파일 업로드
    public FileUploadResponse upload(MultipartFile file, String directory) {
        String url = s3Uploader.upload(file, directory);
        return FileUploadResponse.of(
                url,
                file.getOriginalFilename(),
                file.getSize()
        );
    }

    // 파일 삭제
    public void delete(String fileUrl) {
        s3Uploader.delete(fileUrl);
    }
}