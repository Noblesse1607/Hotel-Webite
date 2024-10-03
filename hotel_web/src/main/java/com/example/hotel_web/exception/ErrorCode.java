package com.example.hotel_web.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    RESOURCE_NOT_FOUND(1001, "Sorry, Room not found!", HttpStatus.BAD_REQUEST),
    PHOTO_RETRIEVAL(1002, "Error retrieval photo", HttpStatus.BAD_REQUEST),
    INTERNAL_SERVER(1003, "Room not found", HttpStatus.INTERNAL_SERVER_ERROR),
    ERROR_UPDATE(1004, "Fail updating room", HttpStatus.INTERNAL_SERVER_ERROR),
    BOOKING_NOT_FOUND(1005, "No booking found with booking code :", HttpStatus.BAD_REQUEST),
    ERROR_CHECK1(1006,"Check-in date must come before check-out date", HttpStatus.BAD_REQUEST),
    ERROR_CHECK2(1007, "Sorry, This room is not available for the selected dates;", HttpStatus.BAD_REQUEST);

    private int code;
    private String message;
    private HttpStatus statusCode;

    ErrorCode(int code, String message,HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
