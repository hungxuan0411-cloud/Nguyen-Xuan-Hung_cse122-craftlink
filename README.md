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
├── index.html                  # Trang chính: danh sách sản phẩm + trợ lý CraftLink AI
├── product-detail.html         # Chi tiết sản phẩm
├── customize.html              # Tạo brief tùy biến
├── artisan-suggestions.html    # Gợi ý nghệ nhân
├── cart.html                   # Giỏ hàng
├── favorites.html              # Sản phẩm yêu thích
├── checkout.html               # Xác nhận đơn 4 bước (đơn tùy biến hoặc từ giỏ hàng)
├── orders.html                 # Đơn hàng của bạn
├── order-details.html          # Chi tiết đơn & gửi yêu cầu chỉnh sửa
├── css/
│   ├── style.css               # CSS dùng chung (biến màu, header, footer, responsive)
│   ├── ai-advisor.css          # Trợ lý CraftLink AI
│   ├── product-detail.css      # Trang chi tiết sản phẩm
│   ├── customize.css           # Trang tạo brief
│   ├── artisan-suggestions.css # Trang gợi ý nghệ nhân
│   ├── cart.css                # Giỏ hàng
│   ├── checkout.css            # Xác nhận đơn
│   ├── orders.css              # Danh sách đơn hàng
│   └── order-details.css       # Chi tiết đơn
├── js/
│   ├── data.js                 # Dữ liệu mẫu: 8 sản phẩm, 7 nghệ nhân
│   ├── main.js                 # Tìm kiếm/lọc, giỏ hàng, yêu thích, brief, đơn hàng
│   ├── checkout.js             # Luồng xác nhận đơn 4 bước
│   └── ai-advisor.js           # Trợ lý tìm kiếm cục bộ theo từ khóa
├── assets/
│   └── images/                 # Ảnh sản phẩm, nghệ nhân và gallery
└── README.md
```

## Chức năng chính
- **Trang chính — Danh sách sản phẩm (index.html):** tìm kiếm không dấu, lọc theo danh mục – phong cách – thời gian làm – khoảng giá, sắp xếp theo giá/đánh giá, xóa bộ lọc, đếm số kết quả và trạng thái rỗng; thẻ sản phẩm mở trang chi tiết qua `?id=`.
- **Trợ lý CraftLink AI (index.html):** tìm kiếm cục bộ theo từ khóa trên dữ liệu sản phẩm và nghệ nhân, hiển thị tiêu chí khớp, trạng thái đang phân tích và ghi rõ khi chưa đủ dữ liệu đối chiếu; nghệ nhân chưa có địa điểm được liệt kê riêng. Trợ lý không gọi API AI và không lưu lịch sử tìm kiếm.
- **Chi tiết sản phẩm:** hiển thị theo `?id=`, gallery ảnh, chọn số lượng, thêm vào giỏ, bật/tắt yêu thích và chuyển sang tạo brief; nút báo cáo listing chỉ hiện thông báo demo.
- **Giỏ hàng:** thêm sản phẩm, tăng/giảm số lượng, xóa, tính tổng tiền — lưu bằng localStorage; chuyển sang `checkout.html?mode=cart` để đặt hàng.
- **Yêu thích:** bật/tắt trái tim ở trang chi tiết và xem danh sách sản phẩm yêu thích đã lưu.
- **Tạo brief:** đếm ký tự, kiểm tra dữ liệu nhập, mô phỏng phân tích cục bộ, cho phép chấp nhận / sửa / từ chối / tạo lại / lưu tạm; brief đã chấp nhận được giữ trong sessionStorage để sang bước chọn nghệ nhân.
- **Gợi ý nghệ nhân:** chấm điểm mức phù hợp giữa sản phẩm, brief và hồ sơ nghệ nhân kèm lý do khớp; hỗ trợ chọn, bỏ qua và tạo lại gợi ý.
- **Xác nhận đơn (checkout.html):** 4 bước Xem lại → Nhận hàng → Thanh toán & giao hàng → Xác nhận; dùng cho một sản phẩm tùy biến hoặc nhiều sản phẩm từ giỏ hàng, kiểm tra số điện thoại/địa chỉ và sinh mã đơn demo — chưa có thanh toán thật.
- **Đơn hàng:** chuyển tab trạng thái (Tất cả, Chờ proposal, Đang làm, Chỉnh sửa, Hoàn thành, Đã hủy), tìm kiếm, lọc thời gian, hủy đơn (mô phỏng trên trình duyệt).
- **Chi tiết đơn:** xem thông tin đơn và gửi yêu cầu chỉnh sửa, lưu nháp bằng localStorage.
- Luồng người mua qua 9 trang: xem sản phẩm → tạo brief tùy biến → chọn nghệ nhân → xác nhận đơn → theo dõi đơn; hoặc mua trực tiếp: chi tiết sản phẩm → giỏ hàng → xác nhận đơn → đơn hàng.

## Thiết kế Canva
https://www.canva.com/design/DAHZAR9VxmU/dQQiBQ9-OPRH6Q5x8DdAkw/edit


## Video trình bày
https://www.youtube.com/watch?v=3UAWNLqSxcY&list=PLK12prV3f_5A

## Cách chạy
Mở `index.html` bằng trình duyệt hoặc dùng Live Server trong VS Code.

## Lưu ý
- Đặt file HTML chính ở thư mục gốc với tên `index.html`; đặt CSS trong `css/style.css`, JavaScript trong `js/main.js`, và hình ảnh trong `assets/`.
- Website là bản demo giao diện: các thao tác như đặt hàng, gửi brief... chỉ xử lý phía trình duyệt, chưa gửi đến máy chủ.
