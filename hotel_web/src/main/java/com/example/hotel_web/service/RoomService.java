package com.example.hotel_web.service;

import com.example.hotel_web.dto.request.RoomSearchRequest;
import com.example.hotel_web.dto.request.RoomRequest;
import com.example.hotel_web.entity.Room;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface RoomService {

    Room addNewRoom(RoomRequest request) throws SQLException, IOException;

    List<String> getAllRoomTypes();

    List<Room> getAllRooms();

    byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException;

    void deleteRoom(Long roomId);

    Room updateRoom(Long roomId, RoomRequest request) throws IOException, SQLException;

    Optional<Room> getRoomById(Long roomId);

    List<Room> getAvailableRooms(RoomSearchRequest request);
}
