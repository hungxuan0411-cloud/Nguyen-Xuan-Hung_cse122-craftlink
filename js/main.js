/* ==========================================================================
   main.js — JavaScript dùng chung cho các trang người mua CraftLink
   --------------------------------------------------------------------------
   Giai đoạn 1 (hạ tầng nền):
     1. Hằng số: khóa localStorage, dữ liệu mẫu ban đầu
     2. Hàm tiện ích: tìm sản phẩm, định dạng giá tiền
     3. Đọc/ghi localStorage có kiểm tra dữ liệu hỏng
     4. Cập nhật badge số lượng trên icon giỏ hàng
     5. Hộp thông báo (toast)

   Giai đoạn 2 (trang danh sách sản phẩm):
     6. Tìm kiếm không dấu + lọc theo danh mục/giá/phong cách + sắp xếp

   Giai đoạn 3 (giỏ hàng):
     7. Trang chi tiết sản phẩm: chọn số lượng và thêm vào giỏ
     8. Trang giỏ hàng: vẽ danh sách, tăng/giảm số lượng, xóa, tổng tiền

   Giai đoạn 4 (yêu thích):
     9. Nút trái tim ở trang chi tiết + trang danh sách yêu thích

   Giai đoạn 5 (các tương tác còn lại):
    10. Trang chi tiết: bấm ảnh nhỏ để đổi ảnh lớn trong thư viện
    11. Trang tạo brief: đếm ký tự + mô phỏng AI phân tích + lưu nháp
    12. Trang đơn hàng: tab trạng thái, tìm kiếm, lọc thời gian, hủy đơn
    13. Trang chi tiết đơn: lưu nháp yêu cầu chỉnh sửa
    14. Trang gợi ý nghệ nhân: bỏ qua / tạo lại gợi ý
    15. Phản hồi trung thực cho các nút chưa có trong bản demo

   File này được nhúng ở cuối <body> của cả 8 trang (sau data.js).
   Mọi thao tác với phần tử đều KIỂM TRA PHẦN TỬ CÓ TỒN TẠI trước,
   vì mỗi trang chỉ chứa một phần các thành phần giao diện.
   ========================================================================== */

/* ---------- 1. Hằng số ---------- */

// Khóa lưu dữ liệu trong localStorage (đặt tiền tố "craftlink_" để tránh trùng)
const CART_KEY = "craftlink_cart";
const FAVORITES_KEY = "craftlink_favorites";

// Khóa lưu BẢN NHÁP do người dùng tạo (brief ở trang tùy biến,
// yêu cầu chỉnh sửa ở trang chi tiết đơn). Đây là dữ liệu của RIÊNG
// trình duyệt này — dự án chưa có máy chủ để gửi đi cho nghệ nhân.
const BRIEF_DRAFT_KEY = "craftlink_brief_draft";
const REVISION_DRAFT_KEY = "craftlink_revision_draft";

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

/* ---------- 7. Trang chi tiết sản phẩm (product-detail.html) ---------- */

// Trang chi tiết trong thiết kế (P8) hiển thị một sản phẩm mẫu là Cốc gốm lá nâu.
const DETAIL_PRODUCT_ID = "coc-gom-la-nau";

