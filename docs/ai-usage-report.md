# Báo cáo minh bạch sử dụng AI — SV1 (Buyer)

> Phạm vi: 9 màn hình người mua trong repository cá nhân này.
> Cập nhật: 2026-10-26.
> Trạng thái: **bản khai cá nhân**, chưa phải báo cáo nhóm chính thức. Khi nộp, dán bảng ở mục 2 vào `docs/ai-usage-report.md` của repository nhóm và đối chiếu mẫu khai báo chính thức của học phần — mẫu này hiện **[CẦN XÁC MINH]**.

## 0. Quy ước mức bằng chứng

| Nhãn | Nghĩa |
|---|---|
| **Đã xác minh từ mã** | Đọc trực tiếp file trong repository này và đối chiếu đúng dòng được ghi. |
| **Đã kiểm tra tĩnh** | Tìm chuỗi trong mã nguồn; chưa thay thế kiểm thử trên trình duyệt. |
| **Tự khai** | Thông tin do sinh viên cung cấp, chưa có nhật ký từng dòng để chứng minh. |
| **Chưa đủ bằng chứng** | Cần bổ sung tài liệu, video hoặc xác nhận của nhóm. |

## 1. Kết luận nhanh

1. **Sản phẩm không tích hợp AI tạo sinh.** Không có lời gọi API AI, không có API key, không có thư viện AI trong mã chạy trên trình duyệt.
2. Hai chỗ có nhãn "AI"/"thông minh" đều là **luật cục bộ viết bằng JavaScript**:
   - **CraftLink AI** trên `index.html`, xử lý trong `js/ai-advisor.js`.
   - **Bản tóm tắt brief** trên `customize.html`, xử lý trong `js/main.js` (`buildSummary`, `runSummary`).
3. `artisan-suggestions.html` **không phải AI**. Trang ghi rõ: "bộ lọc tiêu chí cục bộ, **chưa kết nối mô hình AI tạo sinh**" (`artisan-suggestions.html:61`). Không khai trang này là AI.
4. AI dùng trong **quá trình làm bài**: Qoder là công cụ chính; ChatGPT và Claude do sinh viên tự khai, chưa có nhật ký trong repository.
5. **Không có số liệu phần trăm chính xác** giữa phần AI sinh và phần sinh viên tự viết. Báo cáo chỉ nêu mô tả tự khai, không tạo con số không đo được.

## 2. Bảng SV1 — AI feature / prompt thật / file bằng chứng

Bảng dưới đây bám theo sáu màn hình khách hàng trong `docs/screen-inventory.md` của repository nhóm. Cột **AI feature** chỉ ghi tính năng thực sự có trong mã; cột **Prompt thật** trích từ nhật ký phiên làm việc, không phải prompt tự viết lại.

