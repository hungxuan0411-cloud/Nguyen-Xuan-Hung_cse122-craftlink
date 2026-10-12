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

/* ---------- 10. Khởi động ---------- */
// Script nằm ở cuối <body> nên toàn bộ HTML đã được tải xong khi chạy.
// Mỗi hàm init tự kiểm tra trang hiện tại có thành phần tương ứng không,
// nên có thể gọi an toàn trên cả 8 trang.

updateCartBadge();    // badge giỏ hàng trên header — chạy ở mọi trang
initProductList();    // chỉ có tác dụng ở trang danh sách sản phẩm
initProductDetail();  // chỉ có tác dụng ở trang chi tiết sản phẩm
initCartPage();       // chỉ có tác dụng ở trang giỏ hàng
initFavoriteButton(); // chỉ có tác dụng ở trang chi tiết sản phẩm
initFavoritesPage();  // chỉ có tác dụng ở trang yêu thích
