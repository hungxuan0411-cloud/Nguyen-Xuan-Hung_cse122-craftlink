# Phân công nhiệm vụ — SV1 (Buyer)

> **Dự án:** CraftLink — sàn thương mại điện tử sản phẩm thủ công tùy biến
> **Học phần:** CSE122 — Nhóm 11
> **Sinh viên:** Nguyễn Xuân Hưng — 2551060622
> **Phạm vi tài liệu này:** 9 màn hình người mua trong repository cá nhân
> **Nhánh thực tế trên repo nhóm:** `feature/sv1-buyer` · **PR:** #3
> **Cập nhật:** 2026-10-26

## 1. Thiết kế giao diện

- **Canva (repo cá nhân và nhánh `feature/sv1-buyer`):** <https://www.canva.com/design/DAHZAR9VxmU/dQQiBQ9-OPRH6Q5x8DdAkw/edit>
- **Chưa chốt:** bản `docs/sv1-assignment.md` trên nhánh `dev` đang ghi một link Canva khác (`DAHWyBVvS6U`). Cần nhóm xác nhận đâu là bản đúng trước khi nộp — **[CẦN XÁC MINH]**.

## 2. Vai trò và phạm vi

SV1 phụ trách **hành trình người mua (Buyer)** trong `KhachHang/`:

- Khám phá sản phẩm: danh sách, tìm kiếm, lọc, sắp xếp, chi tiết sản phẩm, yêu thích.
- Tùy biến: tạo brief, xem bản tóm tắt cục bộ, chọn nghệ nhân.
- Mua hàng: giỏ hàng, xác nhận đơn 4 bước.
- Sau mua: danh sách đơn, chi tiết đơn và nháp yêu cầu chỉnh sửa.

**Ngoài phạm vi repository cá nhân này:**

- Trang đăng nhập/đăng ký dùng chung nằm ở `DangNhapVaDangKy/` của repo nhóm, do SV1 và SV2 cùng làm; không có trong repo cá nhân.
- Không có backend, không có cơ sở dữ liệu, không gọi API. Toàn bộ dữ liệu là mẫu trong `js/data.js` hoặc trình duyệt.

## 3. Chín màn hình và ánh xạ 6 dòng kiểm kê

Team inventory có **6 dòng SV1** nhưng repo có **9 tệp HTML**. Ba tệp `favorites.html`, `cart.html`, `order-details.html` được gộp vào dòng tương ứng, không tạo dòng mới.