// Nút tăng/giảm số lượng và nút "Thêm vào giỏ hàng".
// Chỉ chạy khi trang hiện tại có nút thêm vào giỏ.
function initProductDetail() {
  const addBtn = document.getElementById("add-to-cart-btn");
  if (!addBtn) {
    return; // trang này không phải chi tiết sản phẩm
  }

  const product = findProduct(DETAIL_PRODUCT_ID);
  const qtyValue = document.getElementById("qty-value");
  const decreaseBtn = document.getElementById("qty-decrease");
  const increaseBtn = document.getElementById("qty-increase");

  // Số lượng hiển thị luôn nằm trong khoảng 1..MAX_QTY
  decreaseBtn.addEventListener("click", function () {
    const qty = Number(qtyValue.textContent);
    if (qty > 1) {
      qtyValue.textContent = qty - 1;
    }
  });

  increaseBtn.addEventListener("click", function () {
    const qty = Number(qtyValue.textContent);
    if (qty < MAX_QTY) {
      qtyValue.textContent = qty + 1;
    }
  });

  addBtn.addEventListener("click", function () {
    const qty = Number(qtyValue.textContent);
    const cart = readCart();
    const existing = cart.find(function (item) {
      return item.id === product.id;
    });

    if (existing) {
      // Sản phẩm đã có trong giỏ -> cộng dồn số lượng, không vượt MAX_QTY
      existing.qty = Math.min(existing.qty + qty, MAX_QTY);
    } else {
      cart.push({ id: product.id, qty: qty });
    }

    writeCart(cart);
    updateCartBadge(); // badge trên icon giỏ hàng cập nhật ngay
    qtyValue.textContent = 1; // đưa bộ chọn về 1 sau khi thêm
    showToast("Đã thêm " + qty + " sản phẩm vào giỏ hàng.");
  });
}

/* ---------- 8. Trang giỏ hàng (cart.html) ---------- */

// Vẽ danh sách sản phẩm trong giỏ từ localStorage và xử lý
// tăng / giảm số lượng, xóa sản phẩm, tính tổng tiền.
function initCartPage() {
  const cartList = document.getElementById("cart-list");
  if (!cartList) {
    return; // trang này không phải giỏ hàng
  }

  const template = document.getElementById("cart-item-template");
  const emptyState = document.getElementById("cart-empty");
  const summary = document.querySelector(".cart-summary");
  const layout = document.querySelector(".cart-layout");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  // Vẽ lại toàn bộ danh sách từ dữ liệu. Mỗi thao tác (tăng/giảm/xóa)
  // đều sửa dữ liệu rồi gọi lại hàm này nên giao diện luôn khớp dữ liệu.
  function renderCart() {
    const cart = readCart();

    cartList.textContent = ""; // xóa các dòng cũ trước khi vẽ lại

    let subtotal = 0;
    cart.forEach(function (item) {
      const product = findProduct(item.id);
      const row = template.content.firstElementChild.cloneNode(true);

      row.dataset.id = product.id; // dùng để biết đang thao tác với sản phẩm nào

      const nameLink = row.querySelector(".cart-item-name a");
      nameLink.textContent = product.name; // textContent an toàn
      nameLink.href = "product-detail.html";

      const img = row.querySelector("img");
      img.src = product.image;
      img.alt = product.name;

      row.querySelector(".cart-item-artisan").textContent = "Nghệ nhân " + product.artisan;
      row.querySelector(".cart-item-price").textContent = formatPrice(product.price);
      row.querySelector(".qty-value").textContent = item.qty;
      row.querySelector(".cart-item-subtotal").textContent = formatPrice(product.price * item.qty);

      subtotal += product.price * item.qty;
      cartList.appendChild(row);
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);

    // Giỏ trống: ẩn danh sách và phần tóm tắt, hiện lời nhắn thay thế
    const isEmpty = cart.length === 0;
    cartList.hidden = isEmpty;
    summary.hidden = isEmpty;
    emptyState.hidden = !isEmpty;
    layout.classList.toggle("cart-layout-empty", isEmpty);
  }

  // Một listener duy nhất cho cả danh sách (ủy quyền sự kiện):
  // nút nào được bấm thì đọc data-action của nút đó.
  cartList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      return;
    }

    const row = button.closest(".cart-item");
    const id = row.dataset.id;
    const cart = readCart();
    const item = cart.find(function (entry) {
      return entry.id === id;
    });
    if (!item) {
      return;
    }

    const action = button.dataset.action;
    if (action === "increase") {
      if (item.qty >= MAX_QTY) {
        return; // đã đạt số lượng tối đa
      }
      item.qty += 1;
    } else if (action === "decrease") {
      if (item.qty <= 1) {
        return; // giảm đến 1 là dừng; muốn bỏ hẳn thì bấm nút "Xóa"
      }
      item.qty -= 1;
    } else if (action === "remove") {
      const index = cart.indexOf(item);
      cart.splice(index, 1);
      showToast("Đã xóa " + findProduct(id).name + " khỏi giỏ hàng.");
    }

    writeCart(cart);
    updateCartBadge();
    renderCart();
  });

  renderCart(); // vẽ danh sách ngay khi mở trang
}

