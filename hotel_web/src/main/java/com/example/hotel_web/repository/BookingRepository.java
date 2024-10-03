package com.example.hotel_web.repository;

import com.example.hotel_web.dto.response.BookingResponse;
import com.example.hotel_web.entity.BookedRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<BookedRoom, Long> {
    List<BookedRoom> findByRoomId(Long roomId);

    List<BookedRoom> findByGuestEmail(String email);

    Optional<BookedRoom> findByBookingConfirmationCode(String confirmationCode);
}
