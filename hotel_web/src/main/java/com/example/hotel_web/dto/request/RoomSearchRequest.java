package com.example.hotel_web.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomSearchRequest {
    LocalDate checkInDate;
    LocalDate checkOutDate;
    String roomType;
}
