package com.BanAccLQ.BanAccLQ.service;

import com.BanAccLQ.BanAccLQ.DTO.AdminLichSuMuaDTO;
import com.BanAccLQ.BanAccLQ.model.AccGame;
import com.BanAccLQ.BanAccLQ.model.LichSuMua;
import com.BanAccLQ.BanAccLQ.model.NguoiDung;
import com.BanAccLQ.BanAccLQ.repository.AccGameRepository;
import com.BanAccLQ.BanAccLQ.repository.LichSuMuaRepository;
import com.BanAccLQ.BanAccLQ.repository.AdminLichSuMuaRepository;
import com.BanAccLQ.BanAccLQ.repository.NguoiDungRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LichSuMuaService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private AccGameRepository accGameRepository;

    @Autowired
    private LichSuMuaRepository lichSuMuaRepository;

    @Autowired
    private AdminLichSuMuaRepository adminLichSuMuaRepository;

    public AccGame processPayment(Integer userId, Integer accGameId) {
        // Tìm người dùng theo ID
        NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm tài khoản game theo ID
        AccGame accGame = accGameRepository.findById(accGameId)
                .orElseThrow(() -> new RuntimeException("Không tìm được acc"));

        // Kiểm tra trạng thái tài khoản game
        if (accGame.getTrangThai() == AccGame.TrangThai.daBan) {
            throw new RuntimeException("Acc đã được bán");
        }

        // Kiểm tra số tiền của người dùng có đủ không
        if (user.getSoTien().compareTo(BigDecimal.valueOf(accGame.getGia())) < 0) {
            throw new RuntimeException("Thiếu tiền");
        }

        // Trừ tiền của người dùng
        user.setSoTien(user.getSoTien().subtract(BigDecimal.valueOf(accGame.getGia())));
        user.setSoTienDaSuDung(user.getSoTienDaSuDung().add(BigDecimal.valueOf(accGame.getGia())));

        // Lưu thông tin người dùng đã cập nhật
        nguoiDungRepository.save(user);

        // Tạo bản ghi lịch sử mua
        LichSuMua lichSuMua = new LichSuMua();
        lichSuMua.setNguoiDung(user);
        lichSuMua.setAccGame(accGame);
        lichSuMua.setCreateAt(LocalDateTime.now());
        lichSuMuaRepository.save(lichSuMua);

        // Cập nhật trạng thái tài khoản game thành đã bán
        accGame.setTrangThai(AccGame.TrangThai.daBan);
        accGameRepository.save(accGame);

        // Trả về tài khoản game vừa mua
        return accGame;
    }

    // Hàm lấy danh sách các AccGame đã được mua
    public List<AdminLichSuMuaDTO> getAllAdminLichSuMua() {
        return adminLichSuMuaRepository.findAll()
                .stream()
                .map(lsm -> new AdminLichSuMuaDTO(
                        lsm.getId(),
                        lsm.getAccGame() != null ? lsm.getAccGame().getId() : null,
                        lsm.getNguoiDung() != null ? lsm.getNguoiDung().getId() : null,
                        lsm.getNguoiDung() != null ? lsm.getNguoiDung().getTen() : null,
                        lsm.getCreateAt()))
                .collect(Collectors.toList());
    }

}