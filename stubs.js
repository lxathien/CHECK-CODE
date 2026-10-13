/* ==========================================================================
   stubs.js  |  BẢN GIẢ (stub) của các module chưa làm xong
   Người phụ trách: Hiền.

   LÀ GÌ?
   - Mỗi module thật (Products, Cart, Auth...) do một bạn khác viết, chưa xong ngay.
   - File này tạo sẵn các module GIẢ có ĐÚNG TÊN HÀM và ĐÚNG KIỂU KẾT QUẢ
     như trong "Hướng dẫn kỹ thuật" (mục 6), nhưng chỉ trả dữ liệu mẫu cố định.
   - Nhờ vậy ai cũng làm trang của mình ngay được, không phải chờ người khác.

   QUY TẮC VÀNG
   - Chỉ gán khi module thật CHƯA có:  window.Cart = window.Cart || {...}
     Module thật nạp xong thì bản giả tự bị bỏ qua.
   - Luôn nạp file này SAU các module thật (xem mục 7 Hướng dẫn kỹ thuật).
   - Hàm nào là async thì bản giả cũng phải async (để ai gọi bằng await vẫn chạy).
   - Muốn đổi tên hàm hay kết quả trả về: báo Hiền hoặc mở GitHub Issue trước.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. DỮ LIỆU MẪU CỐ ĐỊNH (đúng cấu trúc ở mục 4 Hướng dẫn kỹ thuật)
     ------------------------------------------------------------------------ */

  var SAMPLE_CATEGORIES = [
    { id: "but-viet", name: "Bút viết", slug: "but-viet", icon: "assets/icons/pen.svg" },
    { id: "so-vo", name: "Sổ và vở", slug: "so-vo", icon: "assets/icons/notebook.svg" },
    { id: "dung-cu", name: "Dụng cụ văn phòng", slug: "dung-cu", icon: "assets/icons/tools.svg" }
  ];

  var SAMPLE_PRODUCTS = [
    {
      id: "SP001",
      slug: "but-bi-thien-long-tl027",
      name: "Bút bi Thiên Long TL-027",
      category: "but-viet",
      brand: "Thiên Long",
      price: 5000,
      salePrice: 4000,            // có giảm giá
      stock: 120,
      images: ["assets/images/products/SP001-1.jpg"],
      colors: ["xanh", "đen", "đỏ"],
      rating: 4.5,
      reviews: 32,
      tags: ["bút", "học sinh"],
      description: "Mực ra đều, viết êm.",
      specs: { "Ngòi": "0.7mm" }
    },
    {
      id: "SP002",
      slug: "vo-hong-ha-96-trang",
      name: "Vở Hồng Hà 96 trang",
      category: "so-vo",
      brand: "Hồng Hà",
      price: 25000,
      salePrice: null,            // không giảm giá
      stock: 80,
      images: ["assets/images/products/SP002-1.jpg"],
      colors: [],                 // không có lựa chọn màu
      rating: 4.7,
      reviews: 58,
      tags: ["vở", "học sinh"],
      description: "Giấy trắng, chống lem.",
      specs: { "Số trang": "96" }
    },
    {
      id: "SP003",
      slug: "but-chi-go-2b",
      name: "Bút chì gỗ 2B",
      category: "but-viet",
      brand: "Điểm 10",
      price: 4000,
      salePrice: 3500,
      stock: 0,                   // HẾT HÀNG: để thử giao diện "hết hàng"
      images: ["assets/images/products/SP003-1.jpg"],
      colors: [],
      rating: 4.2,
      reviews: 15,
      tags: ["bút chì", "vẽ"],
      description: "Ruột mềm, dễ tẩy.",
      specs: { "Độ cứng": "2B" }
    },
    {
      id: "SP004",
      slug: "kep-buom-32mm",
      name: "Kẹp bướm 32mm (hộp 12 cái)",
      category: "dung-cu",
      brand: "Deli",
      price: 18000,
      salePrice: null,
      stock: 45,
      images: ["assets/images/products/SP004-1.jpg"],
      colors: ["đen"],
      rating: 4.0,
      reviews: 9,
      tags: ["kẹp", "văn phòng"],
      description: "Kẹp chắc, không gỉ.",
      specs: { "Kích thước": "32mm" }
    }
  ];

  var SAMPLE_USER = { id: "U001", name: "Người dùng mẫu", email: "mau@example.com" };

  // Giỏ hàng mẫu: SP001 x2 (xanh) + SP002 x1  =>  2 x 4.000 + 25.000 = 33.000đ
  var SAMPLE_CART = [
    { id: "SP001", qty: 2, color: "xanh" },
    { id: "SP002", qty: 1, color: "" }
  ];

  var SAMPLE_ORDER = {
    id: "DH-20261007-001",
    userId: "U001",
    items: [
      { id: "SP001", name: "Bút bi Thiên Long TL-027", price: 4000, qty: 2, color: "xanh" },
      { id: "SP002", name: "Vở Hồng Hà 96 trang", price: 25000, qty: 1, color: "" }
    ],
    subtotal: 33000,
    shippingFee: 20000,
    discount: 0,
    couponCode: null,
    total: 53000,                 // = subtotal + shippingFee - discount
    address: {
      fullName: "Người dùng mẫu",
      phone: "0901234567",
      email: "mau@example.com",
      province: "TP. Hồ Chí Minh",
      detail: "1 Đường Mẫu, Quận 1"
    },
    payment: "cod",
    status: "pending",
    createdAt: "2026-10-07T09:30:00"
  };

  /* ------------------------------------------------------------------------
     2. HÀM HỖ TRỢ NHỎ (chỉ dùng trong file này)
     ------------------------------------------------------------------------ */

  // Trả về BẢN SAO để ai lỡ sửa dữ liệu cũng không làm hỏng dữ liệu mẫu gốc.
  function clone(x) {
    return JSON.parse(JSON.stringify(x));
  }

  // Phát sự kiện, giống module thật sẽ làm (ví dụ "cart:changed").
  function emit(eventName) {
    document.dispatchEvent(new CustomEvent(eventName));
  }

  /* ------------------------------------------------------------------------
     3. SẢN PHẨM: Products  (toàn bộ là async)
     ------------------------------------------------------------------------ */
  window.Products = window.Products || {
    load: async function () {
      return clone(SAMPLE_PRODUCTS);
    },
    getById: async function (id) {
      var p = SAMPLE_PRODUCTS.find(function (x) { return x.id === id; });
      return p ? clone(p) : null;
    },
    getBySlug: async function (slug) {
      var p = SAMPLE_PRODUCTS.find(function (x) { return x.slug === slug; });
      return p ? clone(p) : null;
    },
    getByCategory: async function (categoryId) {
      return clone(SAMPLE_PRODUCTS.filter(function (x) { return x.category === categoryId; }));
    },
    search: async function (q) {
      var key = String(q || "").toLowerCase();
      return clone(SAMPLE_PRODUCTS.filter(function (x) {
        return x.name.toLowerCase().indexOf(key) !== -1 ||
               x.brand.toLowerCase().indexOf(key) !== -1 ||
               x.tags.join(" ").toLowerCase().indexOf(key) !== -1;
      }));
    },
    related: async function (id, limit) {
      var max = limit || 4;
      var cur = SAMPLE_PRODUCTS.find(function (x) { return x.id === id; });
      if (!cur) return [];
      return clone(SAMPLE_PRODUCTS.filter(function (x) {
        return x.category === cur.category && x.id !== id;
      }).slice(0, max));
    },
    getCategories: async function () {
      return clone(SAMPLE_CATEGORIES);
    }
  };

  /* ------------------------------------------------------------------------
     4. GIỎ HÀNG: Cart
        (add, update, subtotal là async; còn lại là sync)
     ------------------------------------------------------------------------ */
  window.Cart = window.Cart || {
    add: async function (id, qty, color) {
      emit("cart:changed");
      return { ok: true, message: "(bản giả) Đã thêm vào giỏ hàng" };
    },
    remove: function (id, color) {
      emit("cart:changed");
    },
    update: async function (id, color, qty) {
      emit("cart:changed");
      return { ok: true, message: "(bản giả) Đã cập nhật số lượng" };
    },
    get: function () {
      return clone(SAMPLE_CART);
    },
    count: function () {
      return 3;                   // 2 + 1
    },
    subtotal: async function () {
      return 33000;
    },
    clear: function () {
      emit("cart:changed");
    }
  };

  /* ------------------------------------------------------------------------
     5. MÃ GIẢM GIÁ: Coupons  (async)
        Thử được: WELCOME10 (giảm 10%), VPP50 (giảm 50.000đ), FREESHIP
     ------------------------------------------------------------------------ */
  window.Coupons = window.Coupons || {
    apply: async function (code, subtotal) {
      var c = String(code || "").trim().toUpperCase();
      if (c === "WELCOME10") {
        return { valid: true, discount: Math.round(subtotal * 0.1), freeShip: false, message: "Giảm 10%" };
      }
      if (c === "VPP50") {
        return { valid: true, discount: 50000, freeShip: false, message: "Giảm 50.000đ" };
      }
      if (c === "FREESHIP") {
        return { valid: true, discount: 0, freeShip: true, message: "Miễn phí vận chuyển" };
      }
      return { valid: false, discount: 0, freeShip: false, message: "Mã giảm giá không hợp lệ" };
    }
  };

  /* ------------------------------------------------------------------------
     6. ĐƠN HÀNG: Orders  (toàn bộ là sync)
     ------------------------------------------------------------------------ */
  window.Orders = window.Orders || {
    create: function (order) {
      var saved = clone(order || {});
      saved.id = "DH-20261007-001";
      saved.createdAt = "2026-10-07T09:30:00";
      saved.status = "pending";
      return saved;
    },
    listByUser: function (userId) {
      return [clone(SAMPLE_ORDER)];
    },
    getById: function (id) {
      return id === SAMPLE_ORDER.id ? clone(SAMPLE_ORDER) : null;
    },
    updateStatus: function (id, status) {
      if (id !== SAMPLE_ORDER.id) return null;
      var o = clone(SAMPLE_ORDER);
      o.status = status;
      return o;
    }
  };

  /* ------------------------------------------------------------------------
     7. TÀI KHOẢN: Auth  (register, login là async; còn lại là sync)
        Bản giả luôn coi như ĐÃ đăng nhập. Muốn thử trạng thái chưa đăng nhập,
        đổi dòng "current" bên dưới thành:  return null;
     ------------------------------------------------------------------------ */
  window.Auth = window.Auth || {
    register: async function (info) {
      emit("auth:changed");
      return { ok: true, message: "(bản giả) Đăng ký thành công", user: clone(SAMPLE_USER) };
    },
    login: async function (email, password, remember) {
      emit("auth:changed");
      return { ok: true, message: "(bản giả) Đăng nhập thành công", user: clone(SAMPLE_USER) };
    },
    logout: function () {
      emit("auth:changed");
    },
    current: function () {
      return clone(SAMPLE_USER);
    }
  };

  /* ------------------------------------------------------------------------
     8. YÊU THÍCH: Wishlist  (toàn bộ là sync)
     ------------------------------------------------------------------------ */
  window.Wishlist = window.Wishlist || {
    toggle: function (id) {
      emit("wishlist:changed");
      return true;                // true = vừa thêm
    },
    has: function (id) {
      return id === "SP001" || id === "SP002";
    },
    list: function () {
      return ["SP001", "SP002"];
    },
    count: function () {
      return 2;
    }
  };
})();