| # | Màn hình theo team inventory | Tệp thực tế trong repo này | AI feature (thực tế) | Prompt thật | File bằng chứng | Kết luận |
|---|---|---|---|---|---|---|
| 1 | Trang chủ & Khám phá — `SV1-01-home-explore.mp4` | `index.html` | **CraftLink AI — tư vấn sản phẩm/nghệ nhân bằng luật cục bộ** | Ngày **2026-10-24**: "Tôi muốn bổ sung một tính năng AI giúp người dùng mô tả nhu cầu của mình, sau đó nhận được tư vấn và gợi ý sản phẩm hoặc thợ thủ công phù hợp. **Yêu cầu quan trọng nhất:** Chỉ bổ sung tính năng AI vào giao diện hiện có. Không thiết kế lại website, không thay đổi bố cục hiện tại và không tự ý sửa các chức năng đang hoạt động." | `index.html:69-130`; `js/ai-advisor.js:1-10` (ghi rõ không phải AI tạo sinh), `:357` `aiAnalyzeRequest`, `:658` `aiScoreProduct`, `:929` `aiScoreArtisan`, `:1096` `aiSearchAll`, `:1713` `aiRunSearch`; `css/ai-advisor.css` | **Có tính năng mang nhãn AI, nhưng không gọi AI thật.** Đầu file `ai-advisor.js` ghi: "Đây KHÔNG phải AI tạo sinh và KHÔNG gọi API bên ngoài." Điểm khớp là điểm tiêu chí minh bạch, không phải xác suất của mô hình. |
| 2 | Chi tiết sản phẩm — `SV1-02-product-detail.mp4` | `product-detail.html` | **Không có AI** | — | `js/main.js:1008` `initProductDetail`, `:831` `renderProductDetail`, `:1190` `initFavoriteButton`, `:1313` `initProductGallery`; `product-detail.html` | Team inventory ghi "AI Visual Matcher", nhưng **không tìm thấy mã tương ứng** trong repo cá nhân. Không khai là AI. |
| 3 | Tạo brief — `SV1-03-custom-order-brief.mp4` | `customize.html` | **Bản tóm tắt brief bằng luật cục bộ** (không phải AI tạo sinh) | Prompt khởi tạo ngày **2026-10-11**: "Nhiệm vụ của tôi là xây dựng giao diện trang dành cho NGƯỜI MUA bằng HTML, CSS và JavaScript thuần. … Không yêu cầu backend, database, framework hoặc API phức tạp." Thiết kế đầu vào có màn hình "Tạo brief thiết kế cùng AI" (theo mô tả trong nhật ký phiên làm việc). | `customize.html:117-135` (panel kết quả, nút Chấp nhận/Sửa/Từ chối/Tạo lại/Lưu); `js/main.js:1345` `initCustomizePage`, `:1495` `buildSummary`, `:1531` `runSummary` | Có đủ UI 6 bước, nhưng phần xử lý là **luật cục bộ**: `buildSummary` ghi rõ "Hệ thống không dùng mô hình AI tạo sinh". Không có prompt riêng cho tính năng này được lưu — **[CẦN XÁC MINH]**. |
| 4 | So sánh proposal — `SV1-04-proposal-comparison.mp4` | `artisan-suggestions.html` (tên không khớp team inventory) | **Không phải AI — bộ lọc tiêu chí cục bộ** | Cùng prompt ngày 2026-10-24 có nhắc "gợi ý sản phẩm hoặc thợ thủ công", nhưng kết quả triển khai là bộ lọc cục bộ, không phải mô hình AI. | `artisan-suggestions.html:61` (ghi rõ chưa kết nối AI tạo sinh), `:71` (điểm không phải xác suất AI); `js/main.js:1795` `initArtisanSuggestionsPage` | **Không khai là AI.** Team inventory ghi "AI Proposal Evaluator", nhưng repo cá nhân **không có trang so sánh proposal**. Cần chốt lại với nhóm. |
| 5 | Thanh toán & xác nhận — `SV1-05-checkout-confirmation.mp4` | `checkout.html` (kèm `cart.html`) | **Không có AI** | — | `js/checkout.js`; `cart.html`; `js/main.js:1070` `initCartPage` | Không có AI. Chỉ kiểm tra dữ liệu, tính tạm tính và sinh mã đơn demo; không có thanh toán thật. |
| 6 | Quản lý đơn & hồ sơ — `SV1-06-customer-dashboard.mp4` | `orders.html`, `order-details.html` | **Không có AI** | — | `js/main.js:1640` `initOrdersPage`, `:1762` `initOrderDetailsPage`; `orders.html`; `order-details.html` | Không có AI. Có danh sách đơn và nháp yêu cầu chỉnh sửa; **không có cập nhật hồ sơ cá nhân** như tên màn hình trong team inventory. |

### 2.1. Các tuyên bố AI trong team inventory chưa có mã tương ứng

| Tuyên bố trong team inventory | Thực tế trong repo cá nhân | Kết luận |
|---|---|---|
| AI Personalization (STT 1) | Chỉ có CraftLink AI tìm kiếm/tư vấn cục bộ; không có cá nhân hóa theo người dùng | Không khai là AI cá nhân hóa |
| AI Visual Matcher (STT 2) | Không có mã, không có API, không có xử lý ảnh | Chưa triển khai |
| AI Brief Assistant (STT 3) | Có bản tóm tắt brief bằng luật cục bộ, không phải AI tạo sinh | Khai đúng là "luật cục bộ" |
| AI Proposal Evaluator (STT 4) | Không có trang proposal comparison, không có chấm điểm proposal | Chưa triển khai |

