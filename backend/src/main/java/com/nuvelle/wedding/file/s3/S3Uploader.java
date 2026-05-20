package com.nuvelle.wedding.file.s3;

import com.nuvelle.wedding.global.exception.CustomException;
import com.nuvelle.wedding.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;
// import software.amazon.awssdk.core.sync.RequestBody;
// import software.amazon.awssdk.services.s3.S3Client;
// import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
// import software.amazon.awssdk.services.s3.model.PutObjectRequest;

// import java.io.IOException;


@Slf4j
@Component
@RequiredArgsConstructor
public class S3Uploader {

    //private final S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.region.static}")
    private String region;

    public String upload(MultipartFile file, String directory) {
        validateFile(file);
        String filename = UUID.randomUUID().toString().substring(0, 10)
                + "_" + file.getOriginalFilename();
        log.info("더미 모드: 파일 업로드 스킵 - {}", filename);
        return "https://dummy-s3.example.com/" + directory + "/" + filename;
    }

    public void delete(String fileUrl) {
        log.info("더미 모드: 파일 삭제 스킵 - {}", fileUrl);
    }

    /* S3 실제 연동 후 이 코드로 변경
     // 파일 업로드
    public String upload(MultipartFile file, String directory) {
        validateFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);
        String key = directory + "/" + UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(
                    file.getInputStream(), file.getSize()));

            String url = buildUrl(key);
            log.info("S3 업로드 완료: {}", url);
            return url;

        } catch (IOException e) {
            log.error("S3 업로드 실패: {}", e.getMessage());
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    // 파일 삭제
    public void delete(String fileUrl) {
        String key = extractKey(fileUrl);
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();
            s3Client.deleteObject(request);
            log.info("S3 삭제 완료: {}", key);
        } catch (Exception e) {
            log.error("S3 삭제 실패: {}", e.getMessage());
        }
    }

     */

    // 파일 검증
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }

        // 파일 크기 검증 (10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new CustomException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        // 확장자 검증
        String extension = getExtension(file.getOriginalFilename()).toLowerCase();
        if (!extension.equals("jpg") && !extension.equals("jpeg")
                && !extension.equals("png") && !extension.equals("webp")
                && !extension.equals("gif")) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }
    }

    // 확장자 추출
    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new CustomException(ErrorCode.INVALID_FILE_TYPE);
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    // S3 URL 생성 (업로드 후 URL 생성)
    private String buildUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key);
    }

    // URL에서 key 추출 (삭제 시 필요)
    private String extractKey(String fileUrl) {
        String prefix = String.format("https://%s.s3.%s.amazonaws.com/", bucket, region);
        return fileUrl.replace(prefix, "");
    }
}