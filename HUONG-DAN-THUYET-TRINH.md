# HƯỚNG DẪN THUYẾT TRÌNH — CraftLink (CSE122)

> File này là **tài liệu ôn tập cá nhân**, không nằm trong website.
> Cách dùng: đọc Phần A để nắm tổng quan → Phần B để quay video → Phần C–D để trả lời khi giảng viên hỏi code → Phần E kiểm tra lần cuối trước khi nộp.

---

## PHẦN A — TỔNG QUAN NHANH (nắm trong 5 phút)

**Đề tài:** CraftLink — sàn thương mại điện tử sản phẩm sáng tạo tùy biến (đồ thủ công, nghệ nhân).

**Trang chính đã thực hiện:** Danh sách sản phẩm — `index.html` (theo thiết kế P7 trên Canva).

**Ngoài ra còn 7 trang hoàn thiện luồng người mua:**
`product-detail.html` (chi tiết SP) → `customize.html` (tạo brief AI) → `artisan-suggestions.html` (gợi ý nghệ nhân) → `cart.html`, `favorites.html`, `orders.html`, `order-details.html`.

**Công nghệ:** HTML5 + CSS3 + JavaScript thuần — **không** framework, **không** backend, **không** database.

**Dữ liệu:** 8 sản phẩm mẫu trong `js/data.js`. Giỏ hàng / yêu thích / nháp lưu bằng `localStorage` (bộ nhớ của trình duyệt).

**Nguyên tắc trung thực:** mọi thao tác như đặt hàng, gửi brief… chỉ xử lý trong trình duyệt. Giao diện ghi rõ "bản demo chưa gửi đến máy chủ / nghệ nhân" — vì đề **không yêu cầu** backend.

---

## PHẦN B — KỊCH BẢN VIDEO ~3 PHÚT (theo đúng 5 mục của đề)

### 1. Giới thiệu (~30 giây)
- "Em xin giới thiệu đề tài nhóm em là CraftLink — sàn thương mại điện tử cho sản phẩm thủ công có thể tùy biến theo yêu cầu."
- "Phần em thực hiện là **trang Danh sách sản phẩm** (`index.html`) — trang chính, dành cho **người mua**."
- "Trang giúp người mua: xem toàn bộ sản phẩm của sàn, tìm kiếm, lọc theo danh mục — phong cách — giá — thời gian làm, và sắp xếp theo nhu cầu."

### 2. Figma/Canva (~30 giây)
- Mở link Canva: https://www.canva.com/design/DAHWyBVvS6U/eyYrsvv49jN-26FeiXk-Aw/edit — *(mở đúng slide P7 — Danh sách sản phẩm)*
- Chỉ 4 khối chính: **header** (logo + menu + icon giỏ hàng), **khung tìm kiếm**, **sidebar bộ lọc bên trái**, **lưới sản phẩm bên phải**.
- "Thiết kế theo phong cách tối giản, tông kem — cam đất của đồ thủ công."

### 3. Sản phẩm (~30 giây)
- Mở `index.html` bằng trình duyệt (hoặc Live Server trong VS Code — có thanh địa chỉ đẹp hơn).
- "Giao diện giữ đúng bố cục, màu sắc và typography của bản thiết kế Canva."

### 4. Giải thích mã nguồn (~60 giây) — mở VS Code
- **HTML (20s):** mở `index.html` — "Trang dùng semantic HTML: `header` chứa logo và `nav` điều hướng, `main` chứa nội dung, bên trong có `section` cho bộ lọc dạng `form` (label + input + select), mỗi sản phẩm là một `article` trong `li`…"
- **CSS (20s):** mở `css/style.css` — "Đầu file em khai báo biến màu trong `:root` để dùng thống nhất. Bố cục trang dùng CSS Grid: `.catalog` chia 2 cột sidebar + lưới sản phẩm. Cuối file có phần Responsive với các mốc 1100px, 960px, 720px, 540px."
- **JS (20s):** mở `js/main.js` — "Toàn bộ JavaScript nằm ở file này. Hàm chính của trang chính là `initProductList()`: đọc từ khóa, kiểm tra từng thẻ sản phẩm với 5 điều kiện lọc, sắp xếp và cập nhật giao diện."