| # | Màn hình | Tệp | Mục đích | Thành phần chính | CRUD | Trạng thái | AI | Task ID |
|---|---|---|---|---|---|---|---|---|
| 1 | Trang chính — danh sách sản phẩm | `index.html`<br>`js/main.js` (`initProductList`)<br>`js/ai-advisor.js` | Tìm, lọc, sắp xếp và mở chi tiết sản phẩm; hỏi trợ lý CraftLink AI | Ô tìm kiếm `#search-input`; bộ lọc danh mục/phong cách/thời gian/giá; 4 kiểu sắp xếp; 8 thẻ `.product-card`; panel CraftLink AI | R: đọc 8 sản phẩm mẫu; AI đọc thêm 7 hồ sơ nghệ nhân | Normal; Empty khi bộ lọc không có kết quả; Loading AI 350 ms (mô phỏng); Error khi input < 3 ký tự | Có nhãn AI — **luật từ khóa cục bộ**, không gọi mô hình | TASK-01 |
| 2 | Chi tiết sản phẩm | `product-detail.html`<br>`js/main.js` (`initProductDetail`, `renderProductDetail`, `initFavoriteButton`, `initProductGallery`) | Xem kỹ sản phẩm trước khi mua hoặc tùy biến | Gallery 1 ảnh lớn + 5 thumb; stepper 1–99; `#add-to-cart-btn`; `#favorite-btn`; panel nghệ nhân; nút báo cáo listing (demo); 3 đánh giá mẫu | R: sản phẩm theo `?id`; C: thêm giỏ; C: bật yêu thích | Normal; fallback + toast khi `?id` không hợp lệ | Không | TASK-02 |
| 3 | Tạo brief tùy biến | `customize.html`<br>`js/main.js` (`initCustomizePage`, `buildSummary`, `runSummary`) | Gửi yêu cầu tùy biến rõ ràng cho nghệ nhân | Form mô tả, đếm ký tự, ảnh tham khảo; panel kết quả; nút Chấp nhận / Sửa / Từ chối / Tạo lại / Lưu | R: sản phẩm; C/U: brief nháp trong `sessionStorage`; D: bỏ bản tóm tắt | Normal; Loading 600 ms (mô phỏng); Error khi brief rỗng; panel kết quả | Có nhãn AI — **tóm tắt bằng luật cục bộ**, không gọi mô hình | TASK-03 |
| 4 | Gợi ý nghệ nhân | `artisan-suggestions.html`<br>`js/main.js` (`initArtisanSuggestionsPage`) | Chọn nghệ nhân phù hợp với sản phẩm và brief | Danh sách nghệ nhân kèm lý do khớp; chọn / bỏ qua / tạo lại / quay lại sửa brief | R: 7 hồ sơ nghệ nhân; U: chọn nghệ nhân vào draft | Normal; Empty khi không có hồ sơ khớp; Guidance khi thiếu brief | **Không phải AI** — số tiêu chí khớp, không phải xác suất | TASK-04 |
| 5 | Giỏ hàng | `cart.html`<br>`js/main.js` (`initCartPage`) | Kiểm tra và chỉnh sản phẩm trước khi mua | Danh sách dòng hàng; tăng/giảm số lượng; xóa; tạm tính; nút sang xác nhận đơn | C: thêm từ trang chi tiết; R: đọc giỏ; U: đổi số lượng; D: xóa | Normal; Empty khi giỏ trống | Không | TASK-05 |
| 6 | Sản phẩm yêu thích | `favorites.html`<br>`js/main.js` (`initFavoritesPage`) | Lưu và xem lại sản phẩm yêu thích | Lưới sản phẩm; bỏ yêu thích; mở chi tiết hoặc tạo brief; khối `#favorites-empty` | R: danh sách; D: bỏ yêu thích | Normal; Empty khi chưa có sản phẩm | Không | TASK-01 |
| 7 | Xác nhận đơn | `checkout.html`<br>`js/checkout.js` | Xác nhận đơn tùy biến hoặc đơn từ giỏ hàng | 4 bước: Xem lại → Nhận hàng → Thanh toán & giao hàng → Xác nhận; kiểm tra SĐT/địa chỉ; mã đơn demo | R: draft hoặc giỏ; U: thông tin nhận hàng/thanh toán/giao hàng; C: mã demo; D: xóa draft | Normal; 4 bước; Error thiếu/sai SĐT, địa chỉ, phương thức; Empty thiếu draft/giỏ; Complete | Không | TASK-05 |
| 8 | Đơn hàng của bạn | `orders.html`<br>`js/main.js` (`initOrdersPage`) | Theo dõi trạng thái đơn | Tab trạng thái; tìm kiếm; lọc thời gian; hủy đơn (chỉ đổi DOM); mở chi tiết | R: 4 đơn mẫu tĩnh; U: hủy đơn trên giao diện; không C/D | Normal; Empty khi không khớp; Confirm trước khi hủy | Không | TASK-06 |
| 9 | Chi tiết đơn và chỉnh sửa | `order-details.html`<br>`js/main.js` (`initOrderDetailsPage`) | Xem chi tiết đơn và gửi yêu cầu chỉnh sửa | Thông tin đơn mẫu; ô nội dung chỉnh sửa; gửi/lưu nháp; khôi phục nháp | R: đơn tĩnh; C/U: nháp trong `localStorage`; không D | Normal; Error khi nội dung rỗng; khôi phục nháp khi mở lại | Không | TASK-06 |

> **Giới hạn của bản demo:** `orders.html` dùng 4 dòng dữ liệu mẫu tĩnh; checkout không tạo đơn mới và không tự chuyển sang `orders.html`; `order-details.html` không đọc `?id`. Không được mô tả các luồng này là đã nối backend.

## 4. AI tích hợp — khai báo trung thực

| Tính năng | Tệp | Có gọi mô hình? | Kết luận |
|---|---|---|---|
| CraftLink AI — tư vấn sản phẩm/nghệ nhân | `index.html` + `js/ai-advisor.js` | **Không** | Luật từ khóa cục bộ. Đầu tệp ghi: "Đây KHÔNG phải AI tạo sinh và KHÔNG gọi API bên ngoài." Điểm khớp là điểm tiêu chí, không phải xác suất. |
| Bản tóm tắt brief | `customize.html` + `js/main.js` (`buildSummary`, `runSummary`) | **Không** | Luật cục bộ; có đủ UI 6 bước nhưng không phải AI tạo sinh. |
| Gợi ý nghệ nhân | `artisan-suggestions.html` | **Không** | Trang ghi rõ "bộ lọc tiêu chí cục bộ, chưa kết nối mô hình AI tạo sinh". Không khai là AI. |

**Ba tuyên bố AI trong team inventory chưa có mã tương ứng:** AI Personalization, AI Visual Matcher, AI Proposal Evaluator. Không được khai các mục này là đã triển khai; cần sửa inventory hoặc ghi "định hướng, chưa triển khai".

Chi tiết prompt, lỗi đã sửa và mức bằng chứng: xem [`docs/ai-usage-report.md`](ai-usage-report.md).

## 5. Checklist tiến độ

