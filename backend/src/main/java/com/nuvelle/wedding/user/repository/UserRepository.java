package com.nuvelle.wedding.user.repository;

import com.nuvelle.wedding.user.entity.User;
import com.nuvelle.wedding.user.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByKakaoId(Long kakaoId);

    boolean existsByEmail(String email);

    long countByRole(com.nuvelle.wedding.user.entity.UserRole role);

    @Query("""
            SELECT u FROM User u
            WHERE (:status IS NULL OR u.status = :status)
              AND (:keyword IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
            ORDER BY u.createdAt DESC
            """)
    List<User> findAdminUsers(@Param("keyword") String keyword, @Param("status") UserStatus status);
}