### 5. Demo (~30 giây) — thao tác theo thứ tự này
1. Gõ `chau` vào ô tìm kiếm → "Chậu cây mini mộc" hiện ra dù gõ **không dấu** (nhấn mạnh điểm này!).
2. Gõ `gom moc` → lọc theo tên nghệ nhân.
3. Chọn danh mục "Đồ gốm" + kéo thanh giá → số kết quả giảm dần.
4. Đổi sắp xếp "Đánh giá cao" → sản phẩm 5 sao lên đầu.
5. Bấm "Xóa bộ lọc" → về đủ 8 sản phẩm.
6. (Tùy thời gian) Mở 1 sản phẩm → thêm vào giỏ → icon giỏ hàng tăng số, mở giỏ hàng thấy sản phẩm vừa thêm.
7. (Tùy chọn, ghi điểm) Mở DevTools → tab Console → "không có lỗi nào".

**Tên video nộp:** `CSE122-GK-SVxx-NguyenXuanHung-DanhSachSanPham` (thay SVxx bằng số thứ tự của bạn).

---

## PHẦN C — GIẢI THÍCH MÃ NGUỒN TRANG CHÍNH (index.html)

### C1. Cấu trúc HTML
```
header.site-header     → logo CraftLink + nav (5 liên kết) + icon giỏ hàng có badge
main.container
  ├── nav.breadcrumb   → điều hướng Trang chủ
  ├── section.page-heading → tiêu đề "Khám phá sản phẩm" + ô tìm kiếm (form role="search")
  └── div.catalog      (CSS Grid 2 cột)
        ├── aside.filters        → form bộ lọc: radio danh mục, checkbox phong cách,
        │                          thanh trượt giá, checkbox thời gian, nút Xóa bộ lọc
        └── section: toolbar     → đếm kết quả + select sắp xếp
              ul.product-grid    → 8 thẻ sản phẩm (li > article)
              div.empty-state    → thông báo khi không có kết quả (ẩn sẵn)
footer.site-footer     → 3 cột giới thiệu + liên kết + bản quyền
```
- Cuối `<body>`: `<script src="js/data.js"></script>` rồi `<script src="js/main.js"></script>` — thứ tự quan trọng vì `main.js` dùng mảng `CRAFTLINK_PRODUCTS` của `data.js`.

### C2. CSS chính (css/style.css)
- **Biến màu `:root`** — vd `--color-primary: #d97706` (cam), `--color-bg: #faf6ef` (kem). Đổi 1 chỗ là đổi cả trang.
- **Layout `.catalog`**: `display: grid; grid-template-columns: 260px 1fr` — sidebar lọc trái, lưới sản phẩm phải.
- **Lưới `.product-grid`**: `grid-template-columns: repeat(4, 1fr)` trên desktop.
- **Responsive (Media Query)** — giải thích khi bị hỏi "responsive ở đâu?":
  - ≤1100px: lưới còn 3 cột.
  - ≤960px: bỏ 2 cột catalog, bộ lọc chuyển lên trên thành 2 cột.
  - ≤720px: lưới 2 cột, menu điều hướng xuống hàng riêng.
  - ≤540px: lưới 1 cột, bộ lọc 1 cột, footer 1 cột.
- **Hiệu ứng `:hover`**: thẻ sản phẩm nổi lên (đổi `box-shadow`), nút đổi màu.
- **Thuộc tính `hidden`**: cuối file có quy tắc `[hidden] { display: none }` cho các phần tử JS ẩn/hiện (vì một số phần tử có `display` riêng sẽ đè mất `hidden` mặc định của trình duyệt).

