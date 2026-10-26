# Screen Inventory — CraftLink (Buyer)

> Phạm vi: 9 màn hình phía **người mua** trong repository này.
> Cập nhật: 2026-10-25.
> Nguồn xác minh: mã nguồn HTML/CSS/JS hiện có trong repository. Tài liệu này **không** thay thế kiểm thử trên trình duyệt.
> Sơ đồ luồng: xem [`docs/user-flow.md`](user-flow.md).

## 1. Quy ước

- **C/R/U/D**: Create / Read / Update / Delete.
- **Normal**: trạng thái mặc định có dữ liệu.
- **Loading**: chỉ là độ trễ mô phỏng cục bộ; dự án không gọi API.
- **Empty**: danh sách hoặc bộ lọc không có dữ liệu.
- **Error**: lỗi nhập liệu hoặc lỗi xử lý cục bộ; không có lỗi mạng vì không có backend.
- Toàn bộ dữ liệu là dữ liệu mẫu trong `js/data.js` hoặc dữ liệu tĩnh trong HTML. Giỏ hàng, yêu thích và nháp chỉnh sửa lưu bằng Web Storage của trình duyệt.

## 2. Bảng kiểm kê màn hình (11 cột)

| Role | User Goal | User Task | Screen | File | CRUD | States | AI | Assignee | Task ID | Branch |
|---|---|---|---|---|---|---|---|---|---|---|
| Người mua | Tìm món đồ thủ công phù hợp nhu cầu và ngân sách | Tìm kiếm, lọc, sắp xếp, xem kết quả; hỏi trợ lý CraftLink AI | Trang chính — Danh sách sản phẩm + Trợ lý AI | `index.html`<br>`js/main.js` (`initProductList`)<br>`js/ai-advisor.js` | R: đọc 8 sản phẩm mẫu<br>AI: R sản phẩm + 7 nghệ nhân | Normal<br>Empty: bộ lọc không có kết quả<br>Loading: AI 350 ms (mô phỏng)<br>Error: AI báo lỗi khi input &lt; 3 ký tự hoặc xử lý thất bại | Có — tìm kiếm cục bộ theo từ khóa, giải thích tiêu chí khớp; không gọi API, không lưu lịch sử | SV1 (Buyer) | TASK-01 | `feature/sv1-buyer` |
| Người mua | Xem kỹ sản phẩm trước khi mua hoặc tùy biến | Xem gallery, chọn số lượng, thêm vào giỏ, bật yêu thích, sang tạo brief | Chi tiết sản phẩm | `product-detail.html`<br>`js/main.js` (`initProductDetail`, `renderProductDetail`, `initFavoriteButton`, `initProductGallery`) | R: sản phẩm theo `?id`<br>C: thêm giỏ hàng<br>C: bật yêu thích | Normal<br>Fallback + toast khi `?id` không hợp lệ<br>Không có Loading/Empty/Error riêng | Không | SV1 (Buyer) | TASK-02 | `feature/sv1-buyer` |
| Người mua | Gửi yêu cầu tùy biến rõ ràng cho nghệ nhân | Nhập mô tả, đếm ký tự, tạo bản tóm tắt, chấp nhận/sửa/từ chối/tạo lại/lưu tạm | Tạo brief tùy biến | `customize.html`<br>`js/main.js` (`initCustomizePage`, `buildSummary`, `runSummary`) | R: sản phẩm<br>C/U: brief nháp trong sessionStorage<br>D: bỏ bản tóm tắt, không xóa nội dung đã nhập | Normal<br>Loading: 600 ms (mô phỏng)<br>Error: brief rỗng hoặc chưa tạo bản tóm tắt<br>Result panel sau khi tạo | Có — mô phỏng tóm tắt brief bằng luật cục bộ; không gọi API | SV1 (Buyer) | TASK-03 | `feature/sv1-buyer` |
| Người mua | Chọn nghệ nhân phù hợp với sản phẩm và brief | Xem gợi ý kèm lý do, chọn nghệ nhân, bỏ qua, tạo lại, quay lại sửa brief | Gợi ý nghệ nhân | `artisan-suggestions.html`<br>`js/main.js` (`initArtisanSuggestionsPage`) | R: 7 hồ sơ nghệ nhân<br>U: chọn nghệ nhân vào draft | Normal<br>Empty: không có hồ sơ khớp<br>Guidance: thiếu brief<br>Không có Loading/Error | Không — chấm điểm tiêu chí cục bộ; code ghi rõ không phải mô hình AI | SV1 (Buyer) | TASK-04 | `feature/sv1-buyer` |
| Người mua | Kiểm tra và chỉnh sản phẩm trước khi mua | Xem giỏ, tăng/giảm số lượng, xóa, xem tạm tính, sang xác nhận đơn | Giỏ hàng | `cart.html`<br>`js/main.js` (`initCartPage`) | C: thêm từ trang chi tiết<br>R: đọc giỏ<br>U: đổi số lượng<br>D: xóa sản phẩm | Normal<br>Empty: giỏ trống<br>Không có Loading/Error | Không | SV1 (Buyer) | TASK-05 | `feature/sv1-buyer` |
| Người mua | Lưu và xem lại sản phẩm yêu thích | Xem danh sách, bỏ yêu thích, mở chi tiết hoặc yêu cầu tùy biến | Sản phẩm yêu thích | `favorites.html`<br>`js/main.js` (`initFavoritesPage`) | R: danh sách yêu thích<br>D: bỏ yêu thích | Normal<br>Empty: chưa có sản phẩm yêu thích<br>Không có Loading/Error | Không | SV1 (Buyer) | TASK-01 | `feature/sv1-buyer` |
| Người mua | Xác nhận đơn tùy biến hoặc đơn từ giỏ hàng | Xem lại, nhập thông tin nhận hàng, chọn thanh toán/giao hàng, xác nhận | Xác nhận đơn (4 bước) | `checkout.html`<br>`js/checkout.js` | R: draft hoặc giỏ hàng<br>U: thông tin nhận hàng, thanh toán, giao hàng<br>C: mã xác nhận demo<br>D: xóa draft khi tạo yêu cầu mới | Normal<br>4 bước<br>Error: thiếu/sai SĐT, địa chỉ, phương thức thanh toán hoặc giao hàng<br>Empty: thiếu draft hoặc giỏ trống<br>Complete<br>Không có Loading | Không | SV1 (Buyer) | TASK-05 | `feature/sv1-buyer` |
| Người mua | Theo dõi trạng thái đơn hàng | Chuyển tab trạng thái, tìm kiếm, lọc thời gian, hủy đơn, mở chi tiết | Đơn hàng của bạn | `orders.html`<br>`js/main.js` (`initOrdersPage`) | R: danh sách đơn mẫu<br>U: hủy đơn (chỉ đổi DOM)<br>Không C/D | Normal<br>Empty: không có đơn khớp<br>Confirm trước khi hủy<br>Không có Loading/Error | Không | SV1 (Buyer) | TASK-06 | `feature/sv1-buyer` |
| Người mua | Xem chi tiết đơn và gửi yêu cầu chỉnh sửa | Xem thông tin đơn, nhập nội dung chỉnh sửa, gửi/lưu nháp | Chi tiết đơn và chỉnh sửa | `order-details.html`<br>`js/main.js` (`initOrderDetailsPage`) | R: thông tin đơn tĩnh<br>C/U: nháp yêu cầu chỉnh sửa trong localStorage<br>Không D | Normal<br>Error: nội dung chỉnh sửa rỗng<br>Khôi phục nháp khi mở lại<br>Không có Loading/Empty | Không | SV1 (Buyer) | TASK-06 | `feature/sv1-buyer` |

