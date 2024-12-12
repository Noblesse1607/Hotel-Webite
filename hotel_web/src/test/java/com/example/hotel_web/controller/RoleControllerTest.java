package com.example.hotel_web.controller;

import com.example.hotel_web.entity.Role;
import com.example.hotel_web.entity.User;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.service.RoleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoleController.class)
@ContextConfiguration(classes = TestSecurityConfig.class)
@AutoConfigureMockMvc
class RoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoleServiceImpl roleService;

    private List<Role> roles;

    @BeforeEach
    void setUp() {
        roles = Arrays.asList(
                Role.builder().id(1L).name("ROLE_ADMIN").build(),
                Role.builder().id(2L).name("ROLE_USER").build()
        );
    }

    @Test
    void getAllRoles_success() throws Exception {
        Mockito.when(roleService.getRoles()).thenReturn(roles);

        mockMvc.perform(get("/roles/all-roles"))
                .andExpect(status().isFound())
                .andExpect(jsonPath("$[0].name").value("ROLE_ADMIN"))
                .andExpect(jsonPath("$[1].name").value("ROLE_USER"));
    }

    @Test
    void createRole_success() throws Exception {
        Role role = Role.builder().id(1L).name("ROLE_MANAGER").build();
        Mockito.when(roleService.createRole(any(Role.class))).thenReturn(role);

        mockMvc.perform(post("/roles/create-new-role")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "name": "ROLE_MANAGER"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(content().string("New role created successfully!"));
    }

    @Test
    void deleteRole_success() throws Exception {
        Mockito.doNothing().when(roleService).deleteRole(anyLong());

        mockMvc.perform(delete("/roles/delete/{roleId}", 1))
                .andExpect(status().isOk());
    }

    @Test
    void removeAllUsersFromRole_success() throws Exception {
        Role role = Role.builder().id(1L).name("ROLE_USER").build();
        Mockito.when(roleService.removeAllUsersFromRole(anyLong())).thenReturn(role);

        mockMvc.perform(post("/roles/remove-all-users-from-role/{roleId}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("ROLE_USER"));
    }

    @Test
    void removeUserFromRole_success() throws Exception {
        User user = User.builder().id(1L).email("user@example.com").build();
        Mockito.when(roleService.removeUserFromRole(anyLong(), anyLong())).thenReturn(user);

        mockMvc.perform(post("/roles/remove-user-from-role")
                        .param("userId", "1")
                        .param("roleId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    void assignUserToRole_success() throws Exception {
        User user = User.builder().id(1L).email("user@example.com").build();
        Mockito.when(roleService.assignRoleToUser(anyLong(), anyLong())).thenReturn(user);

        mockMvc.perform(post("/roles/assign-user-to-role")
                        .param("userId", "1")
                        .param("roleId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }
}

