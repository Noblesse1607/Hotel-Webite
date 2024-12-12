package com.example.hotel_web.service;

import com.example.hotel_web.entity.Role;
import com.example.hotel_web.entity.User;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.repository.RoleRepository;
import com.example.hotel_web.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoleServiceImpl roleService;

    // Test getRoles
    @Test
    public void testGetRoles() {
        Role role1 = new Role("ROLE_ADMIN");
        Role role2 = new Role("ROLE_USER");
        Mockito.when(roleRepository.findAll()).thenReturn(List.of(role1, role2));

        List<Role> roles = roleService.getRoles();

        assertEquals(2, roles.size());
        assertTrue(roles.contains(role1));
        assertTrue(roles.contains(role2));
    }

    @Test
    public void testCreateRole_success() {
        // Tạo một Role mới với tên "ADMIN"
        Role role = new Role("ADMIN");

        // Giả lập việc role "ROLE_ADMIN" chưa tồn tại trong cơ sở dữ liệu
        Mockito.when(roleRepository.existsByName("ROLE_ADMIN")).thenReturn(false);

        // Giả lập phương thức save() của roleRepository trả về đối tượng role đã được tạo
        Mockito.when(roleRepository.save(Mockito.any(Role.class))).thenReturn(role);

        // Gọi phương thức createRole để kiểm tra
        Role createdRole = roleService.createRole(role);

        // Xác minh phương thức save() đã được gọi một lần
        Mockito.verify(roleRepository).save(Mockito.any(Role.class));

        // Kiểm tra xem tên role đã được chuyển thành "ROLE_ADMIN"
        assertEquals("ADMIN", createdRole.getName());
    }


    @Test
    public void testCreateRole_roleExists() {
        Role role = new Role("ADMIN");
        Mockito.when(roleRepository.existsByName("ROLE_ADMIN")).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> roleService.createRole(role));

        assertEquals(ErrorCode.EXIST_BY_ROLE_NAME, exception.getErrorCode());
    }

    // Test deleteRole
    @Test
    public void testDeleteRole() {
        Long roleId = 1L;
        Role role = new Role("ROLE_ADMIN");
        Mockito.when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        Mockito.when(roleRepository.save(Mockito.any(Role.class))).thenReturn(role);

        roleService.deleteRole(roleId);

        Mockito.verify(roleRepository).deleteById(roleId);
    }

    // Test removeUserFromRole
    @Test
    public void testRemoveUserFromRole_success() {
        Long userId = 1L;
        Long roleId = 1L;

        User user = new User();
        user.setId(userId);

        Role role = new Role("ROLE_ADMIN");
        role.assignRoleToUser(user);

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        Mockito.when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        User removedUser = roleService.removeUserFromRole(userId, roleId);

        assertEquals(userId, removedUser.getId());
        Mockito.verify(roleRepository).save(Mockito.any(Role.class));
    }

    @Test
    public void testRemoveUserFromRole_userNotFound() {
        Long userId = 1L;
        Long roleId = 1L;

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> roleService.removeUserFromRole(userId, roleId));

        assertEquals(ErrorCode.USER_NOT_FOUND, exception.getErrorCode());
    }

    // Test assignRoleToUser
    @Test
    public void testAssignRoleToUser_success() {
        Long userId = 1L;
        Long roleId = 1L;

        User user = new User();
        user.setId(userId);

        Role role = new Role("ROLE_ADMIN");

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        Mockito.when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        User assignedUser = roleService.assignRoleToUser(userId, roleId);

        assertTrue(assignedUser.getRoles().contains(role));
        Mockito.verify(roleRepository).save(Mockito.any(Role.class));
    }

    @Test
    public void testAssignRoleToUser_roleAlreadyAssigned() {
        Long userId = 1L;
        Long roleId = 1L;

        User user = new User();
        user.setId(userId);
        Role role = new Role("ROLE_ADMIN");
        role.assignRoleToUser(user);

        Mockito.when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        Mockito.when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));

        AppException exception = assertThrows(AppException.class, () -> roleService.assignRoleToUser(userId, roleId));

        assertEquals(ErrorCode.USER_EXISTED, exception.getErrorCode());
    }

    // Test removeAllUsersFromRole
    @Test
    public void testRemoveAllUsersFromRole() {
        Long roleId = 1L;
        Role role = new Role("ROLE_ADMIN");

        Mockito.when(roleRepository.findById(roleId)).thenReturn(Optional.of(role));
        Mockito.when(roleRepository.save(Mockito.any(Role.class))).thenReturn(role);

        roleService.removeAllUsersFromRole(roleId);

        Mockito.verify(roleRepository).save(Mockito.any(Role.class));
    }
}

