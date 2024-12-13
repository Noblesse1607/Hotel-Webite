package com.example.hotel_web.controller;

import com.example.hotel_web.entity.User;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc
@ContextConfiguration(classes = TestSecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserServiceImpl userService;

    private List<User> userList;

    @BeforeEach
    void setUp() {
        userList = Arrays.asList(
                User.builder().id(1L).email("user1@example.com").password("password1").build(),
                User.builder().id(2L).email("user2@example.com").password("password2").build()
        );
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getUsers_success() throws Exception {
        Mockito.when(userService.getUsers()).thenReturn(userList);

        mockMvc.perform(get("/users/all"))
                .andExpect(status().isFound())
                .andExpect(jsonPath("$[0].email").value("user1@example.com"))
                .andExpect(jsonPath("$[1].email").value("user2@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getUserByEmail_success() throws Exception {
        User user = userList.get(0);
        Mockito.when(userService.getUser(anyString())).thenReturn(user);

        mockMvc.perform(get("/users/{email}", "user1@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user1@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getUserByEmail_notFound() throws Exception {
        Mockito.when(userService.getUser(anyString())).thenThrow(new AppException(ErrorCode.USER_NOT_FOUND));

        mockMvc.perform(get("/users/{email}", "nonexistent@example.com"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error fetching user"));
    }

    @Test
    @WithMockUser(username = "user1@example.com", roles = "ADMIN")
    void deleteUser_success() throws Exception {
        String userEmail = "user1@example.com";

        Mockito.doNothing().when(userService).deleteUser(userEmail);

        mockMvc.perform(delete("/users/delete/{userId}", userEmail)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("User deleted successfully"));

        Mockito.verify(userService).deleteUser(userEmail);
    }

}
