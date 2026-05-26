package com.nuvelle.wedding.honeymoon.controller;

import com.nuvelle.wedding.auth.security.CustomUserDetails;
import com.nuvelle.wedding.global.response.ApiResponse;
import com.nuvelle.wedding.honeymoon.dto.DestinationTranslateRequest;
import com.nuvelle.wedding.honeymoon.dto.DestinationTranslateResponse;
import com.nuvelle.wedding.honeymoon.service.DestinationTranslateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/honeymoon/destinations")
@RequiredArgsConstructor
public class DestinationTranslateController {

    private final DestinationTranslateService destinationTranslateService;

    @PostMapping("/translate")
    public ResponseEntity<ApiResponse<DestinationTranslateResponse>> translate(
            @Valid @RequestBody DestinationTranslateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String query = destinationTranslateService.getEnglishDestinationQuery(
                request.getDestination(),
                userDetails
        );

        return ResponseEntity.ok(
                ApiResponse.success(DestinationTranslateResponse.of(query))
        );
    }
}
