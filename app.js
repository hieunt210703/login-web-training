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
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function getField(form, name) {
  return form.elements[name];
}

function getFieldValue(form, name) {
  return getField(form, name).value.trim();
}

function setFieldError(field, errorMessage) {
  const errorId = field.dataset.error;
  const errorElement = errorId ? document.querySelector(`#${errorId}`) : null;

  field.classList.toggle("has-error", Boolean(errorMessage));
  field.setAttribute("aria-invalid", String(Boolean(errorMessage)));

  if (errorElement) {
    errorElement.textContent = errorMessage;
  }
}

function clearFormErrors(form) {
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    setFieldError(field, "");
  });
}

function showErrors(form, errors) {
  clearFormErrors(form);
  Object.entries(errors).forEach(([name, errorMessage]) => {
    setFieldError(getField(form, name), errorMessage);
  });

  const firstErrorName = Object.keys(errors)[0];
  if (firstErrorName) {
    getField(form, firstErrorName).focus();
  }
}

function getAge(birthday) {
  const today = new Date();
  const birthDate = new Date(`${birthday}T00:00:00`);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function validateLoginForm() {
  const email = getFieldValue(loginForm, "email").toLowerCase();
  const password = getFieldValue(loginForm, "password");
  const errors = {};

  if (!email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  }

  showErrors(loginForm, errors);
  return Object.keys(errors).length === 0;
}

function validateRegisterForm() {
  const fullName = getFieldValue(registerForm, "fullName");
  const gender = getFieldValue(registerForm, "gender");
  const birthday = getFieldValue(registerForm, "birthday");
  const email = getFieldValue(registerForm, "email").toLowerCase();
  const password = getFieldValue(registerForm, "password");
  const hobbies = getFieldValue(registerForm, "hobbies");
  const errors = {};

  if (!fullName) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (fullName.length < 2) {
    errors.fullName = "Họ và tên cần tối thiểu 2 ký tự.";
  }

  if (!gender) {
    errors.gender = "Vui lòng chọn giới tính.";
  }

  if (!birthday) {
    errors.birthday = "Vui lòng chọn ngày sinh.";
  } else if (Number.isNaN(new Date(`${birthday}T00:00:00`).getTime())) {
    errors.birthday = "Ngày sinh không hợp lệ.";
  } else if (new Date(`${birthday}T00:00:00`) > new Date()) {
    errors.birthday = "Ngày sinh không được lớn hơn ngày hiện tại.";
  } else if (getAge(birthday) < 13) {
    errors.birthday = "Bạn cần từ 13 tuổi trở lên để đăng ký.";
  }

  if (!email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Email chưa đúng định dạng.";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu.";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
  } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    errors.password = "Mật khẩu cần có cả chữ và số.";
  }

  if (hobbies.length > 120) {
    errors.hobbies = "Sở thích không nên quá 120 ký tự.";
  }

  showErrors(registerForm, errors);
  return Object.keys(errors).length === 0;
}

function showLoginView() {
  authTitle.textContent = "Đăng nhập";
  authSubtitle.textContent = "Vui lòng nhập email và mật khẩu để tiếp tục.";
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  profileView.classList.add("hidden");
  profileIcon.classList.add("hidden");
  clearFormErrors(loginForm);
  clearFormErrors(registerForm);
  clearMessage();
}

function showRegisterView() {
  authTitle.textContent = "Đăng ký profile";
  authSubtitle.textContent = "Tạo tài khoản mới với thông tin cá nhân của bạn.";
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  profileView.classList.add("hidden");
  profileIcon.classList.add("hidden");
  clearFormErrors(loginForm);
  clearFormErrors(registerForm);
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

loginForm.addEventListener("input", () => clearMessage());
registerForm.addEventListener("input", () => clearMessage());

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateLoginForm()) {
    setMessage("Vui lòng kiểm tra lại thông tin đăng nhập.", "error");
    return;
  }

  const email = getFieldValue(loginForm, "email").toLowerCase();
  const password = getFieldValue(loginForm, "password");
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

  if (!validateRegisterForm()) {
    setMessage("Vui lòng sửa các lỗi trong form đăng ký.", "error");
    return;
  }

  const newUser = {
    fullName: getFieldValue(registerForm, "fullName"),
    gender: getFieldValue(registerForm, "gender"),
    birthday: getFieldValue(registerForm, "birthday"),
    email: getFieldValue(registerForm, "email").toLowerCase(),
    password: getFieldValue(registerForm, "password"),
    hobbies: getFieldValue(registerForm, "hobbies"),
  };

  const users = getUsers();
  const isDuplicate = users.some((user) => user.email === newUser.email);

  if (isDuplicate) {
    showErrors(registerForm, { email: "Email này đã được đăng ký." });
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
