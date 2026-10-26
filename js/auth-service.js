(() => {
  let accessToken = null;

  const getConfig = () => window.CRAFTLINK_AUTH || {};
  const getBaseUrl = () => String(getConfig().supabaseUrl || "").trim().replace(/\/+$/, "");
  const getAnonKey = () => String(getConfig().supabaseAnonKey || "").trim();

  class AuthError extends Error {
    constructor(code, message, status = 0, details = null) {
      super(message);
      this.name = "AuthError";
      this.code = code;
      this.status = status;
      this.details = details;
    }
  }

  const messages = {
    CONFIG_MISSING: "Chưa cấu hình Supabase. Mở js/auth-config.js và điền supabaseUrl cùng supabaseAnonKey.",
    USER_NOT_FOUND: "Nếu email đã được đăng ký, link đặt lại mật khẩu sẽ được gửi.",
    LINK_EXPIRED: "Link đặt lại mật khẩu đã hết hạn hoặc đã được sử dụng. Vui lòng gửi lại link mới.",
    LINK_INVALID: "Link đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu link mới.",
    RATE_LIMITED: "Bạn đã yêu cầu quá nhiều lần. Vui lòng chờ một lúc rồi thử lại.",
    WEAK_PASSWORD: "Mật khẩu chưa đáp ứng yêu cầu bảo mật của hệ thống.",
    SESSION_EXPIRED: "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng bắt đầu lại.",
    EMAIL_NOT_VERIFIED: "Email chưa được xác nhận. Vui lòng liên hệ quản trị viên.",
    SERVICE_ERROR: "Dịch vụ xác thực đang gặp sự cố. Vui lòng thử lại sau.",
    NETWORK: "Không thể kết nối tới dịch vụ xác thực. Kiểm tra mạng rồi thử lại.",
    UNKNOWN: "Không thể hoàn tất yêu cầu. Vui lòng thử lại.",
  };

  const isConfigured = () => Boolean(getBaseUrl() && getAnonKey());

  function ensureConfigured() {
    if (!isConfigured()) throw new AuthError("CONFIG_MISSING", messages.CONFIG_MISSING);
  }

  const normalizeMessage = (body, fallback) => {
    const value = body && (body.msg || body.message || body.error_description || body.error);
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  };

  function classifyError(status, body) {
    const code = String(body?.error_code || body?.code || body?.error || "").toLowerCase();
    const text = `${code} ${normalizeMessage(body, "").toLowerCase()}`;

    if (status === 429 || /rate.?limit|too many|over_email/.test(text)) return "RATE_LIMITED";
    if (/signups? not allowed|user not found|no user found|user.*does not exist|email.*not.*registered|account.*not.*found/.test(text)) return "USER_NOT_FOUND";
    if (/email.*not.*confirmed|email.*not.*verified/.test(text)) return "EMAIL_NOT_VERIFIED";
    if (/weak_password|password.*(weak|short|characters|length|strength)/.test(text)) return "WEAK_PASSWORD";
    if (/session.*(missing|expired|not found)|jwt.*expired|invalid.*jwt|refresh.*token/.test(text)) return "SESSION_EXPIRED";
    if (status === 401 || status === 403) return "SESSION_EXPIRED";
    if (status >= 500) return "SERVICE_ERROR";
    return "UNKNOWN";
  }

  function parseJson(text) {
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return { message: text.slice(0, 300) };
    }
  }

  async function request(path, { method = "POST", body, auth = false } = {}) {
    ensureConfigured();
    if (auth && !accessToken) throw new AuthError("SESSION_EXPIRED", messages.SESSION_EXPIRED);

    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      apikey: getAnonKey(),
      "X-Supabase-Api-Version": "2024-01-01",
      Authorization: `Bearer ${auth ? accessToken : getAnonKey()}`,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let response;
    try {
      response = await fetch(`${getBaseUrl()}/auth/v1${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      throw new AuthError("NETWORK", messages.NETWORK, 0, error);
    } finally {
      clearTimeout(timeout);
    }

    const data = parseJson(await response.text());
    if (!response.ok) {
      const code = classifyError(response.status, data);
      throw new AuthError(code, messages[code] || messages.UNKNOWN, response.status, data);
    }
    return data;
  }

  const getRedirectUrl = () => `${window.location.origin}${window.location.pathname}`;

  async function requestMagicLink(email) {
    if (window.location.protocol === "file:") {
      throw new AuthError(
        "CONFIG_MISSING",
        "Hãy mở trang qua http://localhost:5500, không dùng địa chỉ file://."
      );
    }

    return request(`/otp?redirect_to=${encodeURIComponent(getRedirectUrl())}`, {
      body: { email, create_user: false },
    });
  }

  function readSessionFromUrl() {
    const rawHash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    if (!rawHash || (!rawHash.includes("access_token=") && !rawHash.includes("error="))) {
      return { session: null, error: null };
    }

    const params = new URLSearchParams(rawHash);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    if (params.get("error")) {
      const errorCode = String(params.get("error_code") || params.get("error") || "").toLowerCase();
      const description = String(params.get("error_description") || "").toLowerCase();
      const expired = /otp_expired|expired|access_denied/.test(`${errorCode} ${description}`);
      return { session: null, error: expired ? "LINK_EXPIRED" : "LINK_INVALID" };
    }

    const token = params.get("access_token");
    if (!token) return { session: null, error: "LINK_INVALID" };

    accessToken = token;
    return { session: { accessToken: token }, error: null };
  }

  async function updatePassword(password) {
    try {
      return await request("/user", { method: "PUT", body: { password }, auth: true });
    } catch (error) {
      if (error instanceof AuthError && (error.status === 401 || error.status === 403)) {
        throw new AuthError("SESSION_EXPIRED", messages.SESSION_EXPIRED, error.status, error.details);
      }
      throw error;
    }
  }

  async function signOut() {
    if (!isConfigured() || !accessToken) {
      accessToken = null;
      return;
    }

    const token = accessToken;
    accessToken = null;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      await fetch(`${getBaseUrl()}/auth/v1/logout?scope=global`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          apikey: getAnonKey(),
          Authorization: `Bearer ${token}`,
          "X-Supabase-Api-Version": "2024-01-01",
        },
        signal: controller.signal,
      });
    } catch {
      // Token đã bị xóa khỏi bộ nhớ; lỗi mạng không được chặn màn hình hoàn tất.
    } finally {
      clearTimeout(timeout);
    }
  }

  window.CLAuth = {
    isConfigured,
    hasSession: () => Boolean(accessToken),
    requestMagicLink,
    readSessionFromUrl,
    updatePassword,
    signOut,
    AuthError,
    messages,
  };
})();
