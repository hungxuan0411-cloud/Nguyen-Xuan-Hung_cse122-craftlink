/* ==========================================================================
   main.js — JavaScript dùng chung cho các trang người mua CraftLink
   --------------------------------------------------------------------------
   Giai đoạn 1 (hạ tầng nền):
     1. Hằng số: khóa localStorage, dữ liệu mẫu ban đầu
     2. Hàm tiện ích: tìm sản phẩm, định dạng giá tiền
     3. Đọc/ghi localStorage có kiểm tra dữ liệu hỏng
     4. Cập nhật badge số lượng trên icon giỏ hàng
     5. Hộp thông báo (toast)

   File này được nhúng ở cuối <body> của cả 8 trang (sau data.js).
   Mọi thao tác với phần tử đều KIỂM TRA PHẦN TỬ CÓ TỒN TẠI trước,
   vì mỗi trang chỉ chứa một phần các thành phần giao diện.
   ========================================================================== */

/* ---------- 1. Hằng số ---------- */

// Khóa lưu dữ liệu trong localStorage (đặt tiền tố "craftlink_" để tránh trùng)
const CART_KEY = "craftlink_cart";
const FAVORITES_KEY = "craftlink_favorites";

// Số lượng tối đa cho một sản phẩm trong giỏ
const MAX_QTY = 99;

// Dữ liệu mẫu cho lần truy cập đầu tiên.
// Giống như trang Đơn hàng đang hiển thị 4 đơn mẫu — đây là dữ liệu demo
// vì dự án chưa có máy chủ (backend).
const SAMPLE_CART = [
  { id: "coc-gom-la-nau", qty: 2 },
  { id: "bo-am-tra", qty: 1 },
  { id: "chau-cay-mini", qty: 1 }
];
const SAMPLE_FAVORITES = ["binh-gom-van-la", "dia-men-lam", "chuong-gio-gom", "bo-am-tra"];

/* ---------- 2. Hàm tiện ích ---------- */

// Tìm sản phẩm theo id trong mảng dữ liệu chung (data.js).
// Trả về undefined nếu không tìm thấy.
function findProduct(id) {
  return CRAFTLINK_PRODUCTS.find(function (product) {
    return product.id === id;
  });
}

// Định dạng giá tiền kiểu Việt Nam: 240000 -> "240.000₫"
const priceFormatter = new Intl.NumberFormat("vi-VN");

function formatPrice(number) {
  return priceFormatter.format(number) + "₫";
}

/* ---------- 3. Đọc / ghi localStorage có kiểm tra dữ liệu ---------- */

// Đọc một giá trị JSON từ localStorage.
// Nếu dữ liệu hỏng (không chuyển được thành JSON) thì trả về giá trị
// dự phòng thay vì làm vỡ trang.
function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Đọc giỏ hàng từ localStorage. Quy tắc:
// - Lần đầu truy cập (chưa có dữ liệu) -> nạp SAMPLE_CART.
// - Dữ liệu hỏng / sai định dạng -> bỏ qua mục sai, giữ mục hợp lệ.
// - Số lượng luôn được giới hạn trong khoảng 1..MAX_QTY.
// - Sau khi đọc xong, ghi lại bản đã làm sạch để dữ liệu luôn đúng.
function readCart() {
  if (localStorage.getItem(CART_KEY) === null) {
    const sample = SAMPLE_CART.map(function (item) {
      return { id: item.id, qty: item.qty };
    });
    writeJson(CART_KEY, sample);
    return sample;
  }

  const parsed = readJson(CART_KEY, []);
  const cart = [];
  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      const product = item && findProduct(item.id);
      const qty = item && item.qty;
      if (!product || !Number.isInteger(qty) || qty < 1) {
        continue; // bỏ qua mục không hợp lệ
      }
      // Nếu dữ liệu bị lặp cùng id thì cộng dồn số lượng vào mục đã có
      const existing = cart.find(function (entry) {
        return entry.id === item.id;
      });
      if (existing) {
        existing.qty = Math.min(existing.qty + qty, MAX_QTY);
      } else {
        cart.push({ id: item.id, qty: Math.min(qty, MAX_QTY) });
      }
    }
  }
  writeJson(CART_KEY, cart);
  return cart;
}

function writeCart(cart) {
  writeJson(CART_KEY, cart);
}

// Đọc danh sách yêu thích (mảng id sản phẩm).
// Bỏ qua id không tồn tại trong data.js và id bị lặp.
function readFavorites() {
  if (localStorage.getItem(FAVORITES_KEY) === null) {
    const sample = SAMPLE_FAVORITES.slice();
    writeJson(FAVORITES_KEY, sample);
    return sample;
  }

  const parsed = readJson(FAVORITES_KEY, []);
  const favorites = [];
  if (Array.isArray(parsed)) {
    for (const id of parsed) {
      if (typeof id === "string" && findProduct(id) && !favorites.includes(id)) {
        favorites.push(id);
      }
    }
  }
  writeJson(FAVORITES_KEY, favorites);
  return favorites;
}

