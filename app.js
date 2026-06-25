const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const profileView = document.querySelector("#profileView");
const authTitle = document.querySelector("#authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const message = document.querySelector("#message");
const showRegister = document.querySelector("#showRegister");
const showLogin = document.querySelector("#showLogin");
const logoutButton = document.querySelector("#logoutButton");
const profileIcon = document.querySelector("#profileIcon");
const profileInitial = document.querySelector("#profileInitial");
const profileAvatar = document.querySelector("#profileAvatar");
const profileName = document.querySelector("#profileName");
const profileEmail = document.querySelector("#profileEmail");
const profileGender = document.querySelector("#profileGender");
const profileBirthday = document.querySelector("#profileBirthday");
const profileHobbies = document.querySelector("#profileHobbies");

const USERS_KEY = "training_users";
const CURRENT_USER_KEY = "training_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setMessage(text, type = "success") {
  message.textContent = text;
  message.classList.toggle("error", type === "error");
}

function clearMessage() {
  setMessage("");
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "T";
}

function formatBirthday(value) {
  if (!value) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(`${value}T00:00:00`));
}

function showLoginView() {
  authTitle.textContent = "Đăng nhập";
  authSubtitle.textContent = "Vui lòng nhập email và mật khẩu để tiếp tục.";
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  profileView.classList.add("hidden");
  profileIcon.classList.add("hidden");
  clearMessage();
}

function showRegisterView() {
  authTitle.textContent = "Đăng ký profile";
  authSubtitle.textContent = "Tạo tài khoản mới với thông tin cá nhân của bạn.";
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  profileView.classList.add("hidden");
  profileIcon.classList.add("hidden");
  clearMessage();
}

function showProfileView(user) {
  const initial = getInitial(user.fullName);

  authTitle.textContent = "Profile";
  authSubtitle.textContent = "Thông tin tài khoản của bạn.";
  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  profileView.classList.remove("hidden");
  profileIcon.classList.remove("hidden");

  profileInitial.textContent = initial;
  profileAvatar.textContent = initial;
  profileName.textContent = user.fullName;
  profileEmail.textContent = user.email;
  profileGender.textContent = user.gender;
  profileBirthday.textContent = formatBirthday(user.birthday);
  profileHobbies.textContent = user.hobbies || "Chưa cập nhật";
  clearMessage();
}

function getCurrentUser() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  return getUsers().find((user) => user.email === email);
}

showRegister.addEventListener("click", showRegisterView);
showLogin.addEventListener("click", showLoginView);
profileIcon.addEventListener("click", () => {
  const currentUser = getCurrentUser();
  if (currentUser) showProfileView(currentUser);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(loginForm);
  const email = data.get("email").trim().toLowerCase();
  const password = data.get("password");
  const user = getUsers().find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    setMessage("Email hoặc mật khẩu không đúng.", "error");
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, user.email);
  showProfileView(user);
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(registerForm);
  const newUser = {
    fullName: data.get("fullName").trim(),
    gender: data.get("gender"),
    birthday: data.get("birthday"),
    email: data.get("email").trim().toLowerCase(),
    password: data.get("password"),
    hobbies: data.get("hobbies").trim(),
  };

  const users = getUsers();
  const isDuplicate = users.some((user) => user.email === newUser.email);

  if (isDuplicate) {
    setMessage("Email này đã được đăng ký.", "error");
    return;
  }

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, newUser.email);
  registerForm.reset();
  showProfileView(newUser);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  loginForm.reset();
  showLoginView();
  setMessage("Bạn đã đăng xuất.");
});

const currentUser = getCurrentUser();

if (currentUser) {
  showProfileView(currentUser);
} else {
  showLoginView();
}