/* ---------- 9. Yêu thích ---------- */

// Nút trái tim ở trang chi tiết sản phẩm: bấm để thêm/bỏ yêu thích.
// Trạng thái nút được đọc lại từ localStorage nên mở lại trang vẫn đúng.
function initFavoriteButton() {
  const button = document.getElementById("favorite-btn");
  if (!button) {
    return; // trang này không phải chi tiết sản phẩm
  }

  const product = findProduct(DETAIL_PRODUCT_ID);

  // Đồng bộ trạng thái nút với dữ liệu đang lưu. Thuộc tính aria-pressed
  // vừa giúp trình đọc màn hình biết trạng thái, vừa được CSS dùng để
  // tô trái tim đặc khi sản phẩm đã nằm trong yêu thích.
  function syncButton() {
    const isFavorite = readFavorites().includes(product.id);
    button.setAttribute("aria-pressed", String(isFavorite));
  }

  button.addEventListener("click", function () {
    const favorites = readFavorites();
    const index = favorites.indexOf(product.id);

    if (index === -1) {
      favorites.push(product.id);
      showToast("Đã thêm " + product.name + " vào yêu thích.");
    } else {
      favorites.splice(index, 1);
      showToast("Đã bỏ " + product.name + " khỏi yêu thích.");
    }

    writeFavorites(favorites);
    syncButton();
  });

  syncButton(); // cập nhật ngay khi mở trang
}

// Trang danh sách yêu thích: vẽ lưới sản phẩm từ các id trong localStorage.
function initFavoritesPage() {
  const grid = document.getElementById("favorites-grid");
  if (!grid) {
    return; // trang này không phải danh sách yêu thích
  }

  const template = document.getElementById("favorite-card-template");
  const emptyState = document.getElementById("favorites-empty");

  function renderFavorites() {
    const favorites = readFavorites();

    grid.textContent = ""; // xóa các thẻ cũ trước khi vẽ lại

    favorites.forEach(function (id) {
      const product = findProduct(id);
      const card = template.content.firstElementChild.cloneNode(true);

      card.dataset.id = product.id; // dùng khi bấm "Bỏ yêu thích"

      const mediaLink = card.querySelector(".product-media");
      mediaLink.href = "product-detail.html";

      const img = card.querySelector("img");
      img.src = product.image;
      img.alt = product.name;

      const nameLink = card.querySelector(".product-name a");
      nameLink.textContent = product.name; // textContent an toàn
      nameLink.href = "product-detail.html";

      card.querySelector(".product-artisan").textContent = product.artisan;
      card.querySelector(".product-price").textContent = formatPrice(product.price);
      // toFixed(1) để điểm 5 hiển thị "5.0" đúng như thiết kế
      card.querySelector(".rating-value").textContent = product.rating.toFixed(1);
      card.querySelector(".rating-count").textContent = "(" + product.reviewCount + ")";

      const noteEl = card.querySelector(".product-note");
      if (product.note) {
        noteEl.textContent = product.note;
      } else {
        noteEl.remove(); // sản phẩm không có ghi chú thì bỏ hẳn dòng này
      }

      grid.appendChild(card);
    });

    // Không còn sản phẩm nào: ẩn lưới, hiện lời nhắn thay thế
    const isEmpty = favorites.length === 0;
    grid.hidden = isEmpty;
    emptyState.hidden = !isEmpty;
  }

  // Ủy quyền sự kiện: một listener cho cả lưới, nút nào bấm thì xử lý nút đó
  grid.addEventListener("click", function (event) {
    const button = event.target.closest(".btn-remove-favorite");
    if (!button) {
      return;
    }

    const card = button.closest(".product-card");
    const id = card.dataset.id;
    const favorites = readFavorites().filter(function (entry) {
      return entry !== id;
    });

    writeFavorites(favorites);
    showToast("Đã bỏ " + findProduct(id).name + " khỏi yêu thích.");
    renderFavorites();
  });

  renderFavorites(); // vẽ danh sách ngay khi mở trang
}

