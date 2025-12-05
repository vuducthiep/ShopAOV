import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LichSuMua = () => {
    const idNguoiDung = localStorage.getItem('userId');
    const [lichSuMua, setLichSuMua] = useState([]);
    const [expanded, setExpanded] = useState(null);  // Trạng thái cho ảnh chi tiết
    const [notification, setNotification] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Kiểm tra token
        const token = localStorage.getItem("token");
        if (!token) {
            setNotification("Vui lòng đăng nhập để xem lịch sử mua!");
            setIsLoggedIn(false);
            setTimeout(() => {
                navigate("/");
            }, 2000);
            return;
        }

        fetch(`http://localhost:8080/api/nguoidung/${idNguoiDung}/accgames`)
            .then((response) => response.json())
            .then((data) => setLichSuMua(data))
            .catch((error) => console.error("Error fetching purchase history:", error));
    }, [idNguoiDung, navigate]);

    const toggleImageDetails = (accId) => {
        if (expanded === accId) {
            setExpanded(null);  // Đóng ảnh chi tiết nếu đang mở
        } else {
            setExpanded(accId);  // Mở ảnh chi tiết của tài khoản game
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto p-4">
                {notification && (
                    <div
                        className="fixed top-0 right-0 p-4 bg-red-500 text-white rounded-lg shadow-lg"
                        style={{
                            zIndex: 9999,
                        }}
                    >
                        {notification}
                    </div>
                )}
                <p className="text-center mt-6 text-red-600 text-lg font-bold">Vui lòng đăng nhập để xem lịch sử mua!</p>
            </div>
        );
    }

    if (lichSuMua.length === 0) {
        return <p className="text-center mt-6">Không có lịch sử mua hàng.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            {notification && (
                <div
                    className="fixed top-0 right-0 p-4 bg-red-500 text-white rounded-lg shadow-lg"
                    style={{
                        zIndex: 9999,
                    }}
                >
                    {notification}
                </div>
            )}
            <h2 className="text-3xl text-center text-red-600 font-bold mb-6">
                Lịch sử mua tài khoản
            </h2>

            {lichSuMua.map((acc) => (
                <div key={acc.id} className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all duration-300">
                    <h3 className="text-xl font-semibold">{acc.tenAcc}</h3>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <img
                            src={acc.hinhAnhDaiDien}
                            alt={acc.tenAcc}
                            className="w-full md:w-1/3 object-cover rounded-lg hover:scale-110 transition-all duration-300"
                        />
                        <div className="flex-1">
                            <div><strong>Mô tả:</strong> {acc.moTa}</div>
                            <div><strong>Giá:</strong> {acc.gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</div>
                            <div><strong>Rank:</strong> {acc.rankAcc}</div>
                            <div><strong>Level:</strong> {acc.level}</div>
                            <div><strong>Loại tài khoản:</strong> {acc.loaiAccGame.tenLoai}</div>
                            <div><strong>Tài khoản:</strong> {acc.taiKhoanAcc}</div>
                            <div><strong>Mật khẩu:</strong> {acc.matKhauAcc}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors hover:shadow-lg w-full md:w-auto"
                            onClick={() => toggleImageDetails(acc.id)}
                        >
                            Xem chi tiết ảnh
                        </button>
                        {expanded === acc.id && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {acc.anhAccList.map((anh) => (
                                    <div key={anh.id} className="flex justify-center hover:scale-105 transition-all duration-300">
                                        <img
                                            src={anh.urlAnh}
                                            alt={anh.moTa || "Ảnh chi tiết"}
                                            className="w-full h-auto rounded-lg shadow-lg"
                                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LichSuMua;