## 3. Ghi chú về các cột chưa có minh chứng

- **Task ID**: lấy theo `docs/task-board.md` của nhóm (TASK-01…TASK-06). Bảng công việc là bản nguồn; **board Trello/Jira thật chưa dựng**, nên tiêu chí 7.1 chưa đạt cho đến khi có link công khai.
- **Branch**: nhánh thực tế trên repo nhóm là `feature/sv1-buyer` (PR #3) cho cả 9 màn hình. Các tên `feature/home-explore`, `feature/product-detail`… trong bảng cũ **không tồn tại** trên remote. Repo cá nhân dùng nhánh `docs/sv1-evidence` cho tài liệu.
- **Assignee**: cột này đang ghi theo phạm vi Buyer do chủ repository phụ trách. Tên đầy đủ và phân công chính thức cần nhóm xác nhận.
- **6 dòng / 9 tệp**: `favorites.html` gộp vào dòng 1, `cart.html` vào dòng 5, `order-details.html` vào dòng 6. Không tạo thêm dòng để tránh lệch bảng 18 dòng của nhóm.
- **Video**: 6 tên tệp `SV1-01`…`SV1-06` tương ứng 6 dòng; hiện **0/6 video đã quay**.

> Các mục trên là khoảng trống minh chứng cần bổ sung trước khi đối chiếu K1/K2 và tiêu chí quản lý công việc; chúng không ảnh hưởng đến việc mô tả đúng các màn hình đã có trong code.

## 4. Phạm vi đã xác minh

- 9 trang HTML, 9 file CSS, 4 file JS.
- 8 sản phẩm và 7 nghệ nhân trong `js/data.js`.
- Không có backend, không có API, không có thư viện AI.
- Các thao tác thêm giỏ, yêu thích, brief, checkout và nháp chỉnh sửa chỉ xử lý trong trình duyệt.
- Trang Đơn hàng dùng dữ liệu mẫu tĩnh; xác nhận đơn không tạo đơn hàng mới và không gửi dữ liệu đi đâu.