### C3. JavaScript hàm chính của trang chính — `initProductList()`
Chạy khi mở trang; thoát ngay nếu trang không có `#product-grid` (nhờ vậy file dùng chung cho 8 trang được).

1. **Gom phần tử:** `searchInput`, các input lọc, `sortSelect`, `emptyState`… bằng `getElementById`.
2. **`normalizeText(text)`** — chuyển chữ thường, bỏ dấu tiếng Việt:
   `"Cốc Gốm" → "coc gom"` — nhờ đó gõ không dấu vẫn tìm được. Cách làm: `.toLowerCase()`, chuẩn hóa `NFD` rồi xóa các dấu, và thay `đ → d`.
3. **`cardMatches(card)`** — trả về `true/false`: thẻ sản phẩm phải khớp **tất cả** điều kiện đang chọn:
   (1) từ khóa khớp tên SP hoặc tên nghệ nhân — so sánh sau khi `normalizeText` cả hai vế;
   (2) danh mục radio; (3) giá ≤ mức thanh trượt; (4) phong cách — khớp bất kỳ lựa chọn nào; (5) thời gian làm — quy tắc tương tự.
4. **`sortCards()`** — sao chép mảng thẻ rồi `sort()` theo giá tăng/giảm, đánh giá, hoặc trả về thứ tự gốc ("Phổ biến" — đã lưu index vào `data-order` lúc đầu).
5. **`applyCatalog()`** — "hàm trung tâm": gọi `cardMatches` cho từng thẻ để ẩn/hiện (`card.hidden = true/false`), gọi `sortCards()`, cập nhật số kết quả, dòng tóm tắt điều kiện lọc, và ẩn/hiện khối "không có kết quả".
6. **Gắn sự kiện:** `input` cho ô tìm kiếm, `input` cho form lọc (phủ radio/checkbox/thanh giá), `change` cho sắp xếp, `submit` chặn Enter làm tải lại trang, `click` cho nút Xóa bộ lọc.

**Ý tưởng cốt lõi cần nói khi thuyết trình:** *giao diện luôn được vẽ lại từ điều kiện đang chọn thông qua một hàm trung tâm `applyCatalog()`* — không sửa giao diện rải rác từng nơi, nên khó phát sinh lỗi lệch trạng thái.

---

## PHẦN D — CHEAT SHEET js/main.js (16 mục — hỏi gì trả lời đó)

