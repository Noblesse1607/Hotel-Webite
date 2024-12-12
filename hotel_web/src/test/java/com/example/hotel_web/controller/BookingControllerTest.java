package com.example.hotel_web.controller;

import com.example.hotel_web.dto.response.BookingResponse;
import com.example.hotel_web.dto.response.RoomResponse;
import com.example.hotel_web.entity.BookedRoom;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.service.BookingService;
import com.example.hotel_web.service.RoomService;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
@AutoConfigureMockMvc
@ContextConfiguration(classes = TestSecurityConfig.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private RoomService roomService;

    private List<BookedRoom> bookings;

    @BeforeEach
    void setUp() {
        Room room = Room.builder().id(1L).roomType("Deluxe").roomPrice(new BigDecimal("200.00")).build();

        bookings = Arrays.asList(
                BookedRoom.builder()
                        .bookingId(1L)
                        .NumOfAdults(2)
                        .NumOfChildren(2)
                        .checkInDate(LocalDate.of(2024, 12, 15))
                        .checkOutDate(LocalDate.of(2024, 12, 20))
                        .guestFullName("John Doe")
                        .guestEmail("john.doe@example.com")
                        .totalNumOfGuest(3)
                        .bookingConfirmationCode("CONF123")
                        .room(room)
                        .build());
    }

    @Test
    void getAllBookings_success() throws Exception {
        Mockito.when(bookingService.getAllBookings()).thenReturn(bookings);
        Mockito.when(roomService.getRoomById(anyLong())).thenReturn(Optional.of(bookings.get(0).getRoom()));

        mockMvc.perform(get("/bookings/all-bookings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].guestFullName").value("John Doe"))
                .andExpect(jsonPath("$[0].guestEmail").value("john.doe@example.com"))
                .andExpect(jsonPath("$[0].room.roomType").value("Deluxe"));
    }

    @Test
    void getBookingsByUserEmail_success() throws Exception {
        Mockito.when(bookingService.getBookingsByUserEmail(anyString())).thenReturn(bookings);
        Mockito.when(roomService.getRoomById(anyLong())).thenReturn(Optional.of(bookings.get(0).getRoom()));

        mockMvc.perform(get("/bookings/user/{email}/bookings", "john.doe@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].guestFullName").value("John Doe"))
                .andExpect(jsonPath("$[0].guestEmail").value("john.doe@example.com"));
    }

    @Test
    void saveBooking_success() throws Exception {
        Mockito.when(bookingService.saveBooking(anyLong(), any(BookedRoom.class)))
                .thenReturn("CONF123");

        mockMvc.perform(post("/bookings/room/{roomId}/booking", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "checkInDate": "2024-12-15",
                                    "checkOutDate": "2024-12-20",
                                    "guestFullName": "John Doe",
                                    "guestEmail": "john.doe@example.com",
                                    "numOfAdults": 2,
                                    "numOfChildren": 1,
                                    "totalNumOfGuest": 3
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(content().string("Room booked successfully, Your booking confirmation code is :CONF123"));
    }

    @Test
    void getBookingByConfirmationCode_success() throws Exception {
        Mockito.when(bookingService.findByBookingConfirmationCode(anyString())).thenReturn(bookings.get(0));
        Mockito.when(roomService.getRoomById(anyLong())).thenReturn(Optional.of(bookings.get(0).getRoom()));

        mockMvc.perform(get("/bookings/confirmation/{confirmationCode}", "CONF123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.guestFullName").value("John Doe"))
                .andExpect(jsonPath("$.bookingConfirmationCode").value("CONF123"));
    }

    @Test
    void getBookingByConfirmationCode_notFound() throws Exception {
        Mockito.when(bookingService.findByBookingConfirmationCode(anyString()))
                .thenThrow(new AppException(ErrorCode.BOOKING_NOT_FOUND));

        mockMvc.perform(get("/bookings/confirmation/{confirmationCode}", "INVALID123"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("No booking found with booking code :"));
    }

    @Test
    void cancelBooking_success() throws Exception {
        Mockito.doNothing().when(bookingService).cancelBooking(anyLong());

        mockMvc.perform(delete("/bookings/booking/{bookingId}/delete", 1))
                .andExpect(status().isOk());
    }
}
