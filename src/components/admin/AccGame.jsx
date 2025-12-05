import React, { useEffect, useState } from "react";

// Admin view: fetch all acc games and display in a simple table
const AccGame = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("http://localhost:8080/api/accgame/getAllAcc");
                if (!res.ok) {
                    throw new Error(`Request failed: ${res.status}`);
                }
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách Acc Game</h1>

            {loading && <p>Đang tải...</p>}
            {error && (
                <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Tên</th>
                                <th className="px-4 py-2">Rank</th>
                                <th className="px-4 py-2">Tướng</th>
                                <th className="px-4 py-2">Trang phục</th>
                                <th className="px-4 py-2">Giá</th>
                                <th className="px-4 py-2">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((acc) => (
                                <tr key={acc.id} className="border-t">
                                    <td className="px-4 py-2">#{acc.id}</td>
                                    <td className="px-4 py-2">{acc.tenAcc}</td>
                                    <td className="px-4 py-2">{acc.rankAcc}</td>
                                    <td className="px-4 py-2">{acc.soLuongTuong}</td>
                                    <td className="px-4 py-2">{acc.soLuongTrangPhuc}</td>
                                    <td className="px-4 py-2 text-red-600 font-semibold">
                                        {acc.gia?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </td>
                                    <td className="px-4 py-2 capitalize">{acc.trangThai}</td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td className="px-4 py-3 text-center" colSpan={7}>
                                        Không có dữ liệu.
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

export default AccGame; 