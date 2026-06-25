# Login Profile Web

Web tĩnh demo cho luồng đăng ký profile, đăng nhập, homepage quản lý tài khoản và đăng xuất.

Live demo: https://login-web-training.vercel.app

## Tính năng

- Đăng ký profile với họ và tên, giới tính, ngày sinh, email, mật khẩu và sở thích optional.
- Đăng nhập thành công sẽ chuyển sang homepage.
- Homepage hiển thị thông tin profile, avatar chữ cái đầu, email, giới tính, ngày sinh và sở thích.
- Edit profile trực tiếp trong homepage.
- Đổi mật khẩu với kiểm tra mật khẩu hiện tại và xác nhận mật khẩu mới.
- Xóa tài khoản demo sau khi xác nhận mật khẩu.
- Validation custom bằng JavaScript, không dùng validation mặc định của trình duyệt.
- Hiển thị lỗi riêng dưới từng field.
- Toast message khi đăng ký, đăng nhập, cập nhật profile, đổi mật khẩu, xóa tài khoản và đăng xuất thành công.
- Ngày sinh hiển thị theo định dạng `dd/MM/yyyy`.
- Lưu tài khoản demo bằng `localStorage` để có thể đăng xuất và đăng nhập lại trên cùng trình duyệt.

## Cấu trúc file

```text
.
├── index.html      # Markup cho form đăng nhập, đăng ký và homepage
├── styles.css      # Giao diện, responsive, field error và toast
├── app.js          # Validation, localStorage auth demo và luồng UI
├── vercel.json     # Cấu hình Vercel
├── netlify.toml    # Cấu hình Netlify nếu cần
└── README.md
```

## Chạy local

Mở trực tiếp file `index.html` trong trình duyệt.

Hoặc chạy server tĩnh nếu muốn test qua localhost:

```bash
npx serve .
```

## Deploy Vercel

Deploy production:

```bash
npx vercel --prod --yes
```

Sau khi deploy, Vercel alias chính đang dùng là:

```text
https://login-web-training.vercel.app
```

## Lưu ý

Đây là demo frontend thuần HTML/CSS/JS. Email, password và profile được lưu trong `localStorage`, nên chưa phù hợp cho production thật. Nếu dùng thật, cần backend/API, database, hash password và session/token bảo mật.
