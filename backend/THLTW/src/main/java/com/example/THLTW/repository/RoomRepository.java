package com.example.THLTW.repository;

import com.example.THLTW.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Quản lý dữ liệu phòng chiếu
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    boolean existsByNameAndCinemaId(String name, Long cinemaId);
    boolean existsByNameAndCinemaIdAndIdNot(String name, Long cinemaId, Long id);
}
