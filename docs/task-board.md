# Task Board — CraftLink (Buyer)

> Phạm vi: 9 màn hình phía **người mua** cùng công việc tài liệu, git và QA.
> Cập nhật: 2026-10-25.
> Nguồn trạng thái trực tiếp: GitHub Issues của repository này.
> **Lưu ý trung thực:** 12 việc trong cột Done được ghi Issue **hồi tố** ngày 2026-10-25, sau khi mã đã có trên `main`. Bảng này không chứng minh thứ tự thời gian làm việc.

## 1. Quy ước

- **Done**: đã có trong `main`.
- **Review**: PR đang mở, chưa merge.
- **Todo**: việc sẽ làm; **Backlog**: chưa lên lịch.
- **Assignee** hiện tại: `hungxuan0411-cloud` (chủ repository). Tên đầy đủ của teammate: **[CẦN XÁC MINH]**.
- Nhãn GitHub: `role:buyer`, `status:*`, `type:*`.

## 2. Done

| Task ID | Việc | Người phụ trách | Issue | Bằng chứng |
|---|---|---|---|---|
| BUY-01 | Trang chính — danh sách sản phẩm và trợ lý AI | hungxuan0411-cloud | [#1](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/1) | `index.html`; `js/main.js` (`initProductList`, `applyCatalog`); `js/ai-advisor.js` |
| BUY-02 | Chi tiết sản phẩm | hungxuan0411-cloud | [#2](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/2) | `product-detail.html`; `js/main.js` (`initProductDetail`, `renderProductDetail`, `initFavoriteButton`, `initProductGallery`) |
| BUY-03 | Tạo brief tùy biến | hungxuan0411-cloud | [#3](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/3) | `customize.html`; `js/main.js` (`initCustomizePage`, `buildSummary`, `runSummary`) |
| BUY-04 | Gợi ý nghệ nhân | hungxuan0411-cloud | [#4](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/4) | `artisan-suggestions.html`; `js/main.js` (`initArtisanSuggestionsPage`, `renderCards`) |
| BUY-05 | Giỏ hàng | hungxuan0411-cloud | [#5](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/5) | `cart.html`; `js/main.js` (`initCartPage`); `craftlink_cart` |
| BUY-06 | Sản phẩm yêu thích | hungxuan0411-cloud | [#6](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/6) | `favorites.html`; `js/main.js` (`initFavoriteButton`, `initFavoritesPage`); `craftlink_favorites` |
| BUY-07 | Xác nhận đơn 4 bước | hungxuan0411-cloud | [#7](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/7) | `checkout.html`; `js/checkout.js` (`renderStep`, `handleConfirm`) |
| BUY-08 | Đơn hàng của bạn | hungxuan0411-cloud | [#8](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/8) | `orders.html`; `js/main.js` (`initOrdersPage`) |
| BUY-09 | Chi tiết đơn và chỉnh sửa | hungxuan0411-cloud | [#9](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/9) | `order-details.html`; `js/main.js` (`initOrderDetailsPage`); `craftlink_revision_draft` |
| DOC-01 | Screen inventory cho 9 màn hình Buyer | hungxuan0411-cloud | [#10](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/10) | `docs/screen-inventory.md` |
| DOC-02 | Sơ đồ User Flow và DOC.md | hungxuan0411-cloud | [#11](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/11) | `docs/user-flow.md`; `DOC.md` |
| DOC-05 | Cập nhật README theo mã nguồn Buyer | hungxuan0411-cloud | [#12](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/12) | `README.md`; commit `513ab7f` |

## 3. Review

| Task ID | Việc | Người phụ trách | Issue | Bằng chứng |
|---|---|---|---|---|
| GIT-01 | Tạo nhánh `dev`, `feature/task-board` và PR đầu tiên | hungxuan0411-cloud | [#13](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/13) | Hai nhánh đã đẩy lên remote; PR `feature/task-board` → `dev` đang mở, **chưa merge**, liên kết PR được ghi trong Issue #13 |

## 4. Todo

| Task ID | Việc | Người phụ trách | Issue | Ghi chú |
|---|---|---|---|---|
| GIT-02 | Mời teammate review PR thật | [CẦN XÁC MINH] | [#14](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/14) | Cần tên GitHub của teammate; không tạo review giả |
| DOC-03 | Viết `docs/ai-usage-report.md` | hungxuan0411-cloud | [#15](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/15) | Chưa có bản nháp; cần đối chiếu yêu cầu học phần |
| DOC-04 | Viết `docs/project-proposal.md` | hungxuan0411-cloud | [#16](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/16) | Chưa có bản nháp |
| QA-01 | Quay video OBS cho 9 màn hình Buyer | hungxuan0411-cloud | [#17](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/17) | Chưa có video OBS trong repository |

## 5. Backlog

| Task ID | Việc | Người phụ trách | Issue | Ghi chú |
|---|---|---|---|---|
| GIT-03 | Tạo feature branch cho thay đổi tiếp theo | hungxuan0411-cloud | [#18](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/18) | Quy ước `feature/<task-id>-<mo-ta-ngan>` |

## 6. Ánh xạ màn hình → Task ID

| Task ID | Screen | File | Issue |
|---|---|---|---|
| BUY-01 | Trang chính — Danh sách sản phẩm + Trợ lý AI | `index.html` | [#1](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/1) |
| BUY-02 | Chi tiết sản phẩm | `product-detail.html` | [#2](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/2) |
| BUY-03 | Tạo brief tùy biến | `customize.html` | [#3](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/3) |
| BUY-04 | Gợi ý nghệ nhân | `artisan-suggestions.html` | [#4](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/4) |
| BUY-05 | Giỏ hàng | `cart.html` | [#5](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/5) |
| BUY-06 | Sản phẩm yêu thích | `favorites.html` | [#6](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/6) |
| BUY-07 | Xác nhận đơn 4 bước | `checkout.html` | [#7](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/7) |
| BUY-08 | Đơn hàng của bạn | `orders.html` | [#8](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/8) |
| BUY-09 | Chi tiết đơn và chỉnh sửa | `order-details.html` | [#9](https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink/issues/9) |

## 7. Nhánh và PR

- `main`: baseline hiện tại, chứa toàn bộ 9 màn hình Buyer.
- `dev`: tạo từ `main` ngày 2026-10-25 và đã đẩy lên remote.
- `feature/task-board`: tạo từ `dev`; chứa `docs/task-board.md`, cập nhật Task ID trong `docs/screen-inventory.md` và liên kết trong `DOC.md`.
- PR: `feature/task-board` → `dev`; **chưa merge**, **chưa có review thật**.
- Quy ước: nhánh `feature/<task-id>-<mo-ta-ngan>`, PR tham chiếu Task ID, người tạo không tự duyệt.
- Lịch sử: 9 màn hình được phát triển trực tiếp trên `main` trước khi có quy trình nhánh; repository không viết lại lịch sử git.

## 8. Khoảng trống minh chứng

- **Task ID hồi tố**: Issue của 12 việc Done được tạo sau khi mã đã có trên `main`; không dùng để chứng minh thứ tự thời gian.
- **Review thật**: repository hiện chỉ có 1 collaborator (`hungxuan0411-cloud`); chưa có review độc lập.
- **OBS**: chưa có video minh chứng thao tác trên trình duyệt.
- **Assignee**: chưa xác nhận tên đầy đủ và phân công chính thức của nhóm.
- **Branch theo màn hình**: không có nhánh riêng cho từng màn hình; chỉ có `main`, `dev`, `feature/task-board`.
