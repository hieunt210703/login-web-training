const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const homeView = document.querySelector("#homeView");
const editProfileForm = document.querySelector("#editProfileForm");
const changePasswordForm = document.querySelector("#changePasswordForm");
const deleteAccountForm = document.querySelector("#deleteAccountForm");
const pageTitle = document.querySelector("#pageTitle");
const pageSubtitle = document.querySelector("#pageSubtitle");
const message = document.querySelector("#message");
const showRegister = document.querySelector("#showRegister");
const showLogin = document.querySelector("#showLogin");
const logoutButton = document.querySelector("#logoutButton");
const profileMenuWrap = document.querySelector("#profileMenuWrap");
const profileIcon = document.querySelector("#profileIcon");
const profileMenu = document.querySelector("#profileMenu");
const profileInitial = document.querySelector("#profileInitial");
const profileAvatar = document.querySelector("#profileAvatar");
const homeGreeting = document.querySelector("#homeGreeting");
const profileEmail = document.querySelector("#profileEmail");
const profileGender = document.querySelector("#profileGender");
const profileBirthday = document.querySelector("#profileBirthday");
const profileHobbies = document.querySelector("#profileHobbies");
const menuHome = document.querySelector("#menuHome");
const menuEditProfile = document.querySelector("#menuEditProfile");
const menuChangePassword = document.querySelector("#menuChangePassword");
const menuDeleteAccount = document.querySelector("#menuDeleteAccount");
const toastContainer = document.querySelector("#toastContainer");
const confirmDialog = document.querySelector("#confirmDialog");
const confirmCancel = document.querySelector("#confirmCancel");
const confirmOk = document.querySelector("#confirmOk");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");

const USERS_KEY = "training_users";
const CURRENT_USER_KEY = "training_current_user";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const protectedViews = [
  homeView,
  editProfileForm,
  changePasswordForm,
  deleteAccountForm,
];

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setCurrentUser(email) {
  localStorage.setItem(CURRENT_USER_KEY, email);
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function setMessage(text, type = "success") {
  message.textContent = text;
  message.classList.toggle("error", type === "error");
}

function clearMessage() {
  setMessage("");
}

function showToast(title, description) {
  const toast = document.createElement("div");
  const content = document.createElement("div");
  const titleElement = document.createElement("strong");
  const descriptionElement = document.createElement("span");

  toast.className = "toast";
  toast.setAttribute("role", "status");
  titleElement.textContent = title;
  descriptionElement.textContent = description;
  content.append(titleElement, descriptionElement);
  toast.append(content);
  toastContainer.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), {
      once: true,
    });
  }, 3200);
}

function getInitial(name) {
  return name.trim().charAt(0).toUpperCase() || "T";
}