| # | Tên | Làm gì | Nếu xóa thì sao |
|---|-----|--------|-----------------|
| 1 | Hằng số | Khóa localStorage, `MAX_QTY = 99`, dữ liệu mẫu | Giỏ/yêu thích không có chỗ lưu — lỗi ngay |
| 2 | `findProduct`, `formatPrice` | Tìm SP theo id; định dạng giá `Intl.NumberFormat("vi-VN")` → "240.000₫" | Giá hiện số trần "240000" |
| 3 | `readJson`/`writeJson`, `readCart`… | Đọc/ghi localStorage, **tự sửa dữ liệu hỏng**, giới hạn số lượng 1–99, gộp trùng id | Đọc dữ liệu bẩn → trang vỡ |
| 4 | `updateCartBadge()` | Cộng tổng số lượng hiện lên icon giỏ ở mọi trang | Badge đứng yên, không đồng bộ |
| 5 | `showToast()` | Hộp thông báo đáy màn hình, tự ẩn sau 2,5s | Không có phản hồi khi bấm nút |
| 6 | `initProductList()` | **Trang chính:** tìm/lọc/sắp xếp (xem Phần C3) | Trang vẫn hiện 8 SP nhưng mọi nút lọc vô tác dụng |
| 7 | `initProductDetail()` | Trang chi tiết: nút tăng/giảm số lượng, thêm vào giỏ (cộng dồn nếu trùng) | Không thêm được vào giỏ |
| 8 | `initCartPage()` | Giỏ hàng: vẽ danh sách từ dữ liệu, tăng/giảm/xóa, tính tổng (bấm 1 lần cho cả danh sách — ủy quyền sự kiện) | Giỏ trống trơn |
| 9 | `initFavoriteButton()` + `initFavoritesPage()` | Trái tim bật/tắt (aria-pressed); trang yêu thích vẽ lưới từ localStorage | Không lưu được yêu thích |
| 10 | `initProductGallery()` | Bấm ảnh nhỏ → đổi ảnh lớn, đổi viền active | Ảnh nhỏ bấm không phản hồi |
| 11 | `initCustomizePage()` | Form brief: đếm ký tự, nhắc khi trống, mô phỏng AI phân tích 1,2s, ẩn/hiện kết quả, lưu nháp | Form gửi đi mà không có gì xảy ra |
| 12 | `initOrdersPage()` | Đơn hàng: tab trạng thái, tìm kiếm, lọc 7/30 ngày, hủy đơn có xác nhận | Bảng đơn hàng là ảnh tĩnh |
| 13 | `initOrderDetailsPage()` | Lưu nháp yêu cầu chỉnh sửa, mở lại trang tự khôi phục | Nội dung gõ ra mất khi tải lại |
| 14 | `initArtisanSuggestionsPage()` | Bỏ qua ẩn thẻ nghệ nhân; Tạo lại hiện cả 3 thẻ | Hai nút không làm gì |
| 15 | `initInactiveFeatures()` | Các nút chưa có trang (Tin nhắn, Tài khoản, link chân trang) → toast "bản demo chưa hỗ trợ" | Bấm nút không có phản hồi, nhìn như lỗi |
| 16 | Khởi động | Gọi lần lượt 12 hàm init ở cuối file | Trang không có tương tác nào |

**Vài khái niệm có thể bị hỏi:**
- **`localStorage`**: bộ nhớ nhỏ trong trình duyệt, lưu dạng chuỗi — dùng `JSON.stringify/parse` để lưu mảng/đối tượng. Có nó giỏ hàng mới **giữ nguyên khi chuyển trang, tải lại**.
- **Ủy quyền sự kiện (event delegation)**: thay vì gắn sự kiện cho từng nút, gắn **1 listener cho phần tử cha** rồi dùng `event.target.closest()` tìm nút được bấm. Cần thiết vì danh sách (giỏ, yêu thích, đơn) được **vẽ lại động** — gắn từng nút sẽ mất khi vẽ lại.
- **`textContent` thay vì `innerHTML`**: dữ liệu hiển thị lấy từ JS thì dùng `textContent` để **không chèn HTML lạ** — an toàn hơn.
- **`<template>` + `cloneNode(true)`**: mẫu thẻ sản phẩm nằm trong HTML, JS nhân bản rồi điền dữ liệu — gọn hơn tự ghép chuỗi HTML.
- **Mô phỏng AI (setTimeout)**: dự án **chưa có backend AI** (đề không yêu cầu) — nên "AI phân tích" chỉ là `setTimeout` 1,2 giây cho có trải nghiệm chờ. Đây là điểm nên **chủ động nói rõ** khi thuyết trình.

---

## PHẦN E — CÂU HỎI GIẢNG VIÊN HAY HỎI + TRẢ LỜI MẪU

1. **"Đoạn code này làm gì?"**
   → Chỉ vào tên hàm + dòng chú thích ngay trên nó (toàn bộ main.js được chú thích tiếng Việt theo mục). Nói theo công thức: *"Hàm này chạy khi…, nó đọc…, rồi làm…"*.

2. **"Vì sao dùng cách này?"**
   → Ví dụ trả lời cho ủy quyền sự kiện: *"Vì danh sách được JavaScript vẽ lại sau mỗi thao tác, nếu gắn sự kiện trực tiếp cho từng nút thì khi vẽ lại các listener sẽ mất. Gắn ở phần tử cha thì luôn hoạt động."*

