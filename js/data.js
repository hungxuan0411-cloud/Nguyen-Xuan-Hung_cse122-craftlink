/* ==========================================================================
   data.js — Dữ liệu sản phẩm mẫu dùng chung của CraftLink
   --------------------------------------------------------------------------
   Đây là "nguồn dữ liệu chung" cho các trang người mua:
   - Trang giỏ hàng và trang yêu thích đọc mảng này để hiển thị thẻ sản phẩm.
   - Trang chi tiết sản phẩm tra cứu thông tin khi thêm vào giỏ / yêu thích.
   - Trang danh sách sản phẩm (index.html) dùng mã id trùng với data-* trên
     từng thẻ sản phẩm để liên kết hai nơi với nhau.

   Lưu ý: dự án chưa có máy chủ (backend) nên đây là DỮ LIỆU MẪU.
   ========================================================================== */

const CRAFTLINK_PRODUCTS = [
  {
    id: "coc-gom-la-nau",
    name: "Cốc gốm lá nâu thủ công",
    artisan: "Linh Gốm",
    price: 240000, // đơn vị: đồng
    image: "assets/images/coc-gom-la-nau.png",
    category: "do-dung-nha-bep",
    styles: ["moc-mac", "toi-gian"],
    leadTime: "4-7",
    rating: 4.9,
    reviewCount: 128,
    note: ""
  },
  {
    id: "bat-gom-men-lam",
    name: "Bát gốm men lam",
    artisan: "Gốm An Nhiên",
    price: 180000,
    image: "assets/images/bat-gom-men-lam.png",
    category: "do-dung-nha-bep",
    styles: ["truyen-thong"],
    leadTime: "4-7",
    rating: 4.8,
    reviewCount: 98,
    note: ""
  },
  {
    id: "binh-gom-dang-tron",
    name: "Bình gốm dáng tròn",
    artisan: "Gốm Mộc",
    price: 260000,
    image: "assets/images/binh-gom-dang-tron.png",
    category: "do-trang-tri",
    styles: ["toi-gian", "hien-dai"],
    leadTime: "8-14",
    rating: 4.8,
    reviewCount: 74,
    note: ""
  },
  {
    id: "chuong-gio-gom",
    name: "Chuông gió gốm",
    artisan: "Gốm Mộc",
    price: 200000,
    image: "assets/images/chuong-gio-gom.png",
    category: "phu-kien",
    styles: ["moc-mac"],
    leadTime: "1-3",
    rating: 4.8,
    reviewCount: 100,
    note: ""
  },
  {
    id: "binh-gom-van-la",
    name: "Bình gốm vân lá",
    artisan: "Linh Gốm",
    price: 320000,
    image: "assets/images/binh-gom-van-la.png",
    category: "do-trang-tri",
    styles: ["moc-mac"],
    leadTime: "4-7",
    rating: 4.9,
    reviewCount: 46,
    note: "Giao dự kiến 3–5 ngày"
  },
  {
    id: "dia-men-lam",
    name: "Đĩa men lam thủ công",
    artisan: "Gốm An Nhiên",
    price: 210000,
    image: "assets/images/dia-men-lam.png",
    category: "do-gom",
    styles: ["truyen-thong", "toi-gian"],
    leadTime: "tren-14",
    rating: 4.8,
    reviewCount: 63,
    note: "Nhận đặt làm theo yêu cầu"
  },
  {
    id: "chau-cay-mini",
    name: "Chậu cây mini mộc",
    artisan: "Gốm Nhà Quê",
    price: 150000,
    image: "assets/images/chau-cay-mini.png",
    category: "do-gom",
    styles: ["moc-mac"],
    leadTime: "1-3",
    rating: 4.7,
    reviewCount: 38,
    note: "Giao dự kiến 2–4 ngày"
  },
  {
    id: "bo-am-tra",
    name: "Bộ ấm trà gia đình",
    artisan: "Gốm Mộc",
    price: 680000,
    image: "assets/images/bo-am-tra.png",
    category: "qua-tang",
    styles: ["truyen-thong"],
    leadTime: "1-3",
    rating: 5.0,
    reviewCount: 21,
    note: "Có sẵn • Đổi trả 7 ngày"
  }
];
