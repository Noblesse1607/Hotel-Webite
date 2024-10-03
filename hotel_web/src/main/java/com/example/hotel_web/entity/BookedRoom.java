package com.example.hotel_web.entity;

import com.example.hotel_web.dto.response.BookingResponse;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.sql.SQLException;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookedRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long bookingId;

    @Column(name = "check_In")
    LocalDate checkInDate;

    @Column(name = "check_Out")
    LocalDate checkOutDate;

    @Column(name = "guest_FullName")
    String guestFullName;

    @Column(name = "guest_Email")
    String guestEmail;

    @Column(name = "adults")
    int NumOfAdults;

    @Column(name = "children")
    int NumOfChildren;

    @Column(name = "total_guest")
    int totalNumOfGuest;

    @Column(name = "confirmation_Code")
    String bookingConfirmationCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    Room room;

    @PrePersist
    @PreUpdate
    public void calculateTotalNumberOfGuest(){
        this.totalNumOfGuest = this.NumOfAdults + this.NumOfChildren;
    }



}