/* ---------- 10. Thư viện ảnh ở trang chi tiết sản phẩm ---------- */

// Bấm vào ảnh nhỏ trong #gallery-thumbs thì ảnh lớn #gallery-main-img
// đổi theo ảnh nhỏ đó. Ảnh lấy từ chính thẻ <img> bên trong nút,
// không cần thêm dữ liệu gì trong HTML.
function initProductGallery() {
  const mainImg = document.getElementById("gallery-main-img");
  const thumbs = document.getElementById("gallery-thumbs");
  if (!mainImg || !thumbs) {
    return; // trang này không phải chi tiết sản phẩm
  }

  const buttons = Array.from(thumbs.querySelectorAll(".thumb-btn"));

  // Ủy quyền sự kiện: một listener cho cả dãy ảnh nhỏ
  thumbs.addEventListener("click", function (event) {
    const button = event.target.closest(".thumb-btn");
    if (!button) {
      return;
    }

    const thumbImg = button.querySelector("img");
    mainImg.src = thumbImg.src;
    mainImg.alt = "Ảnh sản phẩm " + (buttons.indexOf(button) + 1);

    // Đánh dấu ảnh nhỏ đang được chọn (CSS tô viền)
    buttons.forEach(function (item) {
      item.classList.toggle("active", item === button);
    });
  });
}

/* ---------- 11. Trang tạo brief (customize.html) ---------- */