- [x] 9 tệp HTML trong `KhachHang/` (bản repo cá nhân đặt ở thư mục gốc)
- [x] 9 tệp CSS và 4 tệp JS
- [x] `docs/screen-inventory.md`, `docs/user-flow.md`, `docs/ai-usage-report.md`, `videos/README.md`
- [x] Chạy thủ công 9 trang trên desktop — **tự khai**, chưa có biên bản kiểm thử
- [x] Cross-review PR #1 và PR #2 của nhóm ngày 2026-10-26
- [ ] Quay đủ 6 video OBS `SV1-01`…`SV1-06` — hiện **0/6**
- [ ] Tách lịch sử PR #3 theo từng màn hình, dùng Conventional Commits
- [ ] Dựng board Trello/Jira công khai và dán link vào `README.md` mục 10
- [ ] Dán bảng mục 3.1 vào `docs/ai-usage-report.md` của repo nhóm (bản dán sẵn ở mục 8 của báo cáo cá nhân)
- [ ] Sửa cột nhánh/tên AI trong `docs/screen-inventory.md` và `docs/task-board.md` của nhóm
- [ ] Chốt chuẩn tên `role-function-action.html` ở phạm vi cả nhóm
- [ ] Bổ sung minh chứng responsive (ảnh hoặc biên bản) nếu giảng viên yêu cầu

## 6. Video OBS — ánh xạ bắt buộc

| STT | Tệp bắt buộc | Màn hình | Trạng thái | Link |
|---|---|---|---|---|
| 1 | `SV1-01-home-explore.mp4` | `index.html` (kèm `favorites.html`) | Chưa quay | — |
| 2 | `SV1-02-product-detail.mp4` | `product-detail.html` | Chưa quay | — |
| 3 | `SV1-03-custom-order-brief.mp4` | `customize.html` | Chưa quay | — |
| 4 | `SV1-04-proposal-comparison.mp4` | `artisan-suggestions.html` | Chưa quay | — |
| 5 | `SV1-05-checkout-confirmation.mp4` | `cart.html` + `checkout.html` | Chưa quay | — |
| 6 | `SV1-06-customer-dashboard.mp4` | `orders.html` + `order-details.html` | Chưa quay | — |

Ba link SV1 đã cung cấp trong tệp `video` của nhánh `feature/sv1-buyer` (STT 4, 7, 9) **chưa được điền vào bảng chính thức** vì chưa khớp được với 6 dòng kiểm kê. Xem [`videos/README.md`](../videos/README.md) mục 1.1.

## 7. Minh chứng trong mã

| Nội dung | Tệp và hàm |
|---|---|
| Danh sách, tìm kiếm, lọc, sắp xếp | `js/main.js` — `initProductList` (dòng 583) |
| Trợ lý CraftLink AI | `js/ai-advisor.js` — `aiRunSearch` (dòng 1713), `aiSearchAll` (dòng 1096) |
| Chi tiết sản phẩm | `js/main.js` — `initProductDetail` (dòng 1008), `renderProductDetail` (dòng 831) |
| Giỏ hàng | `js/main.js` — `initCartPage` (dòng 1070) |
| Yêu thích | `js/main.js` — `initFavoritesPage` (dòng 1226); `favorites.html` `#favorites-empty` |
| Tạo brief | `js/main.js` — `initCustomizePage` (dòng 1345), `buildSummary` (dòng 1495), `runSummary` (dòng 1531) |
| Gợi ý nghệ nhân | `js/main.js` — `initArtisanSuggestionsPage` (dòng 1795) |
| Xác nhận đơn | `js/checkout.js` — `renderStep` (dòng 394), `handleConfirm` (dòng 510) |
| Đơn hàng | `js/main.js` — `initOrdersPage` (dòng 1640) |
| Chi tiết đơn | `js/main.js` — `initOrderDetailsPage` (dòng 1762) |

## 8. Việc cần nhóm xác nhận

1. **6 hay 9 video:** barem 8.1 yêu cầu mỗi màn hình độc lập một video; phản hồi 2026-10-26 yêu cầu SV1 đủ 6 video. Repo có 9 tệp HTML. Cần chốt cách gộp 3 tệp phụ vào 6 video.
2. **Nhánh thực tế:** cả 6 task SV1 nằm trên `feature/sv1-buyer`, không phải 6 nhánh `feature/home-explore`, `feature/product-detail`… như bảng cũ.
3. **Tên AI trong inventory:** bỏ hoặc đánh dấu "chưa triển khai" cho AI Personalization, AI Visual Matcher, AI Proposal Evaluator.
4. **Chuẩn tên tệp:** chuyển sang `role-function-action.html` phải làm đồng bộ cả nhóm trước khi quay video.
5. **Canva:** chốt giữa `DAHZAR9VxmU` và `DAHWyBVvS6U`.
6. **Board:** SV1 được giao dựng board nhưng chưa có link; cần tạo và dán vào `README.md` mục 10.