function formatBirthday(value) {
  if (!value) return "Chưa cập nhật";

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
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

function clearAllForms() {
  [
    loginForm,
    registerForm,
    editProfileForm,
    changePasswordForm,
    deleteAccountForm,
  ].forEach((form) => {
    clearFormErrors(form);
    disableFormButtons(form, false);
  });
}

function disableFormButtons(form, isDisabled = true) {
  form.querySelectorAll("button").forEach((button) => {
    button.disabled = isDisabled;
    button.classList.toggle("is-loading", isDisabled && button.type === "submit");
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

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

function validateEmail(email) {
  if (!email) return "Vui lòng nhập email.";
  if (!EMAIL_PATTERN.test(email)) return "Email chưa đúng định dạng.";
  return "";
}

function validateName(fullName) {
  if (!fullName) return "Vui lòng nhập họ và tên.";
  if (fullName.length < 2) return "Họ và tên cần tối thiểu 2 ký tự.";
  return "";
}

function validateBirthday(birthday) {
  if (!birthday) return "Vui lòng chọn ngày sinh.";
  if (Number.isNaN(new Date(`${birthday}T00:00:00`).getTime())) {
    return "Ngày sinh không hợp lệ.";
  }
  if (new Date(`${birthday}T00:00:00`) > new Date()) {
    return "Ngày sinh không được lớn hơn ngày hiện tại.";
  }
  if (getAge(birthday) < 13) {
    return "Bạn cần từ 13 tuổi trở lên để đăng ký.";
  }
  return "";
}

function validatePassword(password) {
  if (!password) return "Vui lòng nhập mật khẩu.";
  if (password.length < 6) return "Mật khẩu cần tối thiểu 6 ký tự.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Mật khẩu cần có cả chữ và số.";
  }
  return "";
}

function validateHobbies(hobbies) {
  if (hobbies.length > 120) return "Sở thích không nên quá 120 ký tự.";
  return "";
}

function getProfileErrors(form) {
  const fullName = getFieldValue(form, "fullName");
  const gender = getFieldValue(form, "gender");
  const birthday = getFieldValue(form, "birthday");
  const email = getFieldValue(form, "email").toLowerCase();
  const hobbies = getFieldValue(form, "hobbies");
  const errors = {};

  const nameError = validateName(fullName);
  const birthdayError = validateBirthday(birthday);
  const emailError = validateEmail(email);
  const hobbiesError = validateHobbies(hobbies);

  if (nameError) errors.fullName = nameError;
  if (!gender) errors.gender = "Vui lòng chọn giới tính.";
  if (birthdayError) errors.birthday = birthdayError;
  if (emailError) errors.email = emailError;
  if (hobbiesError) errors.hobbies = hobbiesError;

  return errors;
}

function validateLoginForm() {
  const email = getFieldValue(loginForm, "email").toLowerCase();
  const password = getFieldValue(loginForm, "password");
  const errors = {};
  const emailError = validateEmail(email);

  if (emailError) errors.email = emailError;
  if (!password) errors.password = "Vui lòng nhập mật khẩu.";

  showErrors(loginForm, errors);
  return Object.keys(errors).length === 0;
}

function validateRegisterForm() {
  const errors = getProfileErrors(registerForm);
  const password = getFieldValue(registerForm, "password");
  const passwordError = validatePassword(password);

  if (passwordError) errors.password = passwordError;

  showErrors(registerForm, errors);
  return Object.keys(errors).length === 0;
}

function validateEditProfileForm(currentEmail) {
  const errors = getProfileErrors(editProfileForm);
  const email = getFieldValue(editProfileForm, "email").toLowerCase();
  const isDuplicate = getUsers().some(
    (user) => user.email === email && user.email !== currentEmail,
  );

  if (isDuplicate) {
    errors.email = "Email này đã được đăng ký.";
  }

  showErrors(editProfileForm, errors);
  return Object.keys(errors).length === 0;
}

function validateChangePasswordForm(user) {
  const currentPassword = getFieldValue(changePasswordForm, "currentPassword");
  const newPassword = getFieldValue(changePasswordForm, "newPassword");
  const confirmPassword = getFieldValue(changePasswordForm, "confirmPassword");
  const errors = {};
  const newPasswordError = validatePassword(newPassword);

  if (!currentPassword) {
    errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
  } else if (currentPassword !== user.password) {
    errors.currentPassword = "Mật khẩu hiện tại không đúng.";
  }

  if (newPasswordError) {
    errors.newPassword = newPasswordError;
  } else if (newPassword === currentPassword) {
    errors.newPassword = "Mật khẩu mới cần khác mật khẩu hiện tại.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
  } else if (confirmPassword !== newPassword) {
    errors.confirmPassword = "Mật khẩu nhập lại không khớp.";
  }

  showErrors(changePasswordForm, errors);
  return Object.keys(errors).length === 0;
}

function validateDeleteAccountForm(user) {
  const deletePassword = getFieldValue(deleteAccountForm, "deletePassword");
  const errors = {};

  if (!deletePassword) {
    errors.deletePassword = "Vui lòng nhập mật khẩu để xác nhận.";
  } else if (deletePassword !== user.password) {
    errors.deletePassword = "Mật khẩu xác nhận không đúng.";
  }

  showErrors(deleteAccountForm, errors);
  return Object.keys(errors).length === 0;
}

function getCurrentUser() {
  const email = localStorage.getItem(CURRENT_USER_KEY);
  return getUsers().find((user) => user.email === email);
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const toggleBtn = document.querySelector(`[data-target="${inputId}"]`);

  if (!input || !toggleBtn) return;

  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  toggleBtn.setAttribute("aria-pressed", String(!isPassword));
  
  const icon = toggleBtn.querySelector(".password-icon");
  if (icon) {
    icon.textContent = isPassword ? "Hide" : "Show";
  }
}

function showConfirmDialog(onConfirm) {
  return new Promise((resolve) => {
    const handleConfirm = () => {
      confirmDialog.close();
      cleanupDialog();
      onConfirm();
      resolve(true);
    };

    const handleCancel = () => {
      confirmDialog.close();
      cleanupDialog();
      resolve(false);
    };

    const cleanupDialog = () => {
      confirmCancel.removeEventListener("click", handleCancel);
      confirmOk.removeEventListener("click", handleConfirm);
      confirmDialog.removeEventListener("cancel", handleCancel);
    };

    confirmCancel.addEventListener("click", handleCancel);
    confirmOk.addEventListener("click", handleConfirm);
    confirmDialog.addEventListener("cancel", handleCancel);

    confirmDialog.showModal();
    confirmOk.focus();
  });
}

function updateField(field) {
  const errorId = field.dataset.error;

  if (field.name === "email") {
    const emailError = validateEmail(field.value);
    setFieldError(field, emailError);
  } else if (field.name === "fullName") {
    const nameError = validateName(field.value);
    setFieldError(field, nameError);
  } else if (field.name === "birthday") {
    const birthdayError = validateBirthday(field.value);
    setFieldError(field, birthdayError);
  } else if (field.name === "password" || field.name === "newPassword") {
    const passwordError = validatePassword(field.value);
    setFieldError(field, passwordError);
  } else if (field.name === "hobbies") {
    const hobbiesError = validateHobbies(field.value);
    setFieldError(field, hobbiesError);
  } else if (field.name === "gender") {
    const genderError = field.value ? "" : "Vui lòng chọn giới tính.";
    setFieldError(field, genderError);
  }
}

function updateUser(currentEmail, updater) {
  const users = getUsers();
  const index = users.findIndex((user) => user.email === currentEmail);

  if (index === -1) return null;

  users[index] = updater(users[index]);
  saveUsers(users);
  setCurrentUser(users[index].email);
  return users[index];
}

function fillEditProfileForm(user) {
  editProfileForm.elements.fullName.value = user.fullName;
  editProfileForm.elements.gender.value = user.gender;
  editProfileForm.elements.birthday.value = user.birthday;
  editProfileForm.elements.email.value = user.email;
  editProfileForm.elements.hobbies.value = user.hobbies || "";
}

function closeProfileMenu() {
  profileMenu.classList.add("hidden");
  profileIcon.setAttribute("aria-expanded", "false");
}

function hideAllViews() {
  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
  protectedViews.forEach((view) => view.classList.add("hidden"));
}

function renderHome(user) {
  const initial = getInitial(user.fullName);

  profileInitial.textContent = initial;
  profileAvatar.textContent = initial;
  homeGreeting.textContent = user.fullName;
  profileEmail.textContent = user.email;
  profileGender.textContent = user.gender;
  profileBirthday.textContent = formatBirthday(user.birthday);
  profileHobbies.textContent = user.hobbies || "Chưa cập nhật";
  fillEditProfileForm(user);
}

function showLoginView() {
  pageTitle.textContent = "Đăng nhập";
  pageSubtitle.textContent = "Vui lòng nhập email và mật khẩu để tiếp tục.";
  hideAllViews();
  loginForm.classList.remove("hidden");
  profileMenuWrap.classList.add("hidden");
  closeProfileMenu();
  clearAllForms();
  clearMessage();
  getField(loginForm, "email").focus();
}

function showRegisterView() {
  pageTitle.textContent = "Đăng ký profile";
  pageSubtitle.textContent = "Tạo tài khoản mới với thông tin cá nhân của bạn.";
  hideAllViews();
  registerForm.classList.remove("hidden");
  profileMenuWrap.classList.add("hidden");
  closeProfileMenu();
  clearAllForms();
  clearMessage();
  getField(registerForm, "fullName").focus();
}

function showHomeView(user) {
  pageTitle.textContent = "Homepage";
  pageSubtitle.textContent = `Chào mừng ${user.fullName}.`;
  hideAllViews();
  homeView.classList.remove("hidden");
  profileMenuWrap.classList.remove("hidden");
  closeProfileMenu();
  changePasswordForm.reset();
  deleteAccountForm.reset();
  clearAllForms();
  clearMessage();
  renderHome(user);
  homeView.focus();
}

function showEditProfileView(user) {
  pageTitle.textContent = "Edit profile";
  pageSubtitle.textContent = "Cập nhật thông tin cá nhân của bạn.";
  hideAllViews();
  editProfileForm.classList.remove("hidden");
  profileMenuWrap.classList.remove("hidden");
  closeProfileMenu();
  clearAllForms();
  clearMessage();
  fillEditProfileForm(user);
  getField(editProfileForm, "fullName").focus();
}

function showChangePasswordView() {
  pageTitle.textContent = "Đổi mật khẩu";
  pageSubtitle.textContent = "Cập nhật mật khẩu đăng nhập của bạn.";
  hideAllViews();
  changePasswordForm.classList.remove("hidden");
  profileMenuWrap.classList.remove("hidden");
  closeProfileMenu();
  changePasswordForm.reset();
  clearAllForms();
  clearMessage();
  getField(changePasswordForm, "currentPassword").focus();
}

function showDeleteAccountView() {
  pageTitle.textContent = "Xóa tài khoản";
  pageSubtitle.textContent = "Xác nhận mật khẩu trước khi xóa tài khoản demo.";
  hideAllViews();
  deleteAccountForm.classList.remove("hidden");
  profileMenuWrap.classList.remove("hidden");
  closeProfileMenu();
  deleteAccountForm.reset();
  clearAllForms();
  clearMessage();
  getField(deleteAccountForm, "deletePassword").focus();
}

function requireUser(callback) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showLoginView();
    return;
  }

  callback(currentUser);
}

showRegister.addEventListener("click", showRegisterView);
showLogin.addEventListener("click", showLoginView);

document.querySelectorAll(".password-toggle").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    togglePasswordVisibility(btn.dataset.target);
  });
});
profileIcon.addEventListener("click", () => {
  const isOpen = !profileMenu.classList.contains("hidden");
  profileMenu.classList.toggle("hidden", isOpen);
  profileIcon.setAttribute("aria-expanded", String(!isOpen));
});
menuHome.addEventListener("click", () => requireUser(showHomeView));
menuEditProfile.addEventListener("click", () =>
  requireUser(showEditProfileView),
);
menuChangePassword.addEventListener("click", () =>
  requireUser(showChangePasswordView),
);
menuDeleteAccount.addEventListener("click", () =>
  requireUser(showDeleteAccountView),
);
document.querySelectorAll(".back-home").forEach((button) => {
  button.addEventListener("click", () => {
    requireUser((user) => {
      showHomeView(user);
      homeView.focus();
    });
  });
});
document.addEventListener("click", (event) => {
  if (!profileMenuWrap.contains(event.target)) {
    closeProfileMenu();
  }
});

