const form = document.querySelector("#loginForm");
const message = document.querySelector("#message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const email = data.get("email");

  message.textContent = `Đã nhận thông tin đăng nhập cho ${email}.`;
});