> Nếu nhóm vẫn giữ các tên AI trên trong `screen-inventory.md`, cần sửa lại cho khớp mã hoặc ghi rõ là "định hướng, chưa triển khai". Không được để báo cáo AI và inventory mâu thuẫn nhau.

## 3. Sáu bước AI UX — đối chiếu thực tế

| Bước | CraftLink AI (`index.html`) | Bản tóm tắt brief (`customize.html`) |
|---|---|---|
| 1. Input | Ô mô tả + chip gợi ý (`index.html:79-93`) | Ô mô tả, số lượng, ảnh tham khảo (`customize.html`) |
| 2. Processing | Trạng thái "đang phân tích", độ trễ mô phỏng 350 ms | Trạng thái "Đang tạo bản tóm tắt cục bộ…", độ trễ mô phỏng 600 ms |
| 3. Output | Câu trả lời + thẻ sản phẩm/nghệ nhân | Bảng tóm tắt sản phẩm, số lượng, mô tả, giá tham khảo, tạm tính |
| 4. Explainability | Danh sách tiêu chí khớp; nhãn "Tìm kiếm cục bộ"; đầu file ghi rõ không phải AI tạo sinh | Khối "Căn cứ tạo bản tóm tắt" ghi rõ tạo cục bộ, không dùng mô hình AI tạo sinh |
| 5. Accept / Edit / Reject / Regenerate | Có chip bổ sung ngân sách/địa điểm; **chưa có nút chấp nhận/từ chối/tạo lại kết quả tư vấn** | Có đủ nút Chấp nhận / Sửa / Từ chối / Tạo lại (`customize.html:131-134`) |
| 6. Save into app | **Chưa tìm thấy** chức năng lưu kết quả tư vấn | Brief đã chấp nhận được lưu vào `sessionStorage` để trang gợi ý nghệ nhân và checkout sử dụng |

**Kết luận trung thực:** tính năng brief có đủ 6 bước nhưng **không phải AI tạo sinh**; tính năng CraftLink AI có 4/6 bước rõ ràng, thiếu bước chấp nhận/từ chối/tạo lại và bước lưu kết quả. Không được mô tả hai tính năng này là "AI thật" khi bảo vệ.

## 4. AI trong quá trình phát triển

### 4.1. Công cụ đã dùng

| Công cụ | Phạm vi | Bằng chứng | Mức bằng chứng |
|---|---|---|---|
| Qoder | Viết/sửa mã, soạn tài liệu, thao tác Git theo yêu cầu | Commit trong repo cá nhân; PR #3 và các PR khác trong repo nhóm | Đã xác minh có commit/PR; **không có nhật ký prompt đầy đủ** |
| ChatGPT | Sinh viên tự khai có dùng thêm | Không có nhật ký trong repository | **Tự khai** — phạm vi chi tiết **[CẦN XÁC MINH]** |
| Claude | Sinh viên tự khai có dùng thêm | Không có nhật ký trong repository | **Tự khai** — phạm vi chi tiết **[CẦN XÁC MINH]** |

### 4.2. Prompt thật đã dùng