[
  loginForm,
  registerForm,
  editProfileForm,
  changePasswordForm,
  deleteAccountForm,
].forEach((form) => {
  form.addEventListener("input", () => clearMessage());

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("change", () => updateField(field));
  });
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateLoginForm()) {
    setMessage("Vui lòng kiểm tra lại thông tin đăng nhập.", "error");
    getField(loginForm, "email").focus();
    return;
  }

  disableFormButtons(loginForm);

  const email = getFieldValue(loginForm, "email").toLowerCase();
  const password = getFieldValue(loginForm, "password");
  const user = getUsers().find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    setMessage("Email hoặc mật khẩu không đúng.", "error");
    disableFormButtons(loginForm, false);
    getField(loginForm, "email").focus();
    return;
  }

  setCurrentUser(user.email);
  showHomeView(user);
  showToast("Đăng nhập thành công", `Chào mừng ${user.fullName} quay lại.`);
  disableFormButtons(loginForm, false);
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateRegisterForm()) {
    setMessage("Vui lòng sửa các lỗi trong form đăng ký.", "error");
    getField(registerForm, "fullName").focus();
    return;
  }

  disableFormButtons(registerForm);

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
    disableFormButtons(registerForm, false);
    getField(registerForm, "email").focus();
    return;
  }

  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser.email);
  registerForm.reset();
  showHomeView(newUser);
  showToast("Đăng ký thành công", "Profile của bạn đã được tạo.");
  disableFormButtons(registerForm, false);
});

editProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) return showLoginView();

  if (!validateEditProfileForm(currentUser.email)) {
    setMessage("Vui lòng sửa các lỗi trong form profile.", "error");
    getField(editProfileForm, "fullName").focus();
    return;
  }

  disableFormButtons(editProfileForm);

  const updatedUser = updateUser(currentUser.email, (user) => ({
    ...user,
    fullName: getFieldValue(editProfileForm, "fullName"),
    gender: getFieldValue(editProfileForm, "gender"),
    birthday: getFieldValue(editProfileForm, "birthday"),
    email: getFieldValue(editProfileForm, "email").toLowerCase(),
    hobbies: getFieldValue(editProfileForm, "hobbies"),
  }));

  if (!updatedUser) return showLoginView();

  showHomeView(updatedUser);
  setMessage("Profile đã được cập nhật.");
  showToast("Cập nhật profile thành công", "Thông tin của bạn đã được lưu.");
  disableFormButtons(editProfileForm, false);
});

changePasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) return showLoginView();

  if (!validateChangePasswordForm(currentUser)) {
    setMessage("Vui lòng kiểm tra lại thông tin đổi mật khẩu.", "error");
    getField(changePasswordForm, "currentPassword").focus();
    return;
  }

  disableFormButtons(changePasswordForm);

  const updatedUser = updateUser(currentUser.email, (user) => ({
    ...user,
    password: getFieldValue(changePasswordForm, "newPassword"),
  }));

  if (!updatedUser) return showLoginView();

  showHomeView(updatedUser);
  setMessage("Mật khẩu đã được cập nhật.");
  showToast(
    "Đổi mật khẩu thành công",
    "Bạn có thể dùng mật khẩu mới ở lần đăng nhập sau.",
  );
  disableFormButtons(changePasswordForm, false);
});

deleteAccountForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const currentUser = getCurrentUser();
  if (!currentUser) return showLoginView();

  if (!validateDeleteAccountForm(currentUser)) {
    setMessage(
      "Vui lòng xác nhận lại mật khẩu trước khi xóa tài khoản.",
      "error",
    );
    getField(deleteAccountForm, "deletePassword").focus();
    return;
  }

  const confirmed = await showConfirmDialog(() => {
    const users = getUsers().filter((user) => user.email !== currentUser.email);
    saveUsers(users);
    clearCurrentUser();
    loginForm.reset();
    registerForm.reset();
    changePasswordForm.reset();
    deleteAccountForm.reset();
    showLoginView();
    showToast(
      "Đã xóa tài khoản",
      "Tài khoản demo đã được gỡ khỏi trình duyệt này.",
    );
  });
});

logoutButton.addEventListener("click", () => {
  clearCurrentUser();
  loginForm.reset();
  closeProfileMenu();
  showLoginView();
  setMessage("Bạn đã đăng xuất.");
  showToast("Đã đăng xuất", "Bạn có thể đăng nhập lại bất cứ lúc nào.");
  getField(loginForm, "email").focus();
});

const currentUser = getCurrentUser();

if (currentUser) {
  showHomeView(currentUser);
} else {
  showLoginView();
}
