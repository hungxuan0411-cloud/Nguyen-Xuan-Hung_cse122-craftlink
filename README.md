# CraftLink — Giao diện người mua

Repository cá nhân cho phần giao diện **người mua** của dự án thương mại điện tử CraftLink, học phần CSE122.

## Mục đích
Cho phép người mua xem danh sách sản phẩm thủ công, tùy biến yêu cầu (brief), chọn nghệ nhân và theo dõi đơn hàng đặt làm.

## Công nghệ sử dụng
- HTML5
- CSS3
- JavaScript thuần (không dùng framework, không có backend)

## Cấu trúc thư mục
```
.
├── index.html                  # Danh sách sản phẩm (trang chính)
├── product-detail.html         # Chi tiết sản phẩm
├── customize.html              # Tạo brief thiết kế cùng AI
├── artisan-suggestions.html    # Gợi ý nghệ nhân
├── cart.html                   # Giỏ hàng
├── favorites.html              # Sản phẩm yêu thích
├── orders.html                 # Đơn hàng của bạn
├── order-details.html          # Chi tiết đơn & revision
├── css/
│   ├── style.css               # CSS dùng chung
│   └── (CSS riêng từng trang)
├── js/
│   ├── data.js                 # Dữ liệu sản phẩm mẫu
│   └── main.js                 # Xử lý tương tác (tìm kiếm, lọc, giỏ hàng...)
├── assets/
│   └── images/                 # Ảnh sản phẩm, nghệ nhân
└── README.md
```

## Chức năng chính
- **Trang chính — Danh sách sản phẩm (index.html):** tìm kiếm không dấu, lọc theo danh mục – phong cách – thời gian làm – khoảng giá, sắp xếp theo giá/đánh giá, xóa bộ lọc, đếm số kết quả và trạng thái rỗng.
- **Giỏ hàng:** thêm sản phẩm, tăng/giảm số lượng, xóa, tính tổng tiền — lưu bằng localStorage.
- **Yêu thích:** bật/tắt trái tim ở trang chi tiết, trang danh sách yêu thích.
- **Tạo brief:** đếm ký tự, kiểm tra dữ liệu nhập, mô phỏng AI phân tích, lưu nháp.
- **Đơn hàng:** chuyển tab trạng thái, tìm kiếm, lọc thời gian, hủy đơn (mô phỏng trên trình duyệt).
- **Gợi ý nghệ nhân & chi tiết đơn:** bỏ qua / tạo lại gợi ý, lưu nháp yêu cầu chỉnh sửa.
- Luồng người mua qua 8 trang: xem sản phẩm → tạo brief tùy biến → chọn nghệ nhân → đặt hàng → theo dõi đơn.

## Thiết kế Canva
https://www.canva.com/design/DAHZAR9VxmU/dQQiBQ9-OPRH6Q5x8DdAkw/edit

## GitHub
https://github.com/hungxuan0411-cloud/Nguyen-Xuan-H-ung_CSE122_craftlink-presentation

## Video trình bày
https://www.youtube.com/watch?v=3UAWNLqSxcY&list=PLK12prV3f_5A

## Cách chạy
Mở `index.html` bằng trình duyệt hoặc dùng Live Server trong VS Code.

## Lưu ý
- Đặt file HTML chính ở thư mục gốc với tên `index.html`; đặt CSS trong `css/style.css`, JavaScript trong `js/main.js`, và hình ảnh trong `assets/`.
- Website là bản demo giao diện: các thao tác như đặt hàng, gửi brief... chỉ xử lý phía trình duyệt, chưa gửi đến máy chủ.
