package com.backend.expense_backend.repository;

import com.backend.expense_backend.model.User;
import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;

@NonNullApi
public interface UserRepository extends JpaRepository<User, Long> {
}