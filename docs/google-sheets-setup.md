# Cấu hình lưu form vào Google Sheets

Code đã tích hợp vào `POST /api/contact`. Bạn chỉ cần tạo bảng tính, cấp quyền và đặt biến môi trường. Không cần lấy access token thủ công, tạo Google Form hay cho khách đăng nhập Google.

## 1. Tạo project và bật Google Sheets API

1. Đăng nhập [Google Cloud Console](https://console.cloud.google.com/) bằng tài khoản Google bạn quản lý.
2. Bấm bộ chọn project ở thanh trên cùng → **New Project**. Đặt tên, ví dụ `dh26-law`, rồi tạo và chọn project đó.
3. Vào **APIs & Services → Library**. Tìm **Google Sheets API** và bấm **Enable**.

API được bật cho Cloud project; bảng tính vẫn thuộc tài khoản Google tạo bảng. Luồng này chỉ cần Sheets API, không cần bật Drive API hoặc thiết lập OAuth consent screen.

Tham khảo: [Bật Google Workspace API](https://developers.google.com/workspace/guides/enable-apis).

## 2. Tạo Service Account và tải key JSON

1. Trong cùng project, vào **IAM & Admin → Service Accounts**.
2. Bấm **Create service account**, đặt tên `dh26-form-writer` → **Create and continue**.
3. Bỏ qua quyền truy cập Cloud project và người được dùng Service Account nếu không có nhu cầu khác → **Done**. Không cần cấp vai trò Owner/Editor của Cloud project để ghi vào bảng tính được chia sẻ trực tiếp.
4. Bấm vào email Service Account vừa tạo.
5. Vào tab **Keys → Add key → Create new key → JSON → Create**. Trình duyệt tải một file JSON.
6. Mở file bằng trình soạn thảo trên máy. Lấy đúng hai trường:

| Trường trong JSON | Biến môi trường |
| --- | --- |
| `client_email` | `GOOGLE_SERVICE_ACCOUNT_EMAIL` |
| `private_key` | `GOOGLE_PRIVATE_KEY` |

Email có dạng `dh26-form-writer@your-project.iam.gserviceaccount.com`. Private key gồm toàn bộ phần `-----BEGIN PRIVATE KEY-----`, nội dung ở giữa và `-----END PRIVATE KEY-----`.

Đây là khóa bí mật. Giữ file JSON ngoài thư mục mã nguồn, không gửi qua chat, không đưa vào `public/` hoặc commit Git. File key chỉ tải được tại thời điểm tạo. Nếu tổ chức chặn tạo key, cần quản trị viên hỗ trợ cơ chế xác thực được tổ chức cho phép.

Tham khảo: [Tạo Service Account và chia sẻ tài liệu](https://developers.google.com/workspace/guides/create-credentials), [Tạo key JSON](https://docs.cloud.google.com/iam/docs/keys-create-delete).

## 3. Tạo bảng tính và cấp quyền

1. Mở [Google Sheets](https://sheets.google.com/), tạo bảng tính riêng, ví dụ **DH26 – Yêu cầu tư vấn**.
2. Đổi tên **tab ở phía dưới** thành `Contacts`. Tên file ở phía trên có thể tùy ý; code dùng tên tab.
3. Điền dòng đầu tiên, theo đúng thứ tự cột A đến H. Có thể copy dòng dưới và dán vào ô A1:

```text
Mã yêu cầu	Thời gian tiếp nhận (UTC)	Họ tên	Số điện thoại	Email	Nội dung	Đồng ý xử lý thông tin	Trạng thái
```

4. Bấm **Share / Chia sẻ**. Dán email `client_email` của Service Account, chọn **Editor / Người chỉnh sửa**, rồi lưu. Nếu có mục gửi thông báo, có thể bỏ chọn.
5. Giữ **General access / Quyền truy cập chung** ở **Restricted / Bị hạn chế**. Chỉ chia sẻ thêm cho nhân sự cần xử lý yêu cầu.
6. Lấy ID từ địa chỉ bảng tính:

```text
https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit#gid=0
                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^
                                        GOOGLE_SPREADSHEET_ID
```

Trong ví dụ, ID là `1AbCdEfGhIjKlMnOpQrStUvWxYz`. Không copy cả URL hoặc `gid=0`.

Mỗi lần gửi form hợp lệ sẽ thêm một dòng A:H. Mã yêu cầu và giờ UTC do server tạo; số điện thoại được chuẩn hóa; cột đồng ý chứa boolean `true`; trạng thái ban đầu là `Mới`. Nhân sự có thể đổi trạng thái sau đó. Không đổi thứ tự cột A:H; có thể thêm cột riêng từ I trở đi. Tránh đặt các bảng dữ liệu khác hoặc công thức kéo dài phía dưới cùng vùng A:H vì API xác định dòng tiếp theo từ bảng hiện hữu.

Code dùng `valueInputOption=RAW`, giữ số 0 đầu điện thoại và giữ nội dung người dùng ở dạng văn bản, không chạy như công thức. Không lưu token Turnstile, IP hoặc khóa API vào Sheet.

Tham khảo: [Thêm dòng vào bảng tính](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [Chế độ RAW](https://developers.google.com/workspace/sheets/api/reference/rest/v4/ValueInputOption).

## 4. Đặt env trên máy local

Mở `.env.local` ở thư mục gốc, cùng cấp `package.json`. Nếu chưa có thì sao chép `.env.example` thành `.env.local`; giữ các biến đang có nếu file đã tồn tại. Điền:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=dh26-form-writer@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nNOI_DUNG_KEY_THAT\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_SHEET_NAME=Contacts
```

Các giá trị ở trên là ví dụ, không dùng làm credentials thực tế.

Với `GOOGLE_PRIVATE_KEY`, copy giá trị `private_key` trong JSON, giữ `\n` và đặt trong dấu nháy kép như ví dụ. Code cũng hỗ trợ private key có xuống dòng thật. Không copy tên trường `private_key:` hoặc dấu phẩy cuối dòng JSON.

`GOOGLE_SHEET_NAME` phải khớp tên tab, gồm cả khoảng trắng/dấu tiếng Việt nếu có; mặc định là `Contacts` khi để trống và đã có đủ ba biến còn lại. Không dùng tiền tố `NEXT_PUBLIC_` cho các biến Google.

Sau khi lưu, khởi động lại `pnpm dev`.

## 5. Đặt env trên Vercel / server

Nếu dùng Vercel: mở project → **Settings → Environment Variables**, thêm bốn biến trên và chọn đúng môi trường **Production**. Chỉ thêm vào Preview/Development nếu chủ động dùng bảng kiểm thử riêng.

Trong ô giá trị của Vercel, dán email, ID, tên tab trực tiếp, không kèm dấu nháy bao ngoài. Với private key, dán toàn bộ giá trị đã giải mã có xuống dòng thật, hoặc chuỗi chứa `\n`; code nhận cả hai cách. Không dán cả object JSON, dấu nháy bao ngoài hoặc dấu phẩy cuối dòng.

Lưu và redeploy để bản triển khai nhận env mới. Nếu dùng VPS/hosting khác, đặt cùng tên biến trong cấu hình môi trường tiến trình Node rồi khởi động lại ứng dụng.

## 6. Các env sẵn có của form vẫn cần

Tích hợp này bổ sung lưu Sheets vào luồng email hiện tại. Form vẫn yêu cầu cấu hình email và chống spam:

| Biến | Nguồn / giá trị |
| --- | --- |
| `RESEND_API_KEY` | Khóa gửi thư trong tài khoản Resend |
| `CONTACT_SENDER_EMAIL` | Email gửi thuộc domain đã xác minh trên Resend |
| `CONTACT_RECIPIENT_EMAIL` | Email nhân sự nhận thông báo; tùy chọn, mặc định email công ty trong dữ liệu website |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key của widget Cloudflare Turnstile, cần khi build |
| `TURNSTILE_SECRET_KEY` | Secret key của cùng widget |
| `NEXT_PUBLIC_SITE_URL` | Origin website, ví dụ `https://ten-mien-cua-ban.vn`; local dùng `http://localhost:3000` |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Hostname bổ sung nếu có; phân cách bằng dấu phẩy, không có `https://` hoặc đường dẫn |
| `CONTACT_WAF_CONFIGURED` | Chỉ đặt `true` sau khi tạo và thử rule giới hạn POST `/api/contact` trên WAF production |

Xem phần **Kích hoạt form** trong [README](../README.md) cho cấu hình hiện có. Các biến Google không thay thế các biến này. Không có credentials giả/bypass trong code server.

## 7. Kiểm tra sau cấu hình

1. Mở website đã build/deploy với đúng Turnstile site key.
2. Gửi một yêu cầu bằng dữ liệu kiểm thử và hoàn tất xác minh chống spam.
3. Kiểm tra có dòng mới trong tab `Contacts`, đủ tám cột, số điện thoại còn số 0 đầu, giờ ở UTC.
4. Kiểm tra email thông báo và trạng thái thư trên Resend. Khi đã lưu Sheet nhưng email lỗi, API vẫn báo tiếp nhận thành công và ghi log mã yêu cầu để tra cứu. Hiện chưa có hàng đợi tự gửi lại email; nhân sự cần theo dõi Sheet và log vận hành.
5. Xóa dòng kiểm thử khi đã xác nhận.

Chưa có credentials thật thì chỉ kiểm tra được bằng mock trong bộ test; chưa xác nhận được quyền truy cập vào bảng tính thực tế.

## Hành vi lỗi và cách xử lý

| Hiện tượng | Cần kiểm tra |
| --- | --- |
| API 503 / form chưa sẵn sàng | Đủ env Google, Resend, Turnstile và cờ WAF production; đã restart/redeploy; private key có đủ đầu/cuối |
| Google 403 dẫn đến API 502 | Sheets API đã bật đúng project; bảng tính đã chia sẻ quyền Editor cho đúng `client_email` |
| Google 404 hoặc sai range dẫn đến API 502 | ID đúng, tên tab chính xác, Service Account được chia sẻ file |
| Xác thực Google lỗi | Private key thuộc cùng `client_email`, không kèm nháy ngoài trên hosting, không bị mất `\n`, key chưa bị thu hồi |
| API 429 | WAF/email/Sheets giới hạn lượt gửi; chờ rồi thử lại |
| Đã có dòng Sheet nhưng thiếu email | Yêu cầu đã tiếp nhận; kiểm tra Resend và log `Contact saved to spreadsheet, but notification email failed` với mã yêu cầu |

Nếu không có bất kỳ env Google nào, hệ thống tiếp tục gửi email như cũ. Nếu điền một phần cấu hình Google, API trả 503 để tránh báo thành công mà không lưu được Sheet. Khi bật Google, việc ghi Sheet phải được xác nhận trước khi gửi email hoặc báo thành công.

Không tự động gửi lại lệnh append khi Google timeout vì dữ liệu có thể đã được ghi. Khi lỗi mạng xảy ra sau khi Google ghi dữ liệu nhưng trước khi trả phản hồi, khách gửi lại vẫn có thể tạo dòng trùng. Chưa có cơ chế chống trùng xuyên nhiều request hoặc hàng đợi bền vững; nếu cần bảo đảm chặt chẽ hơn, cần bổ sung kho dữ liệu/hàng đợi có trạng thái.
