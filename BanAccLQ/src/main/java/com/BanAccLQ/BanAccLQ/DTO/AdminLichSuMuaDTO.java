// LichSuMuaDTO.java
package com.BanAccLQ.BanAccLQ.DTO;

import java.time.LocalDateTime;

public class AdminLichSuMuaDTO {
    private Integer id;
    private Integer accGameId;
    private Integer nguoiDungId;
    private String tenNguoiDung; // thêm tên người mua
    private LocalDateTime createAt;

    public AdminLichSuMuaDTO(Integer id, Integer accGameId, Integer nguoiDungId, String tenNguoiDung,
            LocalDateTime createAt) {
        this.id = id;
        this.accGameId = accGameId;
        this.nguoiDungId = nguoiDungId;
        this.tenNguoiDung = tenNguoiDung;
        this.createAt = createAt;
    }

    public Integer getId() {
        return id;
    }

    public Integer getAccGameId() {
        return accGameId;
    }

    public Integer getNguoiDungId() {
        return nguoiDungId;
    }

    public String getTenNguoiDung() {
        return tenNguoiDung;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

}
