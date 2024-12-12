package com.example.hotel_web.service;

import com.example.hotel_web.entity.Role;
import com.example.hotel_web.entity.User;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.repository.RoleRepository;
import com.example.hotel_web.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = User.builder().email("test@example.com").password("password").build();
        role = Role.builder().name("ROLE_USER").build();
    }

    // Test registerUser success
    @Test
    void registerUser_success() {
        // Arrange
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User registeredUser = userService.registerUser(user);

        // Assert
        assertNotNull(registeredUser);
        assertEquals("encodedPassword", registeredUser.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    // Test registerUser failure (user already exists)
    @Test
    void registerUser_userAlreadyExists() {
        // Arrange
        when(userRepository.existsByEmail(user.getEmail())).thenReturn(true);

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());
        verify(userRepository, never()).save(any(User.class));
    }

    // Test getUsers
    @Test
    void getUsers_success() {
        // Arrange
        when(userRepository.findAll()).thenReturn(Collections.singletonList(user));

        // Act
        var users = userService.getUsers();

        // Assert
        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals(user.getEmail(), users.get(0).getEmail());
    }

    // Test deleteUser success
    @Test
    void deleteUser_success() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        doNothing().when(userRepository).deleteByEmail(user.getEmail());

        // Act
        userService.deleteUser(user.getEmail());

        // Assert
        verify(userRepository, times(1)).deleteByEmail(user.getEmail());
    }

    // Test deleteUser user not found
    @Test
    void deleteUser_userNotFound() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            userService.deleteUser(user.getEmail());
        });

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
        verify(userRepository, never()).deleteByEmail(anyString());
    }

    // Test getUser success
    @Test
    void getUser_success() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Act
        User foundUser = userService.getUser(user.getEmail());

        // Assert
        assertNotNull(foundUser);
        assertEquals(user.getEmail(), foundUser.getEmail());
    }

    // Test getUser user not found
    @Test
    void getUser_userNotFound() {
        // Arrange
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Act & Assert
        AppException exception = assertThrows(AppException.class, () -> {
            userService.getUser(user.getEmail());
        });

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }
}
