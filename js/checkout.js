/* ==========================================================================
   checkout.js — Trang xác nhận đơn tùy biến (checkout.html)
   --------------------------------------------------------------------------
   Trang này chỉ xử lý MỘT sản phẩm đang tùy biến. Dữ liệu được đọc từ
   sessionStorage (khóa craftlink_checkout_draft) nên:
   - Quay lại / tải lại trang trong cùng tab vẫn giữ thông tin.
   - Đóng tab là mất toàn bộ bản nháp.
   - Không gửi dữ liệu ra máy chủ và không thực hiện thanh toán thật.

   Trang gồm 4 bước:
     1. Xem lại sản phẩm, số lượng, brief, nghệ nhân, tạm tính
     2. Nhập số điện thoại + địa chỉ nhận hàng (kiểm tra ngay trên trang)
     3. Chọn phương thức thanh toán + giao hàng (bắt buộc)
     4. Xác nhận lại toàn bộ thông tin
   Sau khi bấm xác nhận, trang chỉ hiện trạng thái hoàn tất của bản demo.
   ========================================================================== */

(function () {
  const layout = document.getElementById("checkout-layout");
  if (!layout) {
    return; // không phải trang checkout
  }

  const stepsEl = document.getElementById("checkout-steps");
  const stepPanels = Array.from(document.querySelectorAll(".checkout-step-panel"));
  const stepItems = Array.from(document.querySelectorAll(".checkout-step"));
  const emptyState = document.getElementById("checkout-empty");
  const emptyTitle = document.getElementById("checkout-empty-title");
  const emptyText = document.getElementById("checkout-empty-text");
  const emptyCustomize = document.getElementById("checkout-empty-customize");
  const emptyArtisan = document.getElementById("checkout-empty-artisan");
  const summaryEl = document.getElementById("checkout-summary");
  const completePanel = document.getElementById("checkout-complete");

  const deliveryForm = document.getElementById("delivery-form");
  const phoneInput = document.getElementById("delivery-phone");
  const addressInput = document.getElementById("delivery-address");
  const phoneError = document.getElementById("phone-error");
  const addressError = document.getElementById("address-error");

  const optionsForm = document.getElementById("options-form");
  const paymentError = document.getElementById("payment-error");
  const shippingError = document.getElementById("shipping-error");

  let draft = readCheckoutDraft();
  let product = draft ? findProduct(draft.productId) : null;
  let artisan = draft ? findArtisanById(draft.artisanId) : null;

  function setError(errorEl, input, message) {
    errorEl.textContent = message;
    errorEl.hidden = message === "";
    input.setAttribute("aria-invalid", message === "" ? "false" : "true");
  }

  function showEmpty(title, text, showCustomize, showArtisan) {
    layout.hidden = true;
    stepsEl.hidden = true;
    emptyState.hidden = false;
    emptyTitle.textContent = title;
    emptyText.textContent = text;
    emptyCustomize.hidden = !showCustomize;
    emptyArtisan.hidden = !showArtisan;
  }

  function getTotal() {
    return product.price * draft.qty;
  }

  function renderSummary() {
    document.getElementById("summary-product").textContent = product.name;
    document.getElementById("summary-artisan").textContent = artisan.name;
    document.getElementById("summary-qty").textContent = draft.qty;
    document.getElementById("summary-unit-price").textContent = formatPrice(product.price);
    document.getElementById("summary-payment").textContent =
      PAYMENT_LABELS[draft.payment] || "Chưa chọn";
    document.getElementById("summary-shipping-method").textContent =
      SHIPPING_LABELS[draft.shipping] || "Chưa chọn";
    document.getElementById("summary-total").textContent = formatPrice(getTotal());
  }

  // Đưa các bước đã qua sang trạng thái hoàn tất, bước hiện tại nổi bật.
  function updateStepIndicator(step) {
    stepItems.forEach(function (item) {
      const itemStep = Number(item.dataset.step);
      item.classList.toggle("is-active", itemStep === step);
      item.classList.toggle("is-done", itemStep < step);
      if (itemStep === step) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  }

  function fillReviewStep() {
    const reviewImage = document.getElementById("review-product-image");
    reviewImage.src = product.image;
    reviewImage.alt = product.name;

    document.getElementById("review-product-name").textContent = product.name;
    document.getElementById("review-product-meta").textContent =
      (CATEGORY_LABELS[product.category] || "Chưa có thông tin danh mục") +
      " • " + product.artisan;
    document.getElementById("review-product-price").textContent =
      formatPrice(product.price) + " / sản phẩm";
    document.getElementById("review-artisan").textContent = artisan.name;
    document.getElementById("review-qty").textContent = draft.qty;
    document.getElementById("review-brief").textContent = draft.brief;
    document.getElementById("review-lead-time").textContent =
      LEAD_TIME_LABELS[product.leadTime] || "Chưa có thông tin";
    document.getElementById("review-total").textContent =
      formatPrice(getTotal()) + " (chưa gồm phí tùy biến hoặc giao hàng)";
  }

  function fillDeliveryStep() {
    phoneInput.value = draft.delivery.phone;
    addressInput.value = draft.delivery.address;
    setError(phoneError, phoneInput, "");
    setError(addressError, addressInput, "");
  }

  function fillOptionsStep() {
    const payment = optionsForm.querySelector('input[name="payment"][value="' + draft.payment + '"]');
    const shipping = optionsForm.querySelector('input[name="shipping"][value="' + draft.shipping + '"]');
    if (payment) {
      payment.checked = true;
    }
    if (shipping) {
      shipping.checked = true;
    }
    paymentError.hidden = true;
    shippingError.hidden = true;
  }

  function fillConfirmStep() {
    document.getElementById("confirm-product").textContent =
      product.name + " • " + formatPrice(product.price) + " / sản phẩm";
    document.getElementById("confirm-qty").textContent = draft.qty;
    document.getElementById("confirm-artisan").textContent = artisan.name;
    document.getElementById("confirm-brief").textContent = draft.brief;
    document.getElementById("confirm-delivery").textContent =
      draft.delivery.phone + " — " + draft.delivery.address;
    document.getElementById("confirm-payment").textContent =
      PAYMENT_LABELS[draft.payment] || "Chưa chọn";
    document.getElementById("confirm-shipping").textContent =
      SHIPPING_LABELS[draft.shipping] || "Chưa chọn";
    document.getElementById("confirm-total").textContent =
      formatPrice(getTotal()) + " (chưa gồm phí giao hàng)";

    const paymentNote = document.getElementById("confirm-payment-note");
    if (draft.payment === "bank-transfer") {
      paymentNote.textContent = "Bạn chọn chuyển khoản ngân hàng. Bản demo chưa kết nối cổng thanh toán " +
        "và chưa có thông tin tài khoản nhận tiền, nên chưa có giao dịch nào được thực hiện.";
    } else {
      paymentNote.textContent = "Bạn chọn thanh toán khi nhận hàng. Bản demo chưa kết nối đơn vị vận chuyển " +
        "nên chưa có bước thu tiền thực tế.";
    }
  }

  function renderComplete() {
    layout.hidden = false;
    stepsEl.hidden = false;
    summaryEl.hidden = true;
    layout.classList.add("checkout-layout-complete");
    stepPanels.forEach(function (panel) {
      panel.hidden = true;
    });
    completePanel.hidden = false;

    stepItems.forEach(function (item) {
      item.classList.remove("is-active");
      item.classList.add("is-done");
      item.removeAttribute("aria-current");
    });

    document.getElementById("demo-code").textContent = draft.demoCode || "Chưa có mã";
    document.getElementById("complete-product").textContent =
      product.name + " • " + formatPrice(product.price) + " / sản phẩm";
    document.getElementById("complete-artisan").textContent = artisan.name;
    document.getElementById("complete-qty").textContent = draft.qty;
    document.getElementById("complete-delivery").textContent =
      draft.delivery.phone + " — " + draft.delivery.address;
    document.getElementById("complete-payment").textContent =
      PAYMENT_LABELS[draft.payment] || "Chưa chọn";
    document.getElementById("complete-shipping").textContent =
      SHIPPING_LABELS[draft.shipping] || "Chưa chọn";
    document.getElementById("complete-total").textContent =
      formatPrice(getTotal()) + " (chưa gồm phí giao hàng)";
  }

  // Nếu người dùng tải lại ở bước 3/4 nhưng thiếu dữ liệu, đưa về bước
  // cần bổ sung đầu tiên thay vì hiện một trang không thể hoàn tất.
  function getSafeStep(requestedStep) {
    if (requestedStep >= 3 && (!draft.delivery.phone || !draft.delivery.address)) {
      return 2;
    }
    if (requestedStep >= 4 && (!draft.payment || !draft.shipping)) {
      return 3;
    }
    return requestedStep;
  }

  function renderStep(requestedStep, shouldFocus) {
    const step = getSafeStep(requestedStep);
    draft = updateCheckoutDraft({ checkoutStep: step }) || draft;

    stepPanels.forEach(function (panel) {
      panel.hidden = Number(panel.dataset.step) !== step;
    });
    completePanel.hidden = true;
    summaryEl.hidden = false;
    layout.classList.remove("checkout-layout-complete");
    updateStepIndicator(step);
    renderSummary();

    if (step === 1) {
      fillReviewStep();
    } else if (step === 2) {
      fillDeliveryStep();
    } else if (step === 3) {
      fillOptionsStep();
    } else if (step === 4) {
      fillConfirmStep();
    }

    if (shouldFocus) {
      const heading = document.querySelector('.checkout-step-panel[data-step="' + step + '"] .panel-title');
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Kiểm tra số điện thoại Việt Nam: 10 số bắt đầu bằng 0, hoặc +84 + 9 số.
  function normalizePhone(value) {
    return value.replace(/[\s.\-()]/g, "");
  }

  function isValidPhone(value) {
    return /^(0\d{9}|\+84\d{9})$/.test(normalizePhone(value));
  }

  function handleDeliverySubmit(event) {
    event.preventDefault();

    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    let valid = true;

    if (phone === "") {
      setError(phoneError, phoneInput, "Vui lòng nhập số điện thoại.");
      valid = false;
    } else if (!isValidPhone(phone)) {
      setError(phoneError, phoneInput, "Số điện thoại chưa hợp lệ. Dùng 10 số bắt đầu bằng 0 hoặc +84 và 9 số.");
      valid = false;
    } else {
      setError(phoneError, phoneInput, "");
    }

    if (address === "") {
      setError(addressError, addressInput, "Vui lòng nhập địa chỉ nhận hàng.");
      valid = false;
    } else if (address.length < 10) {
      setError(addressError, addressInput, "Địa chỉ quá ngắn. Vui lòng nhập đầy đủ số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.");
      valid = false;
    } else {
      setError(addressError, addressInput, "");
    }

    if (!valid) {
      if (phoneError.hidden === false) {
        phoneInput.focus();
      } else {
        addressInput.focus();
      }
      return;
    }

    draft = updateCheckoutDraft({
      delivery: { phone: phone, address: address }
    }) || draft;
    renderStep(3, true);
  }

  function handleOptionsSubmit(event) {
    event.preventDefault();

    const payment = optionsForm.querySelector('input[name="payment"]:checked');
    const shipping = optionsForm.querySelector('input[name="shipping"]:checked');
    let valid = true;

    if (!payment) {
      paymentError.textContent = "Vui lòng chọn phương thức thanh toán.";
      paymentError.hidden = false;
      valid = false;
    } else {
      paymentError.hidden = true;
    }

    if (!shipping) {
      shippingError.textContent = "Vui lòng chọn phương thức giao hàng.";
      shippingError.hidden = false;
      valid = false;
    } else {
      shippingError.hidden = true;
    }

    if (!valid) {
      return;
    }

    draft = updateCheckoutDraft({
      payment: payment.value,
      shipping: shipping.value
    }) || draft;
    renderStep(4, true);
  }

  function handleConfirm() {
    // Kiểm tra lần cuối trước khi hiện trạng thái hoàn tất của bản demo.
    if (!draft.brief || draft.acceptedBrief !== draft.brief) {
      window.location.href = "customize.html";
      return;
    }
    if (!draft.delivery.phone || !draft.delivery.address) {
      renderStep(2, true);
      return;
    }
    if (!draft.payment || !draft.shipping) {
      renderStep(3, true);
      return;
    }

    const now = new Date();
    draft = writeCheckoutDraft(Object.assign({}, draft, {
      status: "completed",
      demoCode: "CL-DEMO-" + now.getTime().toString(36).toUpperCase(),
      confirmedAt: now.toISOString()
    }));
    if (!draft) {
      return;
    }

    renderComplete();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("Đã ghi nhận xác nhận trên trình duyệt (bản demo, chưa gửi đơn).");
  }

  // Chưa có bản nháp hoặc sản phẩm không còn trong dữ liệu mẫu.
  if (!draft || !product) {
    showEmpty(
      "Chưa có yêu cầu tùy biến",
      "Hãy chọn một sản phẩm và tạo brief trước khi xác nhận đơn.",
      true,
      false
    );
    return;
  }

  // Bắt buộc phải chấp nhận brief trước khi sang checkout.
  if (!draft.brief || draft.acceptedBrief !== draft.brief) {
    showEmpty(
      "Brief chưa được chấp nhận",
      "Hãy quay lại trang tạo brief, tạo bản tóm tắt mới nhất và bấm “Chấp nhận”.",
      true,
      false
    );
    return;
  }

  // Bắt buộc phải chọn nghệ nhân.
  if (!artisan) {
    showEmpty(
      "Chưa chọn nghệ nhân",
      "Hãy quay lại trang gợi ý và chọn một nghệ nhân trước khi xác nhận đơn.",
      false,
      true
    );
    return;
  }

  stepsEl.hidden = false;
  emptyState.hidden = true;
  document.getElementById("review-edit-brief").href = "customize.html";
  document.getElementById("review-change-artisan").href = "artisan-suggestions.html";

  document.getElementById("step1-next").addEventListener("click", function () {
    renderStep(2, true);
  });
  document.getElementById("step2-back").addEventListener("click", function () {
    renderStep(1, true);
  });
  document.getElementById("step3-back").addEventListener("click", function () {
    renderStep(2, true);
  });
  document.getElementById("step4-back").addEventListener("click", function () {
    renderStep(3, true);
  });

  deliveryForm.addEventListener("submit", handleDeliverySubmit);
  optionsForm.addEventListener("submit", handleOptionsSubmit);

  // Lưu ngay khi gõ để quay lại bước trước hoặc tải lại vẫn còn dữ liệu.
  phoneInput.addEventListener("input", function () {
    draft = updateCheckoutDraft({ delivery: { phone: phoneInput.value } }) || draft;
    if (!phoneError.hidden) {
      setError(phoneError, phoneInput, "");
    }
  });

  addressInput.addEventListener("input", function () {
    draft = updateCheckoutDraft({ delivery: { address: addressInput.value } }) || draft;
    if (!addressError.hidden) {
      setError(addressError, addressInput, "");
    }
  });

  optionsForm.addEventListener("change", function (event) {
    const input = event.target;
    if (input.name === "payment") {
      draft = updateCheckoutDraft({ payment: input.value }) || draft;
      paymentError.hidden = true;
    } else if (input.name === "shipping") {
      draft = updateCheckoutDraft({ shipping: input.value }) || draft;
      shippingError.hidden = true;
    }
    renderSummary();
  });

  document.getElementById("confirm-order-btn").addEventListener("click", handleConfirm);

  document.getElementById("restart-btn").addEventListener("click", function () {
    clearCheckoutDraft();
    window.location.href = "index.html";
  });

  if (draft.status === "completed") {
    renderComplete();
  } else {
    layout.hidden = false;
    renderStep(draft.checkoutStep || 1, false);
  }
})();