// Bàn giao diện AI tạo brief cho sản phẩm tùy biến.
// LƯU Ý trung thực: dự án chưa có máy chủ AI thật, nên phần "phân tích"
// ở đây chỉ là mô phỏng bằng setTimeout cho sinh động khi thuyết trình.
function initCustomizePage() {
  const form = document.getElementById("brief-form");
  if (!form) {
    return; // trang này không phải trang tạo brief
  }

  const description = document.getElementById("brief-description");
  const charCount = document.getElementById("char-count");
  const note = document.getElementById("brief-note");
  const status = document.getElementById("ai-status");
  const submitBtn = document.getElementById("ai-brief-btn");
  const editBtn = document.getElementById("edit-brief-btn");
  const rejectBtn = document.getElementById("reject-brief-btn");
  const regenerateBtn = document.getElementById("regenerate-brief-btn");
  const saveBtn = document.getElementById("save-brief-btn");

  // Các khối giao diện của "kết quả AI" — ẩn/hiện cùng nhau
  const resultParts = [
    document.getElementById("brief-result"),
    document.querySelector(".brief-section-title"),
    document.querySelector(".ai-explain"),
    document.querySelector(".brief-actions")
  ].filter(function (part) {
    return part !== null; // chỉ giữ phần tử thực sự có trên trang
  });

  function setResultVisible(visible) {
    resultParts.forEach(function (part) {
      part.hidden = !visible;
    });
  }

  // Trạng thái ban đầu: chưa có kết quả, chưa hiện cảnh báo
  status.hidden = true;
  note.hidden = true;
  setResultVisible(false);

  // Đếm ký tự đang gõ để người dùng biết còn bao nhiêu chỗ (maxlength 1000)
  description.addEventListener("input", function () {
    charCount.textContent = description.value.length;
  });

  let analyzing = false; // chặn bấm chồng khi đang "phân tích"

  // Mô phỏng quá trình AI phân tích: hiện trạng thái chờ ~1,2 giây
  // rồi hiện lại khối kết quả và báo xong.
  function runAnalysis(doneMessage) {
    if (analyzing) {
      return;
    }
    analyzing = true;

    setResultVisible(false);
    note.hidden = true;
    status.hidden = false; // hiện "AI đang phân tích..."
    submitBtn.disabled = true;

    setTimeout(function () {
      analyzing = false;
      submitBtn.disabled = false;
      status.hidden = true;
      setResultVisible(true); // hiện kết quả brief
      showToast(doneMessage);
    }, 1200);
  }

  // Gửi form: kiểm tra còn trống thì nhắc, hợp lệ thì chạy mô phỏng
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // chặn tải lại trang

    if (description.value.trim() === "") {
      note.hidden = false; // hiện dòng nhắc màu đỏ có sẵn trong HTML
      description.focus();
      return;
    }

    runAnalysis("AI đã tạo brief đề xuất cho bạn.");
  });

  // "Chỉnh sửa": đưa con trỏ về ô mô tả để gõ lại
  if (editBtn) {
    editBtn.addEventListener("click", function () {
      description.focus();
    });
  }

  // "Từ chối": ẩn khối kết quả, người dùng có thể tạo lại
  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      setResultVisible(false);
      showToast("Đã từ chối brief đề xuất. Bạn có thể tạo lại bất cứ lúc nào.");
    });
  }

  // "Tạo lại": chạy mô phỏng phân tích thêm một lần nữa
  if (regenerateBtn) {
    regenerateBtn.addEventListener("click", function () {
      runAnalysis("Đã tạo lại brief đề xuất (mô phỏng).");
    });
  }

  // "Lưu brief": lưu bản nháp vào trình duyệt — KHÔNG gửi đến máy chủ
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      writeJson(BRIEF_DRAFT_KEY, { description: description.value });
      showToast("Đã lưu brief trên trình duyệt này (bản demo chưa gửi đến máy chủ).");
    });
  }
}

/* ---------- 12. Trang đơn hàng (orders.html) ---------- */

