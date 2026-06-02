package com.example.THLTW.service;

import com.example.THLTW.entity.Room;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

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

    private void validateRoomCapacity(Integer rows, Integer cols) {
        if (rows == null || rows < 1 || rows > 15) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Số hàng ghế phải từ 1 đến 15!");
        }
        if (cols == null || cols < 1 || cols > 20) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Số cột ghế phải từ 1 đến 20!");
        }
    }

    public Room addRoom(Room room) {
        validateRoomCapacity(room.getRowsCount(), room.getColsCount());
        if (room.getCinema() != null && room.getCinema().getId() != null) {
            if (roomRepository.existsByNameAndCinemaId(room.getName(), room.getCinema().getId())) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Tên phòng này đã tồn tại trong rạp chiếu được chọn!");
            }
        }
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room details) {
        validateRoomCapacity(details.getRowsCount(), details.getColsCount());
        if (details.getCinema() != null && details.getCinema().getId() != null) {
            if (roomRepository.existsByNameAndCinemaIdAndIdNot(details.getName(), details.getCinema().getId(), id)) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Tên phòng này đã tồn tại trong rạp chiếu được chọn!");
            }
        }
        Room room = getRoomById(id);
        room.setName(details.getName());
        room.setRowsCount(details.getRowsCount());
        room.setColsCount(details.getColsCount());
        room.setCinema(details.getCinema());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
