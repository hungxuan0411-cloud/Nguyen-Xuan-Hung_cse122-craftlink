# Bảng công việc SV1 — nguồn dựng board Trello/Jira

> Phạm vi: 6 thẻ SV1 trong bảng 18 thẻ của nhóm.
> Cập nhật: 2026-10-26.
> Tệp này là **bản nguồn**, không thay thế board thật. Tiêu chí 7.1 cần một board công khai, tối thiểu 5 cột, mở được bằng link.

## 1. Năm cột bắt buộc

| Cột | Nghĩa | Thẻ nằm ở đây khi |
|---|---|---|
| 1. Backlog | Đã đặc tả, chưa nhận | Chỉ có Task ID và tên màn hình |
| 2. Đang làm | Đang viết mã | Đã tạo nhánh |
| 3. Chờ review | Đã mở pull request | Có số PR, chờ người khác review |
| 4. Đã gộp | PR đã merge | Có commit trên nhánh chính |
| 5. Video & bảo vệ | Đã quay và dán link | Có link video và tên `.mp4` |

## 2. Sáu thẻ SV1 — trạng thái thật

| Task ID | Thẻ | Màn hình | Nhánh thực tế | PR | Video bắt buộc | Cột hiện tại |
|---|---|---|---|---|---|---|
| TASK-01 | Danh sách sản phẩm & yêu thích (STT 1) | `index.html`, `favorites.html` | `feature/sv1-buyer` | #3 | `SV1-01-home-explore.mp4` | Chờ review |
| TASK-02 | Chi tiết sản phẩm (STT 2) | `product-detail.html` | `feature/sv1-buyer` | #3 | `SV1-02-product-detail.mp4` | Chờ review |
| TASK-03 | Tạo brief tùy biến (STT 3) | `customize.html` | `feature/sv1-buyer` | #3 | `SV1-03-custom-order-brief.mp4` | Chờ review |
| TASK-04 | Chọn nghệ nhân (STT 4) | `artisan-suggestions.html` | `feature/sv1-buyer` | #3 | `SV1-04-proposal-comparison.mp4` | Chờ review |
| TASK-05 | Giỏ hàng & xác nhận đơn (STT 5) | `cart.html`, `checkout.html` | `feature/sv1-buyer` | #3 | `SV1-05-checkout-confirmation.mp4` | Chờ review |
| TASK-06 | Đơn hàng & chi tiết đơn (STT 6) | `orders.html`, `order-details.html` | `feature/sv1-buyer` | #3 | `SV1-06-customer-dashboard.mp4` | Chờ review |

**Không có 6 nhánh riêng.** Bảng cũ ghi `feature/home-explore`, `feature/product-detail`, `feature/custom-order-brief`, `feature/proposal-comparison`, `feature/checkout-confirmation`, `feature/customer-dashboard`; các nhánh này không tồn tại trên remote. Toàn bộ mã SV1 nằm trên `feature/sv1-buyer`.

## 3. Ba tệp HTML ngoài 6 thẻ

| Tệp | Thuộc thẻ | Lý do |
|---|---|---|
| `favorites.html` | TASK-01 | Cùng dòng kiểm kê "Danh sách sản phẩm & yêu thích" |
| `cart.html` | TASK-05 | Cùng luồng giỏ hàng → xác nhận đơn |
| `order-details.html` | TASK-06 | Cùng dòng kiểm kê "Đơn hàng & chi tiết đơn" |

## 4. Trạng thái thật tại 2026-10-26

| Nội dung | Trạng thái | Ghi chú |
|---|---|---|
| PR #3 | Đang mở | Chưa merge; chưa thẻ nào được chuyển sang "Đã gộp" |
| Board Trello/Jira | **Chưa dựng** | Tiêu chí 7.1 chưa đạt cho đến khi có link công khai |
| Video OBS | **0/6** | Không có link, không có thời lượng; không điền số liệu giả |
| Review PR #3 | Chưa có review của thành viên khác | SV1 đã review PR #1 và #2, nhưng PR #3 vẫn cần người khác review |
| Tách lịch sử PR #3 | Chưa làm | Commit đầu quá lớn; cần tách theo màn hình và dùng Conventional Commits |

## 5. Cách dựng board

1. Tạo board **công khai** trên Trello, tên `CSE122 — CraftLink — Nhóm 11`.
2. Tạo 5 danh sách theo mục 1.
3. Dán 6 dòng ở mục 2 thành 6 thẻ; tiêu đề theo mẫu `TASK-01 · Danh sách sản phẩm & yêu thích (STT 1) — SV1`.
4. Mô tả thẻ theo mẫu:

   ```
   Nhánh: feature/sv1-buyer
   Pull request: #3
   Video: SV1-01-home-explore.mp4 — [chưa có link]
   Màn hình: index.html, favorites.html
   ```

5. Gắn nhãn `SV1` cho cả 6 thẻ.
6. Dán link board vào `README.md` mục 10 của repo nhóm và vào báo cáo.

> Chỉ chuyển thẻ sang "Video & bảo vệ" sau khi có link video thật. Chỉ chuyển sang "Đã gộp" sau khi PR #3 thực sự được merge.
