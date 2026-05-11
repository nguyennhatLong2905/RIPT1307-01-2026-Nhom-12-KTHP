package com.example.THLTW.service;

import com.example.THLTW.entity.Room;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

// Service quản lý Phòng chiếu phim
@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng chiếu!"));
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room details) {
        Room room = getRoomById(id);
        room.setName(details.getName());
        room.setRowsCount(details.getRowsCount());
        room.setColsCount(details.getColsCount());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
