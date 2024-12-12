package com.example.hotel_web.service;

import com.example.hotel_web.entity.BookedRoom;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private Room room;
    private BookedRoom newBooking;
    private List<BookedRoom> existingBookings;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId(1L);

        newBooking = new BookedRoom();
        newBooking.setCheckInDate(LocalDate.of(2024, 1, 10));
        newBooking.setCheckOutDate(LocalDate.of(2024, 1, 15));
        newBooking.setBookingConfirmationCode("CONF001");

        existingBookings = Arrays.asList(
                createExistingBooking(LocalDate.of(2024, 1, 5), LocalDate.of(2024, 1, 8)),
                createExistingBooking(LocalDate.of(2024, 1, 20), LocalDate.of(2024, 1, 25))
        );
    }

    private BookedRoom createExistingBooking(LocalDate checkIn, LocalDate checkOut) {
        BookedRoom booking = new BookedRoom();
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        return booking;
    }

    @Test
    void getAllBookingsByRoomId_ShouldReturnBookings() {
        when(bookingRepository.findByRoomId(anyLong())).thenReturn(existingBookings);

        List<BookedRoom> result = bookingService.getAllBookingsByRoomId(1L);

        assertEquals(2, result.size());
        verify(bookingRepository).findByRoomId(1L);
    }

    @Test
    void getAllBookings_ShouldReturnAllBookings() {
        when(bookingRepository.findAll()).thenReturn(existingBookings);

        List<BookedRoom> result = bookingService.getAllBookings();

        assertEquals(2, result.size());
        verify(bookingRepository).findAll();
    }

    @Test
    void cancelBooking_ShouldDeleteBooking() {
        doNothing().when(bookingRepository).deleteById(anyLong());

        bookingService.cancelBooking(1L);

        verify(bookingRepository).deleteById(1L);
    }

    @Test
    void saveBooking_WhenCheckOutDateBeforeCheckInDate_ShouldThrowException() {
        newBooking.setCheckOutDate(LocalDate.of(2024, 1, 1));

        assertThrows(AppException.class, () -> {
            bookingService.saveBooking(1L, newBooking);
        });
    }

    @Test
    void saveBooking_WhenRoomNotAvailable_ShouldThrowException() {
        // Create an existing booking that overlaps with the new booking
        BookedRoom overlappingBooking = createExistingBooking(
                LocalDate.of(2024, 1, 12),
                LocalDate.of(2024, 1, 20)
        );
        room.setBookings(Arrays.asList(overlappingBooking));

        when(roomService.getRoomById(anyLong())).thenReturn(Optional.of(room));

        assertThrows(AppException.class, () -> {
            bookingService.saveBooking(1L, newBooking);
        });
    }

    @Test
    void findByBookingConfirmationCode_WhenExists_ShouldReturnBooking() {
        when(bookingRepository.findByBookingConfirmationCode(anyString()))
                .thenReturn(Optional.of(newBooking));

        BookedRoom result = bookingService.findByBookingConfirmationCode("CONF001");

        assertEquals(newBooking, result);
    }

    @Test
    void findByBookingConfirmationCode_WhenNotExists_ShouldThrowException() {
        when(bookingRepository.findByBookingConfirmationCode(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(AppException.class, () -> {
            bookingService.findByBookingConfirmationCode("NONEXISTENT");
        });
    }

    @Test
    void getBookingsByUserEmail_ShouldReturnBookings() {
        when(bookingRepository.findByGuestEmail(anyString())).thenReturn(existingBookings);

        List<BookedRoom> result = bookingService.getBookingsByUserEmail("test@example.com");

        assertEquals(2, result.size());
        verify(bookingRepository).findByGuestEmail("test@example.com");
    }
}