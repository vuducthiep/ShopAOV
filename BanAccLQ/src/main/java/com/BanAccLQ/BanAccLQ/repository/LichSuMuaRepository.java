package com.BanAccLQ.BanAccLQ.repository;

import com.BanAccLQ.BanAccLQ.model.AccGame;
import org.springframework.data.jpa.repository.JpaRepository;
import com.BanAccLQ.BanAccLQ.model.LichSuMua;

import java.util.List;

public interface LichSuMuaRepository extends JpaRepository<LichSuMua, Integer> {
    // Lấy tất cả các AccGame mà người dùng đã mua
    List<LichSuMua> findByNguoiDungId(Integer nguoiDungId);
}