function writeFavorites(favorites) {
  writeJson(FAVORITES_KEY, favorites);
}

/* ---------- 4. Badge số lượng trên icon giỏ hàng ---------- */

// Cộng tổng số lượng trong giỏ rồi hiển thị lên icon giỏ hàng ở header.
// Tất cả 8 trang đều gọi hàm này nên badge luôn đồng bộ giữa các trang.
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) {
    return; // trang này không có icon giỏ hàng
  }

  const cart = readCart();
  let total = 0;
  for (const item of cart) {
    total += item.qty;
  }

  badge.textContent = total; // textContent an toàn, không dùng innerHTML
  badge.hidden = total === 0;
}

/* ---------- 5. Hộp thông báo (toast) ---------- */

let toastTimer = null;

// Hiện một thông báo ngắn ở đáy màn hình rồi tự ẩn sau 2,5 giây.
// Phần tử toast được tạo bằng JS nên không cần sửa HTML của 8 trang.
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status"); // trình đọc màn hình sẽ đọc thông báo
    document.body.appendChild(toast);
  }

  toast.textContent = message; // textContent an toàn với mọi nội dung
  toast.classList.add("toast-show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("toast-show");
  }, 2500);
}

/* ---------- 6. Trang danh sách sản phẩm (index.html) ---------- */

// Chuẩn hóa chuỗi để tìm kiếm: chữ thường, bỏ dấu, gộp khoảng trắng.
// "Cốc Gốm" -> "coc gom" — giúp gõ không dấu vẫn tìm được.
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ các dấu thanh
    .replace(/đ/g, "d") // chữ đ không tách dấu được bằng NFD
    .replace(/\s+/g, " ")
    .trim();
}

