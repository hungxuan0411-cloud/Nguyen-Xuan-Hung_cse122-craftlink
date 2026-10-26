# videos/ — Danh sách video OBS của SV1 (Buyer)

> Căn cứ: barem 8.1 (mỗi màn hình độc lập có 01 video, tên `SVx-XX-screen-name.mp4`, đủ 8 bước), ĐK4 và phản hồi ngày 2026-10-26.
> Cập nhật: 2026-10-26.
> Trạng thái: **0/6 video đã quay**. Bảng dưới đây để trống link và thời lượng; **không điền link giả**.

## 1. Sáu video bắt buộc

| STT | Tên tệp bắt buộc | Màn hình theo `docs/screen-inventory.md` của nhóm | Tệp thực tế trong repo này | Link video | Thời lượng | Trạng thái |
|---|---|---|---|---|---|---|
| 1 | `SV1-01-home-explore.mp4` | Trang chủ & Khám phá | `index.html` + `js/main.js` (`initProductList`) + `js/ai-advisor.js` | — | — | **Chưa quay** |
| 2 | `SV1-02-product-detail.mp4` | Chi tiết sản phẩm | `product-detail.html` + `js/main.js` | — | — | **Chưa quay** |
| 3 | `SV1-03-custom-order-brief.mp4` | Tạo brief yêu cầu tùy biến | `customize.html` + `js/main.js` (`initCustomizePage`, `buildSummary`, `runSummary`) | — | — | **Chưa quay** |
| 4 | `SV1-04-proposal-comparison.mp4` | So sánh & chọn proposal | `artisan-suggestions.html` + `js/main.js` (`initArtisanSuggestionsPage`) | — | — | **Chưa quay** |
| 5 | `SV1-05-checkout-confirmation.mp4` | Thanh toán & xác nhận đơn | `checkout.html` + `js/checkout.js` (+ `cart.html`, `js/main.js` `initCartPage`) | — | — | **Chưa quay** |
| 6 | `SV1-06-customer-dashboard.mp4` | Quản lý đơn hàng & hồ sơ | `orders.html`, `order-details.html` + `js/main.js` (`initOrdersPage`, `initOrderDetailsPage`) | — | — | **Chưa quay** |

**Không được điền link YouTube/Drive không tồn tại, không ghi thời lượng ước lượng, không đánh dấu "đã quay" khi chưa có tệp.**

### 1.1. Ba link SV1 đã cung cấp — chưa khớp được màn hình

Nguồn: tệp `video` trên nhánh `feature/sv1-buyer` của repo nhóm, ngày 2026-10-26. Đây là link do sinh viên cung cấp, không phải link tự tạo. **Chưa điền vào bảng mục 1** vì chưa xác nhận được link nào ứng với màn hình nào.

| STT SV1 ghi | Link | Khả năng ánh xạ | Việc cần làm |
|---|---|---|---|
| 4 | <https://www.youtube.com/watch?v=AW-wuwhA3zc&t=4s> | Có thể là màn 4 — `artisan-suggestions.html` ("Chọn nghệ nhân") | Mở video, đối chiếu tiêu đề và nội dung |
| 7 | <https://www.youtube.com/watch?v=T6ejhOOqfgk> | STT 7 trong bảng 18 dòng là **SV2**; nếu là STT nội bộ 9 trang Buyer thì có thể là `checkout.html` | Xác nhận đây là video của SV1, không phải SV2 |
| 9 | <https://www.youtube.com/watch?v=PaCFXYhuo9U> | STT 9 trong bảng 18 dòng là **SV2**; nếu là STT nội bộ 9 trang Buyer thì có thể là `order-details.html` | Xác nhận đây là video của SV1, không phải SV2 |

> **Rủi ro:** nếu STT 7 và 9 là dòng kiểm kê của SV2, dùng hai link này cho SV1 sẽ sai minh chứng. Chỉ điền sau khi mở video và xác nhận đúng người quay, đúng màn hình, đúng tên tệp.


## 2. Ghi chú mapping — cần chốt với nhóm