3. **"Nếu xóa đoạn code này thì điều gì xảy ra?"**
   → Dùng cột cuối Phần D. Ví dụ: xóa `initProductList()` khỏi phần khởi động → trang vẫn hiện đủ 8 sản phẩm (vì HTML có sẵn) nhưng gõ tìm kiếm/kéo lọc không có gì xảy ra.

4. **"JavaScript này được kích hoạt khi nào?"**
   → Hai lớp: (a) các hàm `init` chạy **một lần khi tải trang** (script đặt cuối `<body>` nên HTML đã sẵn sàng); (b) các tương tác chạy **khi có sự kiện**: `click`, `input`, `submit`, `change`.

5. **"Responsive được xử lý ở đâu?"**
   → Cuối `css/style.css`, mục "Responsive" — 4 media query 1100 → 960 → 720 → 540px (xem Phần C2). Nêu 1 ví dụ mình nhớ chắc: *"dưới 960px bố cục 2 cột của `.catalog` chuyển thành 1 cột, bộ lọc đẩy lên trên."*

6. **"Vì sao không có backend?"**
   → *"Đề không yêu cầu, và em muốn đúng phạm vi. Dữ liệu demo lưu `localStorage`; mọi thông báo ghi rõ 'bản demo chưa gửi đến máy chủ' để không gây hiểu nhầm sản phẩm đã hoàn thiện."* — trả lời này thể hiện sự trung thực, giảng viên đánh giá cao.

7. **"File `main.js` dùng cho cả 8 trang, sao không lỗi?"**
   → *"Mỗi hàm `init` mở đầu bằng việc kiểm tra phần tử đặc trưng của trang (`if (!grid) return;`). Trang nào không có phần tử đó thì hàm thoát ngay — nên 1 file dùng chung an toàn."*

**Mẹo sửa lỗi cơ bản khi demo (phòng khi có sự cố):**
- Trang không load được JS → mở DevTools (F12) → Console, đọc dòng lỗi đỏ (số dòng trong `main.js`).
- Sản phẩm/giỏ "lạ" do dữ liệu cũ → Console gõ: `localStorage.clear()` rồi tải lại — dữ liệu mẫu sẽ tự nạp lại.

---

## PHẦN F — CHECKLIST TRƯỚC KHI NỘP

- [ ] **Link Canva** (Figma): https://www.canva.com/design/DAHWyBVvS6U/eyYrsvv49jN-26FeiXk-Aw/edit
- [ ] **Link GitHub:** https://github.com/hungxuan0411-cloud/Nguyen-Xuan-Hung_cse122-craftlink
- [ ] **Link video:** quay xong → dán link vào `README.md` mục "Video trình bày" (thay dòng "Chưa bổ sung liên kết.") rồi commit.
- [ ] Video đặt tên: `CSE122-GK-SVxx-NguyenXuanHung-DanhSachSanPham`
- [ ] Trong video có: Figma → sản phẩm chạy → source code → demo tương tác (đủ 5 mục).
- [ ] Thử trước khi quay: mở Chrome/Edge → F12 → Console **không có lỗi đỏ**.
- [ ] Nộp 3 link đúng biểu mẫu của lớp.

**Bảng chức năng JS đã làm — đối chiếu checklist đề bài:** tìm kiếm ✓ · lọc dữ liệu ✓ · chuyển tab ✓ · hiện/ẩn nội dung ✓ · validation form ✓ · thêm dữ liệu (giỏ) ✓ · xóa dữ liệu ✓ · thay đổi trạng thái (hủy đơn, yêu thích) ✓ · render từ mảng JavaScript ✓ · toggle ✓ — tất cả đều là tương tác có ý nghĩa nghiệp vụ, không phải hiệu ứng trang trí.