| Ngày | Prompt (nguyên văn, rút gọn) | Kết quả / file liên quan |
|---|---|---|
| 2026-10-11 | "Nhiệm vụ của tôi là xây dựng giao diện trang dành cho NGƯỜI MUA bằng HTML, CSS và JavaScript thuần. … Không yêu cầu backend, database, framework hoặc API phức tạp." | Bộ giao diện 9 trang; `index.html`, `customize.html`, `checkout.html`… |
| 2026-10-15 | "bạn hãy tạo lại link favorites cho tôi tại link cũ khi tôi bấm hủy hết phần yêu thích thì nó mất hết ản phẩm" | Sửa trạng thái rỗng trang yêu thích: `favorites.html:90-93`, `js/main.js:1282-1284` |
| 2026-10-24 | "# NHIỆM VỤ: TÍCH HỢP AI TƯ VẤN SẢN PHẨM VÀ THỢ THỦ CÔNG VÀO CRAFTLINK … Chỉ bổ sung tính năng AI vào giao diện hiện có. Không thiết kế lại website…" | `js/ai-advisor.js`, khu vực CraftLink AI trên `index.html` |
| 2026-10-25 | "ở trong phần giỏ hàng khi khách muốn chọn mua nhiều sản phẩm … các bước thanh toán, thông tin liên lạc như mua lẻ từng sản phẩm thì bạn hãy sửa cho tôi" | `js/checkout.js`, `cart.html`, `js/main.js` (`initCartPage`) |
| 2026-10-25 | "bạn hãy tạo cho tôi docs/screen-inventory.md 12 cột, sơ đồ User Flow sau đó để tôi đọc thử nếu tôi đồng ý bạn hãy thêm chúng vào github của tôi" | `docs/screen-inventory.md`, `docs/user-flow.md` |
| 2026-10-25 | "bạn hãy tạo task board, nhánh dev/feature/*, PR có review thật sau đó để tôi kiểm tra nếu được rồi mới làm bước tiếp" | Task board/nhánh/PR nằm ở repo nhóm; **chưa có trong repo cá nhân** |

> Nguồn prompt: nhật ký phiên làm việc Qoder trên máy sinh viên. Nhật ký này **không nằm trong repository**, nên người chấm không thể mở lại toàn bộ. Khi bảo vệ, chỉ trình bày đúng các prompt đã ghi ở trên; không thêm prompt mới.

### 4.3. Lỗi trong quá trình dùng AI và cách sửa

**Lỗi trạng thái rỗng trang yêu thích**

- **Hiện tượng:** bỏ hết sản phẩm yêu thích thì lưới sản phẩm bị ẩn, nhưng khối "Chưa có sản phẩm yêu thích" không hiện; người dùng thấy trang trống.
- **Prompt báo lỗi thật (2026-10-15):** "bạn hãy tạo lại link favorites cho tôi tại link cũ khi tôi bấm hủy hết phần yêu thích thì nó mất hết ản phẩm" [sic].
- **Cách sửa hiện có:** `favorites.html:90-93` có khối `#favorites-empty`; `js/main.js:1282-1284` tính `isEmpty`, ẩn lưới và hiện khối rỗng tương ứng. Danh sách được render lại sau mỗi lần bỏ yêu thích.
- **Mức bằng chứng:** mã sửa **đã xác minh từ code**; việc lỗi do AI sinh ra là **suy luận từ phạm vi tự khai** (trang yêu thích nằm trong phần JavaScript do AI hỗ trợ), không có log từng dòng.
- **Mâu thuẫn cần xác nhận:** bản nháp báo cáo trước đây ghi sinh viên "chưa từng phải sửa lỗi mã do AI tạo", nhưng nhật ký có prompt báo lỗi favorites. Hai nguồn không khớp — **[CẦN XÁC MINH]** trước khi nộp.

### 4.4. Phần sinh viên tự làm và tỷ lệ AI

| Hạng mục | Người thực hiện (tự khai) | Mức AI | Bằng chứng |
|---|---|---|---|
| HTML | SV1 | SV1 viết, có tham khảo AI | Không có nhật ký từng dòng |
| CSS | SV1 | SV1 viết, có tham khảo AI | Không có nhật ký từng dòng |
| JavaScript | AI (Qoder) | Phần lớn | Commit/PR; mức sinh viên đọc và sửa: **[CẦN XÁC MINH]** |
| Dữ liệu mẫu | AI | 8 sản phẩm, 7 nghệ nhân trong `js/data.js` | Đã đếm trong `js/data.js` (15 bản ghi) |
| Hình ảnh | Canva | Chưa rõ có dùng công cụ tạo ảnh AI hay không | Nguồn/giấy phép: **[CẦN XÁC MINH]** |
| Tài liệu | AI soạn, SV1 duyệt | README, screen inventory, user flow, báo cáo này | Một số tài liệu đã commit |
| Kiểm thử | SV1 | AI không thay thế kiểm thử | Sinh viên tự khai đã chạy 9 trang; video OBS chưa có trong repo |
| Git/GitHub | AI thao tác theo yêu cầu | SV1 quyết định phạm vi | PR review phải do người thật; chưa hoàn tất |