// Lọc bảng đơn hàng theo tab trạng thái, từ khóa và khoảng thời gian.
// Mỗi dòng <tr> mang sẵn data-status và data-date để việc lọc chỉ là
// so sánh thuộc tính — không cần đọc nội dung ô.
function initOrdersPage() {
  const tbody = document.getElementById("orders-table-body");
  if (!tbody) {
    return; // trang này không phải danh sách đơn hàng
  }

  const tabs = document.getElementById("order-tabs");
  const searchInput = document.getElementById("order-search");
  const timeFilter = document.getElementById("order-time-filter");
  const tableScroll = document.querySelector(".table-scroll");
  const emptyState = document.getElementById("orders-empty");

  const rows = Array.from(tbody.querySelectorAll("tr"));
  let currentStatus = "all"; // tab đang chọn

  // Một đơn có khớp với TẤT CẢ điều kiện đang lọc hay không
  function orderMatches(row) {
    // 1. Trạng thái: tab "all" thì bỏ qua điều kiện này
    if (currentStatus !== "all" && row.dataset.status !== currentStatus) {
      return false;
    }

    // 2. Từ khóa: tìm theo mã đơn và tên nghệ nhân (gõ không dấu vẫn được)
    const keyword = normalizeText(searchInput.value);
    if (keyword !== "") {
      const code = row.querySelector(".order-code").textContent;
      const artisan = row.querySelector(".order-artisan span").textContent;
      if (!normalizeText(code + " " + artisan).includes(keyword)) {
        return false;
      }
    }

    // 3. Thời gian: so ngày đặt đơn với mốc hiện tại.
    // Lưu ý: dữ liệu mẫu là đơn của năm 2025 nên khi lọc 7/30 ngày
    // gần đây sẽ không có kết quả — đây là hành vi đúng của bộ lọc.
    const range = timeFilter.value;
    if (range !== "all") {
      const days = range === "last-7-days" ? 7 : 30;
      const limit = Date.now() - days * 24 * 60 * 60 * 1000;
      if (new Date(row.dataset.date).getTime() < limit) {
        return false;
      }
    }

    return true;
  }

  // Hàm trung tâm: áp mọi điều kiện rồi cập nhật hiển thị
  function applyOrderFilters() {
    let visibleCount = 0;
    rows.forEach(function (row) {
      const show = orderMatches(row);
      row.hidden = !show;
      if (show) {
        visibleCount += 1;
      }
    });

    // Không còn đơn nào khớp: ẩn bảng, hiện lời nhắn thay thế
    tableScroll.hidden = visibleCount === 0;
    emptyState.hidden = visibleCount > 0;
  }

  // Bấm tab: đổi tab đang chọn rồi lọc lại
  if (tabs) {
    tabs.addEventListener("click", function (event) {
      const button = event.target.closest(".tab-btn");
      if (!button) {
        return;
      }

      currentStatus = button.dataset.status;
      tabs.querySelectorAll(".tab-btn").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
      applyOrderFilters();
    });
  }

  // Ô tìm kiếm: lọc ngay khi gõ; chặn Enter làm tải lại trang
  searchInput.addEventListener("input", applyOrderFilters);
  searchInput.form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  if (timeFilter) {
    timeFilter.addEventListener("change", applyOrderFilters);
  }

  // Hủy đơn: xác nhận trước, sau đó chỉ đổi giao diện trên bản demo
  // (dự án chưa có máy chủ nên không thao tác lên đơn hàng thật).
  tbody.addEventListener("click", function (event) {
    const button = event.target.closest(".btn-cancel-order");
    if (!button) {
      return;
    }

    const row = button.closest("tr");
    const code = row.querySelector(".order-code").textContent;
    const confirmed = confirm("Hủy đơn hàng " + code + "? Thao tác này chỉ thay đổi trên bản demo.");

    if (!confirmed) {
      return;
    }

    row.dataset.status = "cancelled"; // để bộ lọc tab biết trạng thái mới
    const badge = row.querySelector(".badge");
    badge.className = "badge badge-cancelled";
    badge.textContent = "Đã hủy";
    button.hidden = true; // đơn đã hủy thì không còn nút hủy

    applyOrderFilters();
    showToast("Đã hủy đơn hàng " + code + " (mô phỏng trên bản demo).");
  });

  applyOrderFilters(); // đồng bộ giao diện ngay khi mở trang
}

/* ---------- 13. Trang chi tiết đơn (order-details.html) ---------- */

// Nút "Gửi yêu cầu chỉnh sửa": kiểm tra nội dung rồi lưu NHÁP vào
// trình duyệt. Dự án chưa có máy chủ nên thông báo nói rõ là chưa gửi đi.
function initOrderDetailsPage() {
  const sendBtn = document.getElementById("send-revision-btn");
  if (!sendBtn) {
    return; // trang này không phải chi tiết đơn
  }

  const noteInput = document.getElementById("revision-note");

  // Mở lại trang thì khôi phục nháp đã lưu lần trước (nếu có)
  const draft = readJson(REVISION_DRAFT_KEY, null);
  if (draft && typeof draft.content === "string") {
    noteInput.value = draft.content;
  }

  sendBtn.addEventListener("click", function () {
    const content = noteInput.value.trim();

    if (content === "") {
      showToast("Vui lòng nhập nội dung chỉnh sửa trước khi gửi.");
      noteInput.focus();
      return;
    }

    writeJson(REVISION_DRAFT_KEY, { content: content });
    showToast("Đã lưu nháp trên trình duyệt — bản demo chưa gửi đến nghệ nhân.");
  });
}

/* ---------- 14. Trang gợi ý nghệ nhân (artisan-suggestions.html) ---------- */

