import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccYeuThich = () => {
    const [accGames, setAccGames] = useState([]);
    const [notification, setNotification] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);  // Trạng thái xác nhận
    const [accToDelete, setAccToDelete] = useState(null);  // Tài khoản cần xóa
    const navigate = useNavigate(); // Khai báo useNavigate

    useEffect(() => {
        window.scrollTo(0, 0);

        // Kiểm tra token
        const token = localStorage.getItem("token");
        if (!token) {
            setNotification("Vui lòng đăng nhập để xem danh sách yêu thích!");
            setTimeout(() => {
                navigate("/");
            }, 2000);
            return;
        }

        // Lấy id người dùng từ localStorage
        const idNguoiDung = localStorage.getItem("userId");

        // Thay URL bằng endpoint API thực tế của bạn để lấy danh sách tài khoản yêu thích của người dùng
        fetch(`http://localhost:8080/api/nguoidung/favorites/${idNguoiDung}`)
            .then((response) => response.json())
            .then((data) => setAccGames(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleAccClick = (id) => {
        navigate(`/acc/${id}`);
    };

    const handleUnfavoriteClick = (accId, e) => {
        e.stopPropagation(); // Ngừng sự kiện để không gây sự cố với sự kiện click bên ngoài
        if (isConfirming) return; // Nếu đang trong quá trình xác nhận thì không xử lý nữa
        setIsConfirming(true); // Hiển thị hộp thoại xác nhận
        setAccToDelete(accId);
    };

    const cancelUnfavorite = (e) => {
        e.stopPropagation();  // Ngừng sự kiện click để không làm gì ngoài việc đóng hộp thoại
        setIsConfirming(false);  // Đóng hộp thoại xác nhận
        setAccToDelete(null);
    };

    const confirmUnfavorite = () => {
        // Gọi API để xóa tài khoản khỏi danh sách yêu thích
        fetch(`http://localhost:8080/api/yeuthich`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idNguoiDung: localStorage.getItem("userId"),  // Lấy id người dùng từ localStorage
                idAccGame: accToDelete,  // Lấy id tài khoản game từ state
            }),
        })
            .then((response) => response.text())
            .then((data) => {
                if (data.includes("Tài khoản game đã được xóa khỏi danh sách yêu thích")) {
                    setNotification("Tài khoản đã được xóa khỏi danh sách yêu thích!");
                    setTimeout(() => setNotification(""), 3000);
                    // Cập nhật lại danh sách sau khi xóa
                    setAccGames(accGames.filter((acc) => acc.id !== accToDelete));
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setNotification("Đã có lỗi xảy ra, vui lòng thử lại!");
                setTimeout(() => setNotification(""), 3000);
            });

        setIsConfirming(false);
        setAccToDelete(null);
    };

    // Hành động khi nhấn "Mua ngay"
    const handleBuyNow = (accId, e) => {
        e.stopPropagation();
        navigate(`/thanhtoan/${accId}`);  // Điều hướng đến trang thanh toán với id tài khoản game
    };

    return (
        <div>
            {notification && (
                <div
                    className="fixed top-0 right-0 p-4 bg-green-500 text-white rounded-lg shadow-lg"
                    style={{
                        zIndex: 9999,
                    }}
                >
                    {notification}
                </div>
            )}
            {isConfirming && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-10"
                    onClick={cancelUnfavorite}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h3 className="text-xl font-bold mb-4 text-center">Xác nhận xóa</h3>
                        <p className="text-center mb-6">Bạn có chắc chắn muốn bỏ tài khoản này khỏi danh sách yêu thích?</p>
                        <div className="flex justify-around mt-4 space-x-4">
                            <button
                                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 w-full md:w-auto"
                                onClick={confirmUnfavorite}
                            >
                                Xóa
                            </button>
                            <button
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 w-full md:w-auto"
                                onClick={cancelUnfavorite}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-2xl text-red-600 text-center font-bold mb-4">
                DANH SÁCH TÀI KHOẢN YÊU THÍCH
            </h2>
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-1 md:grid-cols-4">
                {accGames.map((acc) => (
                    <div
                        key={acc.id}
                        className="border bg-slate-300 p-4 rounded shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
                        onClick={() => handleAccClick(acc.id)}
                    >
                        <div className="text-center font-bold text-red-500">
                            #{acc.id}
                        </div>
                        <img
                            src={acc.hinhAnhDaiDien}
                            alt={acc.tenAcc}
                            className="w-full h-auto mb-4 rounded hover:opacity-90 transition-opacity"
                        />
                        <h3 className="text-lg font-bold text-center mb-2">{acc.tenAcc}</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p><strong>Rank:</strong> {acc.rankAcc}</p>
                            <p><strong>Tướng:</strong> {acc.soLuongTuong}</p>
                            <p><strong>Trang phục:</strong> {acc.soLuongTrangPhuc}</p>
                            <p className="text-red-400"><strong>Giá:</strong> {acc.gia.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
                                onClick={(e) => handleBuyNow(acc.id, e)}  // Gọi handleBuyNow để điều hướng
                            >
                                <span className="material-icons mr-2">shopping_cart</span>
                                Mua ngay
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded flex items-center hover:bg-red-600 transition-colors"
                                onClick={(e) => handleUnfavoriteClick(acc.id, e)} // Ngừng sự kiện khi cần
                            >
                                <span className="material-icons mr-2">remove_circle</span>
                                Bỏ yêu thích
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccYeuThich;
