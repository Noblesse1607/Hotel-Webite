package com.example.hotel_web.repository;

import com.example.hotel_web.dto.request.RoomSearchRequest;
import com.example.hotel_web.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT DISTINCT r.roomType FROM Room r")
    List<String> findDistinctRoomTypes();

    //viet query tim phong voi roomType da chon va id phong khong nam trong nhung id ma co thoi gian dat phong nam ngoai khoang thoi gian request
    @Query(" SELECT r FROM Room r " +
            " WHERE r.roomType LIKE %:#{#request.roomType}% " +
            " AND r.id NOT IN (" +
            "  SELECT br.room.id FROM BookedRoom br " +
            "  WHERE ((br.checkInDate <= :#{#request.checkOutDate}) AND (br.checkOutDate >= :#{#request.checkInDate}))" +
            ")")
    List<Room> findAvailableRoomsByDatesAndType(@Param("request") RoomSearchRequest request);
}