// "Bỏ qua" một gợi ý sẽ ẩn thẻ nghệ nhân đó; "Tạo lại" hiện lại tất cả.
// Đây là mô phỏng vì chưa có máy chủ AI thật để sinh gợi ý mới.
function initArtisanSuggestionsPage() {
  const list = document.querySelector(".artisan-list");
  if (!list) {
    return; // trang này không phải trang gợi ý nghệ nhân
  }

  const cards = Array.from(list.querySelectorAll(".artisan-suggestion-card"));

  // Ủy quyền sự kiện cho cả danh sách: nút có id bắt đầu bằng "skip-"
  // hoặc "regenerate-" thì xử lý theo tiền tố đó.
  list.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    if (button.id.startsWith("skip-")) {
      const card = button.closest(".artisan-suggestion-card");
      const name = card.querySelector(".artisan-name-lg").textContent;
      card.hidden = true;
      showToast("Đã bỏ qua gợi ý từ " + name + ".");
    } else if (button.id.startsWith("regenerate-")) {
      cards.forEach(function (card) {
        card.hidden = false;
      });
      showToast("Đã tạo lại danh sách gợi ý nghệ nhân (mô phỏng).");
    }
  });
}

/* ---------- 15. Phản hồi trung thực cho các nút chưa có trong bản demo ---------- */

// Một số liên kết/nút thuộc phạm vi khác của đồ án (đăng nhập, tin nhắn,
// trợ giúp...) chưa có trang tương ứng. Thay vì để bấm vào không có gì
// xảy ra, các nút này hiện toast nói rõ đây là bản demo.
function initInactiveFeatures() {
  document.addEventListener("click", function (event) {
    // 1. Liên kết chân trang chưa có trang đích (href="#")
    const deadLink = event.target.closest('a[href="#"]');
    if (deadLink) {
      event.preventDefault();
      showToast("Bản demo chưa hỗ trợ chức năng này.");
      return;
    }

    // 2. Nút icon trên header: Tin nhắn, Tài khoản
    const iconButton = event.target.closest(".header-actions button.icon-btn");
    if (iconButton) {
      const label = iconButton.getAttribute("aria-label") || "này";
      showToast("Chức năng " + label + " chưa có trong bản demo.");
      return;
    }

    // 3. Nút "Báo cáo listing" ở trang chi tiết sản phẩm
    const reportBtn = event.target.closest("#report-listing-btn");
    if (reportBtn) {
      showToast("Bản demo chưa hỗ trợ gửi báo cáo listing.");
    }
  });
}

/* ---------- 16. Khởi động ---------- */
// Script nằm ở cuối <body> nên toàn bộ HTML đã được tải xong khi chạy.
// Mỗi hàm init tự kiểm tra trang hiện tại có thành phần tương ứng không,
// nên có thể gọi an toàn trên cả 8 trang.

updateCartBadge();             // badge giỏ hàng trên header — chạy ở mọi trang
initProductList();             // chỉ có tác dụng ở trang danh sách sản phẩm
initProductDetail();           // chỉ có tác dụng ở trang chi tiết sản phẩm
initCartPage();                // chỉ có tác dụng ở trang giỏ hàng
initFavoriteButton();          // chỉ có tác dụng ở trang chi tiết sản phẩm
initFavoritesPage();           // chỉ có tác dụng ở trang yêu thích
initProductGallery();          // chỉ có tác dụng ở trang chi tiết sản phẩm
initCustomizePage();           // chỉ có tác dụng ở trang tạo brief
initOrdersPage();              // chỉ có tác dụng ở trang đơn hàng
initOrderDetailsPage();        // chỉ có tác dụng ở trang chi tiết đơn
initArtisanSuggestionsPage();  // chỉ có tác dụng ở trang gợi ý nghệ nhân
initInactiveFeatures();        // chạy ở mọi trang (các nút chưa có chức năng)
