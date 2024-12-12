package com.example.hotel_web.controller;

import com.example.hotel_web.dto.request.RoomRequest;
import com.example.hotel_web.dto.response.RoomResponse;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.service.BookingService;
import com.example.hotel_web.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
@ContextConfiguration(classes = TestSecurityConfig.class)
@AutoConfigureMockMvc
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @MockBean
    private BookingService bookingService;

    private Room room;

    @BeforeEach
    void setUp() {
        room = Room.builder()
                .id(1L)
                .roomType("Deluxe")
                .roomPrice(BigDecimal.valueOf(150.0))
                .isBooked(false)
                .build();
    }

    //ockMultipartFile photo = new MockMultipartFile("photo", "room_image.jpg", "image/jpeg", "image content".getBytes());

    @Test
    void addNewRoom_success() throws Exception {
        // Creating a mock photo file for the test
        MockMultipartFile photo = new MockMultipartFile("photo", "room_image.jpg", "image/jpeg", "image content".getBytes());

        RoomRequest roomRequest = RoomRequest.builder()
                .photo(photo)
                .roomType("Deluxe")
                .roomPrice(BigDecimal.valueOf(150.0))
                .build();

        Mockito.when(roomService.addNewRoom(any(RoomRequest.class))).thenReturn(room);

        mockMvc.perform(multipart("/rooms/add/new-room")
                        .file(photo)  // Uploading the photo
                        .param("roomType", "Deluxe")
                        .param("roomPrice", "150.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomType").value("Deluxe"))
                .andExpect(jsonPath("$.roomPrice").value(150.0));
    }

    @Test
    void getAllRooms_success() throws Exception {
        Mockito.when(roomService.getAllRooms()).thenReturn(Arrays.asList(room));

        mockMvc.perform(get("/rooms/all-rooms"))
                .andExpect(status().isOk());
    }

    @Test
    void getAvailableRooms_noContent() throws Exception {
        // Mocking the service to return an empty list (no available rooms)
        Mockito.when(roomService.getAvailableRooms(any(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/rooms/available-rooms")
                        .param("checkInDate", "2024-12-15")
                        .param("checkOutDate", "2024-12-20")
                        .param("roomType", "Deluxe"))
                .andExpect(status().isNoContent())  // Expecting 204 No Content status
                .andExpect(content().string(""));  // Empty body as expected for 204 status
    }


    @Test
    void getRoomById_success() throws Exception {
        Mockito.when(roomService.getRoomById(anyLong())).thenReturn(Optional.of(room));

        mockMvc.perform(get("/rooms/room/{roomId}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roomType").value("Deluxe"))
                .andExpect(jsonPath("$.roomPrice").value(150.0));
    }

    @Test
    @WithMockUser(roles = "ADMIN")  // Mô phỏng người dùng có vai trò ADMIN
    void updateRoom_success() throws Exception {
        // Tạo một đối tượng RoomRequest mẫu
        RoomRequest roomRequest = new RoomRequest();
        roomRequest.setRoomType("Deluxe");
        roomRequest.setRoomPrice(BigDecimal.valueOf(150.0));

        // Tạo một đối tượng Room mẫu mà phương thức service trả về
        Room room = new Room();
        room.setId(1L);
        room.setRoomType("Deluxe");
        room.setRoomPrice(BigDecimal.valueOf(150.0));

        // Mô phỏng hành vi của roomService.updateRoom
        Mockito.when(roomService.updateRoom(Mockito.anyLong(), Mockito.any(RoomRequest.class))).thenReturn(room);

        // Thực hiện PUT request
        mockMvc.perform(put("/rooms/update/{roomId}", 1L)
                        .contentType(MediaType.MULTIPART_FORM_DATA)  // Cần content type thích hợp cho @ModelAttribute
                        .content(new ObjectMapper().writeValueAsString(roomRequest)))  // Chuyển đổi roomRequest thành JSON
                .andExpect(status().isOk())  // Kiểm tra mã trạng thái HTTP
                .andExpect(jsonPath("$.id").value(1))  // Kiểm tra ID của phòng trong phản hồi
                .andExpect(jsonPath("$.roomType").value("Deluxe"))  // Kiểm tra loại phòng trong phản hồi
                .andExpect(jsonPath("$.roomPrice").value(150.0));  // Kiểm tra giá phòng trong phản hồi
    }




    @Test
    void deleteRoom_success() throws Exception {
        Mockito.doNothing().when(roomService).deleteRoom(anyLong());

        mockMvc.perform(delete("/rooms/delete/{roomId}", 1L))
                .andExpect(status().isNoContent());
    }

}