**Tỷ lệ:** không đưa ra phần trăm. Repository không lưu nhật ký phân tách từng dòng, nên mọi con số % sẽ là bịa. Nếu giảng viên yêu cầu, trả lời: "Em chỉ có thể khai theo hạng mục; HTML/CSS em viết, phần lớn JavaScript do AI hỗ trợ, em đọc và kiểm tra lại; em chưa có công cụ đo tỷ lệ chính xác."

## 5. Kiểm tra tĩnh ngày 2026-10-26

Đã tìm trong toàn bộ `.js`, `.html`, `.css` của nhánh `main`:

- `fetch(`, `XMLHttpRequest`, `openai`, `gemini`, `anthropic`, `api_key`, `Authorization`, `Bearer`, `sk-`: **0 kết quả**.
- Toàn bộ thẻ `<script src="...">` trỏ tới file cục bộ trong `js/`; không có CDN hoặc thư viện ngoài.
- Không có backend; dữ liệu giỏ hàng/yêu thích/brief nằm trong `localStorage` hoặc `sessionStorage` của trình duyệt.
- Đây là **kiểm tra tĩnh**, không thay thế việc theo dõi tab Network khi chạy thử.

## 6. Giới hạn và việc cần làm trước khi nộp

- [ ] Dán bảng mục 2 vào `docs/ai-usage-report.md` của repo nhóm; thay mục "SV1: chưa khai".
- [ ] Đối chiếu mẫu khai báo AI chính thức của học phần — **[CẦN XÁC MINH]**.
- [ ] Xác nhận phạm vi dùng ChatGPT và Claude — **[CẦN XÁC MINH]**.
- [ ] Xác nhận nguồn và giấy phép ảnh lấy từ Canva — **[CẦN XÁC MINH]**.
- [ ] Quay đủ 6 video OBS theo `videos/README.md`; dán link và thời lượng thật.
- [ ] Chốt với nhóm việc sửa các tên AI trong `screen-inventory.md` cho khớp mã (AI Personalization, AI Visual Matcher, AI Proposal Evaluator).
- [ ] Chốt việc đổi tên file theo chuẩn `role-function-action.html` — đây là quyết định của cả nhóm, không đổi riêng lẻ.
- [ ] Không tuyên bố đã kiểm thử hoặc đã có review nếu chưa thực sự chạy.

## 7. Câu trả lời mẫu khi bảo vệ

**Hỏi: Sản phẩm của em có AI thật không?**
> "Dạ không. Sản phẩm không gọi API AI và không có API key. Hai chỗ có nhãn AI là CraftLink AI và bản tóm tắt brief, nhưng cả hai chạy bằng luật cục bộ trong JavaScript. Em ghi rõ điều này trong báo cáo và trong chính phần đầu file `js/ai-advisor.js`."

**Hỏi: Vì sao em không dùng AI thật?**
> "Đề bài yêu cầu HTML/CSS/JavaScript thuần, không backend, không API phức tạp. Em chọn mô phỏng bằng luật cục bộ để vẫn minh họa được luồng AI UX, nhưng không giả vờ là mô hình AI. Nếu dùng AI thật, phải có backend giữ API key và xử lý dữ liệu người dùng."

**Hỏi: AI đã giúp gì và em đã kiểm chứng thế nào?**
> "Em dùng Qoder để viết phần lớn JavaScript và soạn tài liệu. Em đọc lại mã, chạy các trang và báo lỗi khi phát hiện sai — ví dụ lỗi trang yêu thích bị trống khi bỏ hết sản phẩm. Em không có nhật ký đo tỷ lệ phần trăm, nên báo cáo chỉ khai theo hạng mục."

**Hỏi: `artisan-suggestions.html` có phải AI không?**
> "Dạ không. Trang đó là bộ lọc tiêu chí cục bộ. Chính câu chữ trong trang ghi 'chưa kết nối mô hình AI tạo sinh', và điểm trên thẻ là số tiêu chí khớp, không phải xác suất AI. Em không khai trang này là AI."

## 8. Bản dán vào mục 3.1 — báo cáo nhóm