1. **Tên màn hình trong team inventory không khớp hoàn toàn với tệp thực tế.** Ví dụ nhóm ghi `custom-order-brief.html`, `proposal-comparison.html`, `checkout-confirmation.html`, `customer-dashboard.html`; repo cá nhân dùng `customize.html`, `artisan-suggestions.html`, `checkout.html`, `orders.html`. Đây là điểm cần chốt trước khi quay — **[CẦN CHỐT VỚI NHÓM]**.
2. **Màn hình 4 không phải trang so sánh proposal.** `artisan-suggestions.html` là trang gợi ý nghệ nhân, không có báo giá/proposal để so sánh. Nếu nhóm yêu cầu đúng màn hình "proposal comparison", cần bổ sung trang hoặc đổi tên màn hình trong inventory. Không được quay trang gợi ý nghệ nhân rồi gọi là "so sánh proposal".
3. **Màn hình 6 chưa có cập nhật hồ sơ cá nhân.** Repo có danh sách đơn và chi tiết đơn/nháp yêu cầu chỉnh sửa, nhưng không có form cập nhật hồ sơ. Nếu nhóm giữ mô tả "R/U/D hồ sơ", cần bổ sung hoặc sửa inventory.
4. **Repo cá nhân có 9 màn hình, không phải 6.** Ngoài 6 màn hình trên còn `cart.html`, `favorites.html`, `order-details.html` (và `forgot password.html` chỉ nằm ở nhánh riêng). Barem 8.1 yêu cầu 1 video cho **mỗi màn hình độc lập**; nếu tính đủ 9, cần thêm video. Con số 6 lấy theo phản hồi ngày 2026-10-26 và sáu dòng SV1 trong team inventory — **[CẦN CHỐT VỚI NHÓM]**.
5. **Team `videos/README.md` đang mâu thuẫn với phản hồi chấm.** Tệp ghi "Đã chốt: 3 video/người" và chỉ có 3 link của SV3, nhưng phản hồi ngày 2026-10-26 yêu cầu SV1 đủ **6 video**. Ngoài ra, 3 link SV1 đã cung cấp (mục 1.1) chưa được đưa vào bảng chính thức vì chưa khớp số dòng. Cần chốt với nhóm và giảng viên — **[CẦN CHỐT VỚI NHÓM]**. Nếu giảng viên xác nhận 6 video là bắt buộc, phải quay đủ 6 và bỏ câu "3 video/người" khỏi tài liệu nhóm.
6. **Tên file HTML chưa theo chuẩn `role-function-action.html`.** Nếu nhóm quyết định đổi tên file, phải đổi trước khi quay để video khớp mã; không đổi riêng lẻ. Đây là việc của cả nhóm — **[CẦN CHỐT VỚI NHÓM]**.

## 3. Tám bước bắt buộc trong mỗi video

1. Webcam nhìn rõ khuôn mặt sinh viên thực hiện và giọng thuyết trình thật.
2. Hiển thị bản thiết kế mockup trên Canva/Figma của đúng màn hình đó.
3. Mở đúng tệp HTML / CSS / JS trong VS Code.
4. Giải thích rõ cấu trúc bố cục HTML/CSS và thuật toán sự kiện JavaScript.
5. Thực hiện ít nhất 01 chỉnh sửa trực tiếp trên mã nguồn.
6. Chạy thử tương tác và kiểm tra responsive trên trình duyệt.
7. Thực hiện `git commit` và `git push` lên GitHub.
8. Đọc rõ mã công việc (Task ID), tên nhánh (Branch) và mã Commit.

Thiếu bước 1 → video đó **0.00đ**. Chỉ quay sản phẩm chạy được mà không giải thích code và không sửa trực tiếp → **trừ 0.25đ**.

## 4. Quy trình quay và nộp

1. Chuẩn bị OBS, webcam, micro, VS Code, trình duyệt và mockup Canva.
2. Quay đủ 6 video theo đúng tên tệp ở mục 1; mỗi video phải có đủ 8 bước.
3. Tải video lên YouTube (chế độ **Không công khai**) hoặc Google Drive; lấy link và ghi đúng thời lượng.
4. Mở link bằng cửa sổ ẩn danh để kiểm tra người chấm mở được.
5. Điền link + thời lượng vào bảng mục 1; cập nhật cùng lúc vào `videos/README.md` và `docs/ai-usage-report.md` của repo nhóm.
6. Không commit tệp `.mp4` trực tiếp: GitHub giới hạn 100 MB/tệp và làm phình lịch sử repo.
7. Giữ bản gốc trên máy và một bản sao lưu; chỉ nộp link.

## 5. Trạng thái minh chứng hiện tại

| Nội dung | Trạng thái | Mức bằng chứng |
|---|---|---|
| 6 video OBS của SV1 | **Chưa quay** | Chưa có tệp, chưa có link |
| Link + thời lượng | **Chưa có** | Không được tạo số liệu giả |
| Video trong repository | **Không có** | Repo chỉ chứa bảng liên kết |
| Task ID / Branch / Commit đọc trong video | **Chưa có** | Cần lấy từ repo nhóm khi quay |

> Sau khi quay xong, thay từng ô `—` bằng link và thời lượng thật. Nếu chưa quay, giữ nguyên "Chưa quay" — đây là minh chứng trung thực, không phải điểm trừ tự nguyện.
