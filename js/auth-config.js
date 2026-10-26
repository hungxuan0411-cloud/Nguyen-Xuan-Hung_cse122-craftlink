// Chỉ điền URL project và anon public key của Supabase.
// Không điền service_role key, mật khẩu SMTP hoặc bất kỳ secret nào vào file này.
window.CRAFTLINK_AUTH = {
  supabaseUrl: "https://iynpatzvvevgrzdrbgxm.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bnBhdHp2dmV2Z3J6ZHJiZ3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NTY0MDQsImV4cCI6MjEwODUzMjQwNH0.0eXYWagEjjsePc6-Vk8yDjoti2HxT7usDBl5z88KolI",
  magicLinkExpirySeconds: 300,
  resendAfterSeconds: 60,
};
