import React, { useEffect, useState } from "react";

const QuanLyGiaoDich = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("http://localhost:8080/api/getAllAdminLichSuMua");
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = await res.json();
                setTransactions(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN");
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-red-600">Quản Lý Giao Dịch</h1>

            {loading && <p className="text-center text-lg">Đang tải...</p>}
            {error && (
                <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-3 font-semibold">
                    Lỗi: {error}
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-lg">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-800 text-white sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left">ID Giao Dịch</th>
                                <th className="px-6 py-3 text-left">ID Tài Khoản Game</th>
                                <th className="px-6 py-3 text-left">ID Người Dùng</th>
                                <th className="px-6 py-3 text-left">Tên Người Dùng</th>
                                <th className="px-6 py-3 text-left">Ngày Tạo</th>
                                <th className="px-6 py-3 text-center">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={transaction.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white border-t"}>
                                    <td className="px-6 py-3 font-semibold text-blue-600">#{transaction.id}</td>
                                    <td className="px-6 py-3">{transaction.accGameId}</td>
                                    <td className="px-6 py-3">{transaction.nguoiDungId}</td>
                                    <td className="px-6 py-3 font-medium">{transaction.tenNguoiDung}</td>
                                    <td className="px-6 py-3 text-gray-600">
                                        {formatDate(transaction.createAt)}
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors mr-2">
                                            Chi Tiết
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-center text-gray-500" colSpan={6}>
                                        Không có giao dịch nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default QuanLyGiaoDich;
