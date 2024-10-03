package com.example.hotel_web.service;

import com.example.hotel_web.dto.request.RoomSearchRequest;
import com.example.hotel_web.dto.request.RoomRequest;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.repository.RoomRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomServiceImpl implements RoomService{
    RoomRepository roomRepository;


    @Override
    public Room addNewRoom(RoomRequest request) throws SQLException, IOException {
        Room room = new Room();
        room.setRoomType(request.getRoomType());
        room.setRoomPrice(request.getRoomPrice());
//        room.setPhoto(request.getPhoto().getBytes());
        if(!request.getPhoto().isEmpty()) {
            byte[] photoBytes = request.getPhoto().getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            room.setPhoto(photoBlob);
        }
        return roomRepository.save(room);
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException {
        Optional<Room> theRoom = roomRepository.findById(roomId);
        if (theRoom.isEmpty()) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND);
        }

        Blob photoBlob = theRoom.get().getPhoto();
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        return null;
    }

    @Override
    public void deleteRoom(Long roomId) {
        roomRepository.deleteById(roomId);
    }

    @Override
    public List<Room> getAvailableRooms(RoomSearchRequest request) {
        return roomRepository.findAvailableRoomsByDatesAndType(request);
    }

    @Override
    public Room updateRoom(Long roomId, RoomRequest request) throws IOException, SQLException {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        room.setRoomType(request.getRoomType());
        room.setRoomPrice(request.getRoomPrice());
            byte[] photoBytes = request.getPhoto().getBytes();

        if (photoBytes.length > 0) {
            try {
                room.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException ex) {
                throw new AppException(ErrorCode.ERROR_UPDATE);
            }
        }
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> getRoomById(Long roomId) {
        return Optional.of(roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND)));
    }

}