// Toàn bộ logic tìm kiếm / lọc / sắp xếp của trang danh sách sản phẩm.
// Chỉ chạy khi trang có lưới sản phẩm (#product-grid).
function initProductList() {
  const grid = document.getElementById("product-grid");
  if (!grid) {
    return; // trang này không phải danh sách sản phẩm
  }

  const cards = Array.from(grid.querySelectorAll(".product-card"));
  if (cards.length === 0) {
    return;
  }

  const searchInput = document.getElementById("search-input");
  const filterForm = document.getElementById("filter-form");
  const priceRange = document.getElementById("price-range");
  const priceOutput = document.getElementById("price-output");
  const sortSelect = document.getElementById("sort-select");
  const countEl = document.getElementById("product-count");
  const filterSummary = document.getElementById("filter-summary");
  const sortSummary = document.getElementById("sort-summary");
  const emptyState = document.getElementById("empty-state");
  const pagination = document.getElementById("pagination");
  const resetBtn = document.getElementById("reset-filters-btn");

  // Lưu thứ tự ban đầu của từng thẻ để sắp xếp "Phổ biến" trả về đúng thứ tự này
  cards.forEach(function (card, index) {
    card.dataset.order = index;
  });

  // Phân trang chỉ có ý nghĩa khi danh sách trải nhiều trang; dữ liệu mẫu chỉ
  // có 8 sản phẩm (1 trang) nên ẩn đi để tránh nút bấm không có tác dụng.
  if (pagination) {
    pagination.hidden = true;
  }

  // Một sản phẩm có khớp với TẤT CẢ điều kiện đang chọn hay không
  function cardMatches(card) {
    // 1. Từ khóa: so với tên sản phẩm và tên nghệ nhân
    const keyword = normalizeText(searchInput.value);
    if (keyword !== "") {
      const name = card.querySelector(".product-name").textContent;
      const artisan = card.querySelector(".product-artisan").textContent;
      if (!normalizeText(name + " " + artisan).includes(keyword)) {
        return false;
      }
    }

    // 2. Danh mục (radio chỉ chọn được 1)
    const categoryInput = filterForm.querySelector('input[name="category"]:checked');
    if (categoryInput && categoryInput.value !== "all" && card.dataset.category !== categoryInput.value) {
      return false;
    }

    // 3. Khoảng giá: giá sản phẩm không vượt quá mức đang kéo
    if (Number(card.dataset.price) > Number(priceRange.value)) {
      return false;
    }

    // 4. Phong cách: nếu chọn nhiều thì khớp BẤT KỲ phong cách nào
    const checkedStyles = filterForm.querySelectorAll('input[name="style"]:checked');
    if (checkedStyles.length > 0) {
      const cardStyles = card.dataset.style.split(" ");
      const hasAnyStyle = Array.from(checkedStyles).some(function (input) {
        return cardStyles.includes(input.value);
      });
      if (!hasAnyStyle) {
        return false;
      }
    }

    // 5. Thời gian hoàn thành: quy tắc giống phong cách
    const checkedLeads = filterForm.querySelectorAll('input[name="lead-time"]:checked');
    if (checkedLeads.length > 0) {
      const hasAnyLead = Array.from(checkedLeads).some(function (input) {
        return card.dataset.leadTime === input.value;
      });
      if (!hasAnyLead) {
        return false;
      }
    }

    return true;
  }

  // Sắp xếp thứ tự hiển thị theo lựa chọn trong #sort-select
  function sortCards() {
    const mode = sortSelect.value;
    const sorted = cards.slice(); // bản sao để sắp xếp, không đổi mảng gốc

    if (mode === "price-asc") {
      sorted.sort(function (a, b) {
        return Number(a.dataset.price) - Number(b.dataset.price);
      });
    } else if (mode === "price-desc") {
      sorted.sort(function (a, b) {
        return Number(b.dataset.price) - Number(a.dataset.price);
      });
    } else if (mode === "rating") {
      sorted.sort(function (a, b) {
        return Number(b.dataset.rating) - Number(a.dataset.rating);
      });
    } else {
      // "popular" = thứ tự ban đầu của cửa hàng
      sorted.sort(function (a, b) {
        return Number(a.dataset.order) - Number(b.dataset.order);
      });
    }

    // Chỉ gắn lại thẻ khi thứ tự thực sự khác (tránh thay đổi DOM thừa)
    let needReorder = false;
    for (let i = 0; i < sorted.length; i++) {
      if (grid.children[i] !== sorted[i]) {
        needReorder = true;
        break;
      }
    }
    if (needReorder) {
      sorted.forEach(function (card) {
        grid.appendChild(card); // appendChild tự chuyển thẻ sang vị trí mới
      });
    }
  }

  // Viết tóm tắt các điều kiện đang áp dụng, ví dụ:
  // "Đồ gốm • Phong cách: Tối giản • Giá đến 500.000₫"
  function buildFilterSummary() {
    const parts = [];

    const categoryInput = filterForm.querySelector('input[name="category"]:checked');
    if (categoryInput) {
      parts.push(categoryInput.parentElement.querySelector("label").textContent.trim());
    }

    const checkedStyles = Array.from(filterForm.querySelectorAll('input[name="style"]:checked'));
    if (checkedStyles.length > 0) {
      const labels = checkedStyles.map(function (input) {
        return input.parentElement.querySelector("label").textContent.trim();
      });
      parts.push("Phong cách: " + labels.join(", "));
    }

    const checkedLeads = Array.from(filterForm.querySelectorAll('input[name="lead-time"]:checked'));
    if (checkedLeads.length > 0) {
      const labels = checkedLeads.map(function (input) {
        return input.parentElement.querySelector("label").textContent.trim();
      });
      parts.push("Thời gian: " + labels.join(", "));
    }

    const maxPrice = Number(priceRange.value);
    if (maxPrice < Number(priceRange.max)) {
      parts.push("Giá đến " + formatPrice(maxPrice));
    }

    return parts.join(" • ");
  }

  // Hàm trung tâm: lọc + sắp xếp + cập nhật mọi thứ hiển thị trên trang
  function applyCatalog() {
    priceOutput.textContent = formatPrice(Number(priceRange.value));

    let visibleCount = 0;
    cards.forEach(function (card) {
      const show = cardMatches(card);
      card.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    sortCards();

    countEl.textContent = visibleCount;
    filterSummary.textContent = buildFilterSummary();
    sortSummary.textContent = sortSelect.options[sortSelect.selectedIndex].textContent;
    emptyState.hidden = visibleCount > 0; // hiện thông báo khi không có kết quả
  }

  // Đưa trang về trạng thái ban đầu khi bấm "Xóa bộ lọc"
  function resetFilters() {
    const allCategory = filterForm.querySelector('input[name="category"][value="all"]');
    if (allCategory) {
      allCategory.checked = true;
    }
    filterForm.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
      box.checked = false;
    });
    priceRange.value = priceRange.max;
    searchInput.value = "";
    sortSelect.value = "popular";
    applyCatalog();
  }

  // Gắn sự kiện — mỗi sự kiện chỉ gắn đúng 1 lần
  searchInput.addEventListener("input", applyCatalog);
  searchInput.form.addEventListener("submit", function (event) {
    event.preventDefault(); // chặn Enter làm tải lại trang
    applyCatalog();
  });
  filterForm.addEventListener("input", applyCatalog); // phủ cả radio, checkbox và thanh giá
  sortSelect.addEventListener("change", applyCatalog);
  if (resetBtn) {
    resetBtn.addEventListener("click", resetFilters);
  }

  applyCatalog(); // đồng bộ giao diện ngay khi mở trang
}

/* ---------- 7. Khởi động ---------- */
// Script nằm ở cuối <body> nên toàn bộ HTML đã được tải xong khi chạy.

updateCartBadge();
initProductList();
