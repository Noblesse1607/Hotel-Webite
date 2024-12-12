package com.example.hotel_web.service;
import com.example.hotel_web.dto.request.RoomRequest;
import com.example.hotel_web.entity.Room;
import com.example.hotel_web.exception.AppException;
import com.example.hotel_web.exception.ErrorCode;
import com.example.hotel_web.repository.RoomRepository;
import com.example.hotel_web.service.RoomServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockMultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewRoom_success() throws SQLException, IOException {
        RoomRequest roomRequest = new RoomRequest();
        roomRequest.setRoomType("Single");
        roomRequest.setRoomPrice(BigDecimal.valueOf(100));
        roomRequest.setPhoto(new MockMultipartFile("photo", new byte[]{}));

        Room savedRoom = new Room();
        savedRoom.setRoomType("Single");
        savedRoom.setRoomPrice(BigDecimal.valueOf(100));

        when(roomRepository.save(any(Room.class))).thenReturn(savedRoom);

        Room room = roomService.addNewRoom(roomRequest);

        assertNotNull(room);
        assertEquals("Single", room.getRoomType());
        assertEquals(BigDecimal.valueOf(100), room.getRoomPrice());
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void testGetAllRoomTypes() {
        List<String> roomTypes = List.of("Single", "Double", "Suite");

        when(roomRepository.findDistinctRoomTypes()).thenReturn(roomTypes);

        List<String> result = roomService.getAllRoomTypes();

        assertEquals(3, result.size());
        assertTrue(result.contains("Single"));
        verify(roomRepository, times(1)).findDistinctRoomTypes();
    }

    @Test
    void testGetAllRooms() {
        List<Room> rooms = List.of(new Room(), new Room());

        when(roomRepository.findAll()).thenReturn(rooms);

        List<Room> result = roomService.getAllRooms();

        assertEquals(2, result.size());
        verify(roomRepository, times(1)).findAll();
    }

    @Test
    void testGetRoomPhotoByRoomId_roomExists() throws SQLException {
        Room room = new Room();
        room.setPhoto(new SerialBlob(new byte[]{1, 2, 3}));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));

        byte[] photo = roomService.getRoomPhotoByRoomId(1L);

        assertNotNull(photo);
        assertEquals(3, photo.length);
        verify(roomRepository, times(1)).findById(1L);
    }

    @Test
    void testGetRoomPhotoByRoomId_roomNotFound() {
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> roomService.getRoomPhotoByRoomId(1L));

        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void testDeleteRoom_success() {
        Long roomId = 1L;

        roomService.deleteRoom(roomId);

        verify(roomRepository, times(1)).deleteById(roomId);
    }

    @Test
    void testGetAvailableRooms() {
        List<Room> rooms = List.of(new Room(), new Room());

        when(roomRepository.findAvailableRoomsByDatesAndType(any(LocalDate.class), any(LocalDate.class), anyString())).thenReturn(rooms);

        List<Room> result = roomService.getAvailableRooms(LocalDate.now(), LocalDate.now().plusDays(1), "Single");

        assertEquals(2, result.size());
        verify(roomRepository, times(1)).findAvailableRoomsByDatesAndType(any(LocalDate.class), any(LocalDate.class), anyString());
    }

    @Test
    void testUpdateRoom_success() throws SQLException, IOException {
        Long roomId = 1L;
        RoomRequest roomRequest = new RoomRequest();
        roomRequest.setRoomType("Double");
        roomRequest.setRoomPrice(BigDecimal.valueOf(150));
        roomRequest.setPhoto(new MockMultipartFile("photo", new byte[]{}));

        Room existingRoom = new Room();
        existingRoom.setId(roomId);
        existingRoom.setRoomType("Single");
        existingRoom.setRoomPrice(BigDecimal.valueOf(100));

        Room updatedRoom = new Room();
        updatedRoom.setId(roomId);
        updatedRoom.setRoomType("Double");
        updatedRoom.setRoomPrice(BigDecimal.valueOf(150));

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(existingRoom));
        when(roomRepository.save(any(Room.class))).thenReturn(updatedRoom);

        Room room = roomService.updateRoom(roomId, roomRequest);

        assertNotNull(room);
        assertEquals("Double", room.getRoomType());
        assertEquals(BigDecimal.valueOf(150), room.getRoomPrice());
        verify(roomRepository, times(1)).findById(roomId);
        verify(roomRepository, times(1)).save(any(Room.class));
    }

    @Test
    void testUpdateRoom_roomNotFound() throws SQLException, IOException {
        Long roomId = 1L;
        RoomRequest roomRequest = new RoomRequest();
        roomRequest.setRoomType("Double");
        roomRequest.setRoomPrice(BigDecimal.valueOf(150));
        roomRequest.setPhoto(new MockMultipartFile("photo", new byte[]{}));

        when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> roomService.updateRoom(roomId, roomRequest));

        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, exception.getErrorCode());
    }

    @Test
    void testGetRoomById_success() {
        Long roomId = 1L;
        Room room = new Room();
        room.setId(roomId);

        when(roomRepository.findById(roomId)).thenReturn(Optional.of(room));

        Optional<Room> result = roomService.getRoomById(roomId);

        assertTrue(result.isPresent());
        assertEquals(roomId, result.get().getId());
        verify(roomRepository, times(1)).findById(roomId);
    }

    @Test
    void testGetRoomById_roomNotFound() {
        Long roomId = 1L;

        when(roomRepository.findById(roomId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> roomService.getRoomById(roomId));

        assertEquals(ErrorCode.RESOURCE_NOT_FOUND, exception.getErrorCode());
    }
}

