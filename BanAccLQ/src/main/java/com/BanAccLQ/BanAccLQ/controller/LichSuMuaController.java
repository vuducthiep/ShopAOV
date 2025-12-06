package com.BanAccLQ.BanAccLQ.controller;

import com.BanAccLQ.BanAccLQ.DTO.AccGameResponseDTO;
import com.BanAccLQ.BanAccLQ.DTO.AdminLichSuMuaDTO;
import com.BanAccLQ.BanAccLQ.DTO.PaymentRequestDTO;
import com.BanAccLQ.BanAccLQ.model.AccGame;
import com.BanAccLQ.BanAccLQ.model.LichSuMua;
import com.BanAccLQ.BanAccLQ.service.LichSuMuaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LichSuMuaController {

    @Autowired
    private LichSuMuaService lichSuMuaService;

    @PostMapping("/buy")
    public ResponseEntity<AccGameResponseDTO> buyAccGame(@RequestBody PaymentRequestDTO paymentRequest) {
        try {
            AccGame accGame = lichSuMuaService.processPayment(paymentRequest.getUserId(),
                    paymentRequest.getAccGameId());

            // Chuyển đổi sang DTO
            AccGameResponseDTO responseDTO = new AccGameResponseDTO();
            responseDTO.setId(accGame.getId());
            responseDTO.setTaiKhoan(accGame.getTaiKhoanAcc());
            responseDTO.setMatKhau(accGame.getMatKhauAcc());

            // Chuyển giá từ Double sang BigDecimal
            responseDTO.setGia(BigDecimal.valueOf(accGame.getGia()));

            responseDTO.setTrangThai(accGame.getTrangThai().name());

            // Trả về ResponseEntity với mã trạng thái HTTP 200 (OK)
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            // Trả về lỗi với thông báo chi tiết và mã trạng thái HTTP 400 (Bad Request)
            AccGameResponseDTO errorResponse = new AccGameResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @GetMapping("/getAllAdminLichSuMua")
    public List<AdminLichSuMuaDTO> getAllAdminLichSuMua() {
        return lichSuMuaService.getAllAdminLichSuMua();
    }

}
