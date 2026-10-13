
/*
==========================================================================
 orders.js
 Người phụ trách: Thiên
 Chức năng: Quản lý đơn hàng
 Lưu trữ: sv_orders
 Phụ thuộc: storage.js, auth.js (hoặc Auth trong stubs.js)
==========================================================================
*/

(function () {
    "use strict";

    var STORAGE_KEY = "sv_orders";

    // Tạo bản sao để tránh sửa trực tiếp dữ liệu đã lưu.
    function clone(data) {
        return JSON.parse(JSON.stringify(data));
    }

    // Đọc danh sách đơn hàng.
    function getOrders() {
        if (!window.Store) {
            console.error("Orders: Chưa nạp storage.js.");
            return [];
        }

        var orders = window.Store.get(STORAGE_KEY, []);

        if (!Array.isArray(orders)) {
            console.error("Orders: Dữ liệu sv_orders không hợp lệ.");
            return [];
        }

        return orders;
    }

    // Tạo mã đơn dạng DH-YYYYMMDD-001.
    function generateOrderId(orders) {
        var now = new Date();

        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, "0");
        var day = String(now.getDate()).padStart(2, "0");

        var dateCode = String(year) + month + day;
        var prefix = "DH-" + dateCode + "-";
        var maxNumber = 0;

        orders.forEach(function (order) {
            if (order.id && order.id.indexOf(prefix) === 0) {
                var number = Number(order.id.substring(prefix.length));

                if (Number.isInteger(number) && number > maxNumber) {
                    maxNumber = number;
                }
            }
        });

        var nextNumber = String(maxNumber + 1).padStart(3, "0");
        return prefix + nextNumber;
    }

    // 1. Tạo và lưu đơn hàng mới.
    function create(order) {
        if (!order || typeof order !== "object" || Array.isArray(order)) {
            console.error("Orders.create: Dữ liệu đơn hàng không hợp lệ.");
            return null;
        }

        var orders = getOrders();

        // Xác định người dùng hiện tại nếu đơn chưa có userId.
        var userId = order.userId;

        if (userId === undefined) {
            var user = window.Auth && typeof window.Auth.current === "function"
                ? window.Auth.current()
                : null;

            userId = user && user.id ? user.id : null;
        }

        var newOrder = clone(order);

        newOrder.id = generateOrderId(orders);
        newOrder.userId = userId;
        newOrder.createdAt = new Date().toISOString();
        newOrder.status = "pending";

        orders.push(newOrder);

        if (!window.Store || !window.Store.set(STORAGE_KEY, orders)) {
            console.error("Orders.create: Không thể lưu đơn hàng.");
            return null;
        }

        document.dispatchEvent(new CustomEvent("orders:changed"));

        return clone(newOrder);
    }

    // 2. Lấy đơn hàng của một người dùng, mới nhất trước.
    function listByUser(userId) {
        if (userId === undefined || userId === null) {
            return [];
        }

        var orders = getOrders();

        return clone(
            orders
                .filter(function (order) {
                    return order.userId === userId;
                })
                .sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                })
        );
    }

    // 3. Tìm đơn hàng theo mã.
    function getById(id) {
        if (!id) {
            return null;
        }

        var order = getOrders().find(function (item) {
            return item.id === id;
        });

        return order ? clone(order) : null;
    }

    // 4. Cập nhật trạng thái đơn hàng.
    function updateStatus(id, status) {
        if (!id || typeof status !== "string" || !status.trim()) {
            return null;
        }

        var orders = getOrders();

        var index = orders.findIndex(function (order) {
            return order.id === id;
        });

        if (index === -1) {
            return null;
        }

        orders[index].status = status.trim();

        if (!window.Store || !window.Store.set(STORAGE_KEY, orders)) {
            console.error("Orders.updateStatus: Không thể lưu trạng thái.");
            return null;
        }

        document.dispatchEvent(new CustomEvent("orders:changed"));

        return clone(orders[index]);
    }

    // Công khai API để các file khác sử dụng.
    window.Orders = {
        create: create,
        listByUser: listByUser,
        getById: getById,
        updateStatus: updateStatus
    };
})();