Thay bảng **“3.1 SV1 — Khách hàng”** trong `docs/ai-usage-report.md` của repo nhóm bằng bảng dưới, rồi xóa câu “Hai mục dưới đây vẫn đang trống” ở đầu mục 3.

| Hạng mục | Nội dung SV1 khai | Dữ kiện kiểm chứng trong repo | Trạng thái |
|---|---|---|---|
| Công cụ AI đã dùng khi làm bài | **Qoder** — viết/sửa mã, soạn tài liệu, thao tác Git theo yêu cầu. **ChatGPT** và **Claude** — sinh viên tự khai có dùng thêm; phạm vi chi tiết chưa có nhật ký. Phiên bản công cụ: **[CẦN XÁC MINH]**. | Commit/PR trong repo cá nhân và repo nhóm; không có nhật ký prompt đầy đủ trong repo | **đã khai một phần** — còn phiên bản và phạm vi ChatGPT/Claude |
| Prompt tiêu biểu | (1) 2026-10-11: “Nhiệm vụ của tôi là xây dựng giao diện trang dành cho NGƯỜI MUA bằng HTML, CSS và JavaScript thuần. … Không yêu cầu backend, database, framework hoặc API phức tạp.” (2) 2026-10-15: “bạn hãy tạo lại link favorites cho tôi tại link cũ khi tôi bấm hủy hết phần yêu thích thì nó mất hết ản phẩm” [sic]. (3) 2026-10-24: “Tôi muốn bổ sung một tính năng AI giúp người dùng mô tả nhu cầu của mình, sau đó nhận được tư vấn và gợi ý sản phẩm hoặc thợ thủ công phù hợp. **Yêu cầu quan trọng nhất:** Chỉ bổ sung tính năng AI vào giao diện hiện có. Không thiết kế lại website, không thay đổi bố cục hiện tại và không tự ý sửa các chức năng đang hoạt động.” | Nhật ký phiên làm việc Qoder trên máy sinh viên; **không nằm trong repository** | **đã khai** — người chấm không mở lại được toàn bộ log |
| Phần AI sinh trong mã | `js/ai-advisor.js` (toàn bộ trợ lý tìm kiếm cục bộ); phần `buildSummary` / `runSummary` trong `js/main.js` (bản tóm tắt brief); phần lớn JavaScript còn lại và các tài liệu `docs/` do AI soạn, SV1 đọc lại và sửa. HTML/CSS do SV1 viết, có tham khảo AI. | `js/ai-advisor.js`; `js/main.js:1495`, `:1531`; `docs/` | **đã khai** — tỷ lệ phần trăm chính xác **[CẦN XÁC MINH]** |
| AI sai ở đâu, sửa thế nào | **Lỗi trạng thái rỗng trang yêu thích:** bỏ hết sản phẩm yêu thích thì lưới bị ẩn nhưng khối “Chưa có sản phẩm yêu thích” không hiện. Sửa bằng `#favorites-empty` trong `favorites.html:90-93` và tính `isEmpty` trong `js/main.js:1282-1284` để ẩn lưới, hiện khối rỗng. | Prompt báo lỗi 2026-10-15; mã sửa đã đọc trực tiếp | **đã khai** — việc lỗi do AI sinh là suy luận từ phạm vi, không có log từng dòng |
| Chế độ AI trong sản phẩm | **Bộ quy tắc cục bộ, không gọi mô hình.** CraftLink AI và bản tóm tắt brief đều chạy bằng luật JavaScript. `artisan-suggestions.html` không phải AI. Không có API key, không có `fetch` ra ngoài. | `js/ai-advisor.js` dòng 4-5 ghi “KHÔNG phải AI tạo sinh và KHÔNG gọi API bên ngoài”; `artisan-suggestions.html:61` ghi “chưa kết nối mô hình AI tạo sinh” | **đã khai** |

> Sau khi dán, đổi các ô **“chưa khai”** trong mục 3.1 thành **“đã khai”** và cập nhật lại câu mở đầu mục 3. Không khai AI Personalization, AI Visual Matcher hoặc AI Proposal Evaluator vì repo không có mã tương ứng.
