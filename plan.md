# PLAN.md — DH26 LAW Website

> **Tài liệu triển khai dành cho Codex**  
> Dự án: Website giới thiệu **Công ty Luật TNHH DH26 LAW**  
> Ngày lập: 24/10/2026  
> Ngôn ngữ giao diện: **Tiếng Việt (`vi-VN`)**  
> Mục tiêu: **Website chuyên nghiệp, responsive, SEO tốt, nội dung lưu JSON, triển khai trên Vercel.**

---

## 0. Hướng dẫn làm việc cho Codex (đọc trước khi code)

**Vai trò:** Senior full-stack frontend engineer (Next.js 16 / Node.js 24), đồng thời chú trọng SEO, Accessibility và UI responsive.

1. Đọc toàn bộ `plan.md` trước khi triển khai. Nếu repository đã có code, kiểm tra hiện trạng và **tái sử dụng những gì hợp lý**, không ghi đè tài sản hoặc cấu hình quan trọng.
2. Thực hiện **theo thứ tự phase**, cập nhật checkbox và ghi ngắn gọn những thay đổi đã làm sau mỗi phase trong `IMPLEMENTATION_PROGRESS.md`.
3. Tạo code chạy được, không chỉ dựng mock UI. Tất cả link/menu/CTA phải có đích thực. Không để dummy click handlers hay TODO giả thành tính năng hoàn chỉnh.
4. Không tự tạo hoặc chỉnh sửa logo gốc. **Dùng logo do khách hàng cung cấp** trong `public/brand/`; nếu asset chưa có, dùng text logo `DH26 LAW` tạm thời và nêu rõ tài sản cần bổ sung. Không dùng ảnh chân dung, khuôn mặt, người mẫu, ảnh luật sư do AI tạo, hoặc stock photo có người.
5. Không bịa số năm kinh nghiệm, thành tích, số lượng khách hàng/vụ việc, giải thưởng, review, quote của luật sư, lĩnh vực chuyên môn cụ thể ngoài thông tin đã xác nhận. Không hứa bảo đảm thắng kiện hay kết quả tư vấn.
6. Nội dung công khai đọc từ **JSON trong Git repository**; không dùng database, CMS hoặc NestJS ở V1. Không cố ghi dữ liệu vào file JSON bên trong deployment của Vercel.
7. Với tính năng cần secrets (gửi email, Turnstile), triển khai code + `.env.example` + chế độ lỗi rõ ràng nếu thiếu cấu hình. **Không báo gửi thành công khi email chưa được gửi thành công.** Tuyệt đối không hardcode secret, không commit `.env.local`.
8. Ưu tiên Server Components. Chỉ đánh dấu `use client` ở những component cần state, form, menu tương tác. Không thêm thư viện chỉ để thực hiện tác vụ CSS đơn giản.
9. Trước khi kết thúc mỗi phase: chạy lint, typecheck, unit test liên quan và build (khi phù hợp). Không được bỏ qua lỗi build/TypeScript.
10. Khi thông tin bất khả dụng (domain chính, email sender đã xác thực, ảnh logo chuẩn), sử dụng placeholder có cấu hình, ghi lại trong `README.md` và tiếp tục phần có thể triển khai; không tự suy đoán dữ liệu thật.

### Quy tắc ưu tiên khi có xung đột

`Tính đúng & bảo mật > thông tin doanh nghiệp đã được xác nhận > responsive / accessibility > SEO > UI trang trí > animation`.

---

## 1. Phạm vi và mục tiêu

### 1.1 Mục tiêu V1

- Xây dựng website giới thiệu DH26 LAW có giao diện **navy blue / gold / ivory**, trang trọng, rõ ràng, đáng tin cậy, đồng nhất với logo đã cung cấp.
- Có landing page và các trang giới thiệu, dịch vụ, chi tiết dịch vụ, liên hệ, chính sách bảo mật.
- Có form **Họ và tên, Số điện thoại, Email, Tin nhắn**; kiểm tra dữ liệu, chống spam và gửi yêu cầu đến email công ty qua server.
- SEO kỹ thuật hoàn chỉnh: semantic HTML, server-rendered/prerendered HTML, metadata riêng, canonical, Open Graph, sitemap, robots, structured data phù hợp.
- Responsive thực chất trên smartphone nhỏ (từ 320px), smartphone lớn, tablet, laptop, desktop; **không tràn ngang**, không kéo dài vô lý một khối trong màn hình nhỏ.
- Build/deploy tốt trên Vercel chạy **Node.js 24 LTS**.

### 1.2 Các hạng mục P1 (triển khai sau V1, trừ khi còn thời gian)

- Trang `Kiến thức pháp luật` và trang bài viết riêng bằng JSON.
- Lưu bản sao yêu cầu liên hệ vào **Vercel Blob Private** (không công khai). V1 chỉ cần gửi email đáng tin cậy.
- Vercel Analytics/Speed Insights và báo cáo thống kê, sau khi rà soát chính sách quyền riêng tư.

### 1.3 Ngoài phạm vi V1

- Không có đăng nhập, CMS/admin, dashboard, database, hệ thống đặt lịch tự động, thanh toán, chat bot, e-commerce, ứng dụng di động native.
- Không tự động thu thập dữ liệu người dùng quá nhu cầu xử lý yêu cầu tư vấn.
- Không dùng thư viện UI nặng, video autoplay, slider phức tạp hoặc animation gây ảnh hưởng Core Web Vitals.

---

## 2. Thông tin doanh nghiệp — nguồn dữ liệu phải giữ đúng

Thông tin dưới đây do khách hàng cung cấp; dùng làm dữ liệu khởi tạo trong `company.json`, tránh nhập tay phân tán nhiều nơi.

| Trường | Giá trị |
| --- | --- |
| Tên pháp lý | CÔNG TY LUẬT TRÁCH NHIỆM HỮU HẠN DH26 LAW |
| Tên giao dịch | CÔNG TY LUẬT TNHH DH26 LAW |
| Tên thương hiệu | DH26 LAW |
| Địa chỉ | Số 4 ngách 7/35, Thái Hà, phường Đống Đa, TP. Hà Nội |
| Điện thoại | 0973.787.969 |
| Email | dhlaw642@gmail.com |
| Người đại diện | Luật sư Bùi Xuân Dương |
| Chức vụ | Giám đốc |
| Thẻ luật sư | 21269/LS; cấp ngày 20/05/2024 bởi Liên đoàn Luật sư Việt Nam |
| Đoàn luật sư | Đoàn Luật sư TP. Hà Nội |
| Đăng ký hoạt động | 01.2026.02.2912/TP/ĐKHĐ |
| Đơn vị cấp | Sở Tư pháp TP. Hà Nội |
| Ngày cấp | 21/09/2026 |
| Lĩnh vực đăng ký | Tham gia tố tụng; Tư vấn pháp luật; Đại diện ngoài tố tụng; Dịch vụ pháp lý khác |

**Không nhầm ngày cấp đăng ký hoạt động (21/09/2026) với ngày đăng tin bố cáo (14/10/2026).**

### Nội dung thương hiệu đề xuất (chỉ là copy marketing, cần công ty duyệt)

- Hero eyebrow: `ĐỒNG HÀNH PHÁP LÝ – KIẾN TẠO GIÁ TRỊ BỀN VỮNG`
- Hero heading: `DH26 LAW – Giải pháp pháp lý cho cá nhân và doanh nghiệp`
- Hero subheading: `Cung cấp dịch vụ pháp lý chuyên nghiệp, tận tâm và phù hợp với nhu cầu của khách hàng.`
- Giá trị: `Uy tín`, `Chuẩn mực`, `Đồng hành`.
- Button chính: `Liên hệ tư vấn`; button phụ: `Tìm hiểu dịch vụ`.

Tránh viết nội dung pháp luật chuyên sâu chưa được luật sư kiểm chứng. Tên dịch vụ có thể giới thiệu theo phạm vi đăng ký, không suy diễn luật sư có chuyên môn hẹp hoặc kết quả cụ thể.

---

## 3. Technology stack và quy tắc kỹ thuật

| Hạng mục | Quyết định |
| --- | --- |
| Runtime | Node.js 24.x LTS (`engines.node: "24.x"`) |
| Web | Next.js 16.x, App Router |
| React | Phiên bản tương thích với Next.js 16 từ scaffold chính thức |
| Ngôn ngữ | TypeScript, `strict: true` |
| Package manager | pnpm, lockfile được commit; dùng Corepack nếu khả dụng |
| Styling | Tailwind CSS v4 + CSS variables |
| UI | shadcn/ui ở component phù hợp; ưu tiên native semantics |
| Icons | lucide-react |
| Form | react-hook-form + Zod + `@hookform/resolvers` |
| Email | Resend (tách provider adapter, từ email domain đã verify) |
| Anti-spam | Cloudflare Turnstile, **bắt buộc xác minh token ở server** trên production |
| Testing | Vitest + Testing Library cho unit/component; Playwright cho E2E |
| Deployment | Vercel, region phù hợp, Production custom domain khi được cung cấp |
| Content | `.json` trong `src/data/` dưới Git |

- Không thêm TanStack Query hoặc client state manager khi không có yêu cầu fetch phức tạp.
- Dùng `next/font` với font hỗ trợ tiếng Việt; ưu tiên `Be Vietnam Pro` (body) và `Noto Serif` (heading), tinh chỉnh weight cần thiết.
- Không cấu hình `output: 'export'` cho V1 vì `POST /api/contact` cần server runtime.
- Dùng `generateStaticParams()` và `generateMetadata()` cho trang dịch vụ theo slug; trong Next.js 16 các `params` của page động cần được xử lý theo dạng async/Promise.
- Dùng `metadataBase` lấy từ `NEXT_PUBLIC_SITE_URL`, validate URL production khi build/deploy.
- Không phát sinh lỗi hydration, không dùng tính năng Node.js ngoài server component/route handler.

### Khởi tạo dự án khi repo còn trống

```bash
# Kiểm tra phiên bản trước khi scaffold
node --version   # 24.x
pnpm --version

pnpm create next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*"

# UI / forms / icons
pnpm add lucide-react zod react-hook-form @hookform/resolvers resend

# Dùng shadcn/ui CLI tương thích dự án và init theo hướng dẫn chính thức
pnpm dlx shadcn@latest init

# Testing: chọn bản tương thích, cấu hình cụ thể cho Next/TS
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test
pnpm exec playwright install chromium
```

Nếu Next.js đã được khởi tạo, **không chạy scaffold đè repo**. Pin phiên bản resolved trong lockfile; không đoán patch version.

---

## 4. Thiết kế giao diện / Brand design system

### 4.1 Phong cách

- **Chủ đạo:** Navy `#0B2440`.
- **Accent:** Gold `#C8A46B`.
- **Background:** Ivory `#F8F7F3` và White `#FFFFFF`.
- **Text:** Navy đậm / slate, bảo đảm độ tương phản theo WCAG.
- **Ưu tiên thiết kế:** Tối giản, sang trọng, có khoảng trắng, nhấn bằng typography; không lạm dụng khung, hiệu ứng bóng hoặc màu vàng trên nền trắng thiếu tương phản.
- **Ảnh/visual được phép:** Logo gốc, ảnh tĩnh không có người về cân công lý, sách luật, cột kiến trúc, tòa nhà, hoa sen cách điệu, icon line art.
- **Cấm:** mọi ảnh chứa mặt người, ảnh đại diện giả, người mẫu, ảnh luật sư AI, ảnh đội ngũ, avatar testimonials; không lấy mockup desktop/mobile làm ảnh hiển thị trong website.

### 4.2 Design tokens

Tạo CSS variables trong `globals.css`: `--color-brand-navy`, `--color-brand-gold`, `--color-brand-ivory`, `--color-text`, `--color-border`, `--container-max`, `--radius-*`, shadow, spacing. Tạo semantic states: `focus`, `error`, `success`, `muted`.

- Container nội dung tối đa `1200px` (có thể dùng 1180–1240px tùy thực tế), padding responsive.
- Heading responsive với `clamp()`; typography tiếng Việt không bị cắt dấu.
- Dùng `rem` và responsive spacing, hạn chế fixed `height`.
- Chỉ bổ sung transition nhẹ; hỗ trợ `prefers-reduced-motion: reduce`.

### 4.3 Responsive bắt buộc

| Viewport | Yêu cầu |
| --- | --- |
| 320–479px | 1 cột, menu hamburger, CTA không chồng chữ, form full width |
| 480–767px | 1 cột, padding tốt hơn, bố cục hero dễ đọc |
| 768–1023px | Tablet, card có thể 2 cột, header thích ứng |
| 1024–1279px | Desktop compact, grid 2–4 cột tùy khối |
| >=1280px | Desktop rộng, max-width và khoảng trắng có kiểm soát |

**Yêu cầu đặc biệt theo feedback mockup:** màn hình điện thoại phải đúng tỷ lệ và phần hero trên mobile **không được quá dài**. Tuyệt đối không dựng khung điện thoại dài vô lý trên trang thật. Đặt nội dung hero mobile súc tích, ảnh nền minh họa nếu có chỉ là trang trí, dịch vụ là card 1 cột, bảo đảm hiển thị tiêu đề + CTA sớm mà không phải cuộn quá nhiều.

- Mobile navigation: button có `aria-expanded`, có thể dùng Sheet/Drawer; đóng bằng ESC và khi click link; giữ focus đúng.
- Các vùng chạm tối thiểu khoảng 44x44px.
- Không xuất hiện horizontal scroll ở 320, 360, 375, 390, 430, 768, 1024, 1440px.
- Bảng dài cần responsive; địa chỉ/email không làm vỡ bố cục.
- Không che form bởi sticky CTA hoặc mobile bottom bar.

---

## 5. Information architecture / Trang / Component

### 5.1 Các tuyến trang V1 (phải triển khai)

| Route | Mô tả |
| --- | --- |
| `/` | Landing page chính |
| `/gioi-thieu` | Thông tin công ty, người đại diện (chỉ text, không ảnh mặt người), đăng ký hoạt động |
| `/dich-vu` | Danh sách 4 lĩnh vực đăng ký |
| `/dich-vu/[slug]` | Trang chi tiết lĩnh vực; nội dung lấy JSON |
| `/lien-he` | Form tư vấn + thông tin liên hệ |
| `/chinh-sach-bao-mat` | Chính sách nhận và xử lý thông tin gửi qua form, bản dự thảo chờ rà soát pháp lý |
| `/not-found` | 404 với đường dẫn trở về trang chủ |

### 5.2 Tuyến trang P1

| Route | Mô tả |
| --- | --- |
| `/kien-thuc-phap-luat` | Danh sách bài viết đã duyệt |
| `/kien-thuc-phap-luat/[slug]` | Bài viết, ngày cập nhật, nguồn tham khảo khi có |

### 5.3 Landing page sections (đúng thứ tự)

1. `SiteHeader`: logo bên trái; Trang chủ / Giới thiệu / Dịch vụ / Quy trình / Liên hệ; CTA điện thoại / tư vấn.
2. `HeroSection`: eyebrow, heading, mô tả ngắn, 2 CTA; phối hình cân công lý/sách luật/đồ họa không người.
3. `TrustStrip`: 3–4 ưu điểm biểu đạt thận trọng, **không kèm số liệu tự tạo**.
4. `ServicesSection`: 4 dịch vụ chính, mỗi card icon, tên, mô tả ngắn, link chi tiết.
5. `AboutSection`: giới thiệu công ty, thông tin pháp lý tóm tắt, logo hoặc kiến trúc (không ảnh luật sư).
6. `ValuesSection`: Uy tín / Chuẩn mực / Đồng hành.
7. `ProcessSection`: Tiếp nhận yêu cầu → Phân tích & tư vấn → Triển khai công việc → Cập nhật & đồng hành; quy trình đề xuất, nội dung chờ công ty duyệt.
8. `ContactSection`: form 4 trường và thông tin liên hệ trực tiếp; form cũng xuất hiện ở `/lien-he`.
9. `SiteFooter`: tên pháp lý, hotline, email, địa chỉ, liên kết trang, chính sách bảo mật.

**Các nút chức năng:**

- `Liên hệ tư vấn` → `#lien-he` hoặc `/lien-he`.
- `Tìm hiểu dịch vụ` → `#dich-vu` hoặc `/dich-vu`.
- Click điện thoại → `tel:+84973787969`.
- Click email → `mailto:dhlaw642@gmail.com`.
- Maps chỉ mở đường dẫn bản đồ hợp lệ sau khi có URL được xác minh, **không tự tạo tọa độ**.

---

## 6. Dữ liệu JSON / Kiểu dữ liệu / Build validation

### 6.1 Tổ chức files

```text
src/data/
├── site.json                 # site name, CTA, social (nếu có), SEO defaults
├── company.json              # dữ liệu pháp lý và liên hệ duy nhất
├── navigation.json
├── homepage.json             # hero, values, process, section content
├── services/
│   ├── tham-gia-to-tung.json
│   ├── tu-van-phap-luat.json
│   ├── dai-dien-ngoai-to-tung.json
│   └── dich-vu-phap-ly-khac.json
└── articles/                 # P1, khi có bài viết được duyệt
    ├── index.json
    └── *.json
```

### 6.2 Mẫu `company.json` (thông tin được xác nhận)

```json
{
  "legalName": "CÔNG TY LUẬT TRÁCH NHIỆM HỮU HẠN DH26 LAW",
  "tradeName": "CÔNG TY LUẬT TNHH DH26 LAW",
  "brandName": "DH26 LAW",
  "contact": {
    "phoneDisplay": "0973.787.969",
    "phoneE164": "+84973787969",
    "email": "dhlaw642@gmail.com",
    "address": "Số 4 ngách 7/35, Thái Hà, phường Đống Đa, TP. Hà Nội"
  },
  "representative": {
    "name": "Bùi Xuân Dương",
    "role": "Giám đốc",
    "profession": "Luật sư",
    "lawyerCardNumber": "21269/LS",
    "lawyerCardIssuedDate": "2024-05-20",
    "lawyerCardIssuedBy": "Liên đoàn Luật sư Việt Nam",
    "barAssociation": "Đoàn Luật sư TP. Hà Nội"
  },
  "registration": {
    "number": "01.2026.02.2912/TP/ĐKHĐ",
    "date": "2026-09-21",
    "issuedBy": "Sở Tư pháp TP. Hà Nội"
  }
}
```

### 6.3 Mẫu cấu trúc `service` (dữ liệu biên tập)

```json
{
  "slug": "tu-van-phap-luat",
  "title": "Tư vấn pháp luật",
  "summary": "Hỗ trợ giải đáp và tư vấn các vấn đề pháp lý theo nhu cầu của khách hàng.",
  "body": [
    { "type": "paragraph", "text": "Thông tin chi tiết sẽ được công ty rà soát và phê duyệt trước khi xuất bản." }
  ],
  "seo": {
    "title": "Tư vấn pháp luật | DH26 LAW",
    "description": "Tìm hiểu dịch vụ tư vấn pháp luật của Công ty Luật TNHH DH26 LAW tại Hà Nội."
  },
  "status": "published"
}
```

**Bắt buộc:**

- Tạo `src/schemas/content.schema.ts` (Zod) và `src/lib/content.ts` để load + validate nội dung.
- Build fail với trường thiếu, sai kiểu, slug trùng, reference broken hoặc bài public thiếu metadata.
- Không `fs.writeFile()` vào `src/data` tại runtime production.
- Chỉ render bài viết `published` nếu đã được duyệt; dữ liệu sample có thể giữ `draft` và không index.
- Các trang từ slug dùng `generateStaticParams`; slug lạ trả 404; không render page rỗng.
- Cập nhật nội dung = sửa JSON → PR → merge → Vercel redeploy.

---

## 7. Form liên hệ (V1 — bắt buộc chạy thực tế khi có credentials)

### 7.1 Trường form

| Field | Loại | Validation đề xuất |
| --- | --- | --- |
| `name` | text | Required, trim, 2–100 ký tự |
| `phone` | tel | Required, hỗ trợ số Việt Nam dạng `0...` hoặc `+84...`, kiểm tra hợp lệ |
| `email` | email | Required, email chuẩn, tối đa 254 ký tự |
| `message` | textarea | Required, trim, 20–2000 ký tự |
| `consent` | checkbox | Bắt buộc đồng ý chính sách xử lý thông tin, link đến trang chính sách |
| `turnstileToken` | hidden/token | Chỉ được chấp nhận khi server xác minh thành công ở production |

### 7.2 Trải nghiệm người dùng

- Hiện label rõ ràng, placeholder bổ sung không thay thế label.
- Inline validation bằng Zod resolver, aria-invalid và thông báo lỗi dễ hiểu bằng tiếng Việt.
- Disable submit trong lúc gửi; trạng thái loading, success, error; chống double click.
- Success chỉ hiển thị sau khi API xác nhận nhà cung cấp email đã chấp nhận yêu cầu gửi.
- Khi thất bại, **giữ lại các field**, cho thử lại, hiển thị hotline/email thay thế.
- Không gửi thông tin riêng tư lên analytics, URL query hoặc client log.

### 7.3 API `POST /api/contact`

Server-side flow:

1. Kiểm tra content-type, kích thước payload; parse body an toàn.
2. Validate bằng Zod phía server, bất kể client đã validate.
3. Xác minh Turnstile với Cloudflare `siteverify` (token một lần; kiểm tra success/hostname khi phù hợp).
4. Áp dụng chống lạm dụng phù hợp Vercel (Turnstile + WAF/rate limit dịch vụ có trạng thái dùng chung); **không dùng in-memory Map làm rate limiter production**.
5. Tạo subject/email template rõ nguồn (`Yêu cầu tư vấn mới từ website DH26 LAW`), escape/encode dữ liệu người dùng; `replyTo` là email khách, `from` là email theo domain đã xác minh.
6. Gửi qua Resend với `RESEND_API_KEY`; chỉ kết luận thành công nếu provider xác nhận request send thành công.
7. Trả JSON cố định, ví dụ `{ "success": true, "message": "Yêu cầu của bạn đã được tiếp nhận." }`.
8. Không log toàn bộ số điện thoại, email, nội dung tin nhắn hoặc secrets trong production.

Mã lỗi có ý nghĩa: malformed 400, validation 422, rate limited 429, upstream send failure 502, missing configuration 503. **Không trả HTTP 200 giả khi thiếu API key hoặc gửi email lỗi.**

### 7.4 Quyết định lưu trữ

- **V1:** dữ liệu nội dung website bằng JSON trong Git, form liên hệ chỉ gửi email; không cần lưu lead database.
- **P1 tùy chọn:** mỗi yêu cầu hợp lệ là một object JSON riêng trong **Vercel Blob Private** (bảo vệ truy cập, thời hạn lưu, không dùng public blob), chỉ bật theo env `CONTACT_PERSISTENCE=blob` sau khi được phép.
- Vercel Function filesystem chỉ đọc, ngoại trừ vùng tạm `/tmp`; **không thể lưu bền vững vào `contacts.json` cùng mã nguồn**.
- Chính sách bảo mật phải nêu mục đích sử dụng thông tin liên hệ, quyền riêng tư và đầu mối liên hệ; cần công ty duyệt trước production.

---

## 8. SEO kỹ thuật / Local SEO

### 8.1 SEO áp dụng cho tất cả trang public

- Dùng server-rendered/prerendered HTML, `<html lang="vi">`.
- Metadata API: title, description **riêng theo trang**, `metadataBase`, canonical absolute, Open Graph, Twitter card.
- `app/sitemap.ts` gồm các trang đã xuất bản; loại bỏ draft, preview và API route.
- `app/robots.ts` cho phép index trang public, ngăn route nhạy cảm; **không coi robots.txt là cơ chế bảo mật**.
- 404 trả status 404 và không index.
- Heading hierarchy: 1 H1 chính/trang, H2/H3 đúng cấp; breadcrumb ở trang con.
- URL tiếng Việt **không dấu** theo slug; không dùng slug ngẫu nhiên.
- Internal links điều hướng các nhóm dịch vụ và liên hệ.
- Ảnh có `alt` hợp lý; ảnh trang trí để `alt=""`.
- Hình Open Graph 1200×630 với logo/slogan/visual **không mặt người**.
- Structured data: `Organization` / `LegalService` (thuộc tính hợp lệ), `BreadcrumbList` ở trang con; dữ liệu NAP (name, address, phone) phải nhất quán với `company.json`.
- Không đưa rating, review, aggregateRating, awards, kinh nghiệm, map geo hoặc social link nếu không có nguồn xác thực.
- Chuẩn bị hướng dẫn kết nối Google Search Console; submit sitemap sau khi production domain sẵn sàng.

### 8.2 SEO content

- Title trang chủ gợi ý: `Công ty Luật DH26 LAW – Dịch vụ pháp lý tại Hà Nội`.
- Description gợi ý: `Công ty Luật TNHH DH26 LAW cung cấp dịch vụ tham gia tố tụng, tư vấn pháp luật, đại diện ngoài tố tụng và các dịch vụ pháp lý khác tại Hà Nội.`
- Mỗi dịch vụ có phần nội dung riêng, không tạo 4 trang trùng lặp chỉ thay title.
- Bài viết P1 cần nguồn tham khảo, ngày xuất bản/cập nhật thật, người duyệt chuyên môn nếu được cung cấp.
- Không đưa cam kết xếp hạng Google hoặc KPI index trong ngày launch; SEO cần được đo bằng dữ liệu thực tế.

---

## 9. Cấu trúc thư mục đề xuất

```text
dh26-law/
├── public/
│   ├── brand/                 # logo chính do khách hàng cung cấp, favicon, OG assets
│   ├── images/                # ảnh pháp lý không người
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── gioi-thieu/page.tsx
│   │   ├── dich-vu/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── lien-he/page.tsx
│   │   ├── chinh-sach-bao-mat/page.tsx
│   │   ├── kien-thuc-phap-luat/     # P1
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── api/contact/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── opengraph-image.tsx      # hoặc ảnh OG tĩnh
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── services/
│   │   ├── contact/
│   │   └── seo/
│   ├── data/
│   │   ├── site.json
│   │   ├── company.json
│   │   ├── homepage.json
│   │   ├── navigation.json
│   │   ├── services/
│   │   └── articles/           # P1
│   ├── lib/
│   │   ├── content.ts
│   │   ├── metadata.ts
│   │   ├── jsonld.ts
│   │   ├── email.ts
│   │   ├── turnstile.ts
│   │   └── utils.ts
│   ├── schemas/
│   │   ├── content.schema.ts
│   │   └── contact.schema.ts
│   └── types/
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── .gitignore
├── README.md
├── IMPLEMENTATION_PROGRESS.md
├── plan.md
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```

Không tạo thư mục và component rỗng chỉ để khớp sơ đồ; chỉ tạo các file thực sự cần khi triển khai.

---

## 10. Environment và Vercel

### 10.1 `.env.example`

```dotenv
# Domain chính; thay thế trước khi public
NEXT_PUBLIC_SITE_URL=https://your-domain.example

# Chỉ sử dụng server-side
RESEND_API_KEY=
CONTACT_RECIPIENT_EMAIL=dhlaw642@gmail.com
CONTACT_SENDER_EMAIL=

# Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Optional P1
CONTACT_PERSISTENCE=none
BLOB_READ_WRITE_TOKEN=
```

- Chỉ env được phép public mới có prefix `NEXT_PUBLIC_`.
- `CONTACT_SENDER_EMAIL` phải thuộc domain sender đã xác minh với Resend. Không mặc định gửi `from: dhlaw642@gmail.com` qua Resend nếu chưa có quyền gửi từ domain đó.
- Vercel Project Settings: Node.js version `24.x`, framework Next.js, root đúng repo, environment production/preview tách biệt.
- Vercel **Hobby chỉ cho mục đích cá nhân/phi thương mại** theo chính sách hiện hành; website công ty luật cần chọn Vercel Pro hoặc gói cho phép thương mại.
- Không triển khai production thực sự / cấu hình DNS khi chưa có quyền truy cập tài khoản Vercel/domain.
- Preview deployments: ngăn index và không dùng dữ liệu khách thật khi kiểm thử.
- Tránh tải file tĩnh từ domain bên ngoài không rõ bản quyền; lưu asset đã cấp phép tại `public`.

### 10.2 Scripts cần có trong `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "engines": {
    "node": "24.x"
  }
}
```

Nếu CLI scaffold tạo scripts/format khác, điều chỉnh nhất quán; không ghi đè dependencies sẵn có.

---

## 11. Security, Accessibility, Performance

### 11.1 Security

- Input validation server-side, escaping email HTML, giới hạn payload.
- Turnstile server verification; request thiếu/invalid token không được gửi email production.
- Rate limiting dùng service/WAF có trạng thái chia sẻ hoặc giải pháp phù hợp Vercel; không tin in-memory counter ở serverless.
- Không ghi dữ liệu form vào URL, Analytics events, console logs, Error tracking không được redact.
- Bảo vệ secrets, không tạo public endpoint liệt kê lead hoặc Private Blob.
- Trang chính sách bảo mật phải được duyệt bởi công ty; nội dung template chỉ là bản dự thảo.

### 11.2 Accessibility

- HTML landmarks: header, nav, main, footer.
- Tab order hợp lý, keyboard controls hoạt động, visible focus, ESC đóng menu.
- Form labels gắn đúng input, inline error dùng `aria-describedby`; success/error dùng `role="status"` hoặc `aria-live`.
- Kiểm tra tương phản, không dùng màu làm tín hiệu duy nhất.
- Ảnh ý nghĩa có alt; ảnh trang trí ẩn khỏi accessibility tree.
- Hỗ trợ reduced motion và zoom 200% không vỡ layout.

### 11.3 Performance / Core Web Vitals (mục tiêu)

- LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 ở p75 field data khi đủ dữ liệu.
- Mục tiêu Lighthouse mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 trong điều kiện đo ổn định; đây không phải cam kết tuyệt đối.
- Optimized fonts/weights, ảnh hero kích thước phù hợp và được ưu tiên tải, các ảnh còn lại lazy load; dùng `next/image` khi phù hợp.
- Không đưa libraries lớn vào critical JS; dùng Server Components, CSS và static pages tối đa.
- Theo dõi bundle size; loại bỏ icon imports thừa và dependencies không sử dụng.

---

## 12. Test plan / Tiêu chí nghiệm thu

### 12.1 Unit / Component

- [ ] Schema của `company.json` và `services/*.json` hợp lệ.
- [ ] JSON sai kiểu / thiếu trường / slug trùng được báo lỗi rõ ràng.
- [ ] `getServiceBySlug()` và `generateStaticParams()` hoạt động, slug không tồn tại 404.
- [ ] Contact validation: hợp lệ / rỗng / email sai / số điện thoại sai / ký tự quá dài.
- [ ] Contact API: Turnstile fail, provider fail, env thiếu → **không trả thành công giả**.
- [ ] Contact API: provider mock thành công → response đúng contract.
- [ ] SEO helpers tạo canonical và breadcrumb hợp lệ, không leak env secrets.

### 12.2 E2E / Responsive

- [ ] Trang chủ hiển thị đầy đủ hero, services, about, process, contact.
- [ ] Menu mobile mở/đóng được bằng click và keyboard; mọi nav link đúng.
- [ ] Tất cả CTA cuộn/điều hướng đúng; `tel:` / `mailto:` chính xác.
- [ ] Form nhập, validation, submit loading/success/error hoạt động.
- [ ] Kiểm tra widths **320, 360, 375, 390, 430, 768, 1024, 1440px**.
- [ ] Không horizontal overflow, chữ không bị cắt, button không đè form, 100% content không lộ khuôn mặt người.
- [ ] Lighthouse và axe/accessibility audit ở mobile & desktop.
- [ ] `sitemap.xml`, `robots.txt`, metadata và OG image truy cập được.
- [ ] Các link nội bộ public không 404, ngoại trừ test chủ động 404.
- [ ] `pnpm lint && pnpm typecheck && pnpm test && pnpm build` thành công.

### 12.3 Definition of Done cho V1

- Tất cả route P0 tồn tại và hiển thị nội dung đã xác minh (hoặc copy đề xuất được đánh dấu cần duyệt).
- Trang chủ giống **tinh thần** mockup đã chốt: navy/gold, logo gốc, cân công lý/sách luật, không có ảnh người; không cố copy pixel bằng cách chèn một ảnh mockup nguyên trang.
- UI responsive trên danh sách viewport nghiệm thu; không bị lỗi hero quá cao ở mobile.
- Form gửi email thật sau khi có secrets; khi chưa có secrets thì xử lý lỗi công khai và rõ ràng, không báo gửi thành công giả.
- SEO trang public có metadata, canonical, sitemap và structured data đúng dữ liệu thật.
- Không còn lỗi TypeScript/ESLint/build/test nghiêm trọng.
- Có `README.md` ghi cách chạy, cập nhật JSON, đặt env, deploy Vercel, vận hành form và danh sách việc chủ sở hữu cần làm.

---

## 13. Phases và checklist thực thi (làm tuần tự)

### Phase 0 — Audit & Bootstrap

- [ ] Kiểm tra repository, Node 24, pnpm, assets logo và các file cũ.
- [ ] Khởi tạo Next.js 16 nếu repo trống; thiết lập eslint, TS strict, Tailwind 4.
- [ ] Cấu hình fonts, global tokens, cn/utils, base layout, favicon tạm nếu chưa có asset.
- [ ] Tạo `.env.example`, `.gitignore`, README khởi tạo.
- [ ] Chạy `lint`, `typecheck`, `build`.

**Exit:** Dev server chạy được; logo/placeholder và font hiển thị; build xanh.

### Phase 1 — Data & Shared Layout

- [ ] Tạo `company.json`, `site.json`, `homepage.json`, `navigation.json`.
- [ ] Tạo 4 JSON dịch vụ với tên chính xác theo giấy đăng ký; mô tả trung tính.
- [ ] Tạo Zod content schemas, helpers, validation khi build.
- [ ] Tạo shared `Header`, `MobileNav`, `Footer`, `Container`, `SectionHeading`, button variants.
- [ ] Header/menu/footer phải responsive và keyboard accessible.

**Exit:** Dữ liệu doanh nghiệp chỉ có một source of truth; layout có thể tái sử dụng.

### Phase 2 — Landing Page UI

- [ ] Hero 2 CTA, hình pháp luật/hoạ tiết không người.
- [ ] Trust strip / service cards / about / values / process.
- [ ] Đưa contact teaser và section form vào homepage (giai đoạn này có thể render form UI, nhưng không giả lập gửi thành công).
- [ ] Chỉnh spacing & typography cho 320–1440px, ưu tiên hero mobile gọn.
- [ ] Kiểm tra screenshot responsive.

**Exit:** Homepage đẹp, sạch, không tràn ngang, không ảnh người và đúng nhận diện.

### Phase 3 — Trang con và SEO

- [ ] `/gioi-thieu`, `/dich-vu`, `/dich-vu/[slug]`, `/lien-he`, `/chinh-sach-bao-mat`, 404.
- [ ] `generateStaticParams`, `generateMetadata`, metadataBase/canonical/OG.
- [ ] `sitemap.ts`, `robots.ts`, JSON-LD tổ chức/dịch vụ/breadcrumb.
- [ ] Validate internal links + SEO copy không sai dữ liệu pháp lý.

**Exit:** Các trang P0 hoạt động, sitemap hợp lệ, 404 đúng và Google có thể đọc HTML nội dung.

### Phase 4 — Contact backend

- [ ] Zod schema + React Hook Form + lỗi tiếng Việt + trạng thái UI.
- [ ] `POST /api/contact` với server-side validation và chống spam.
- [ ] Resend adapter và template email an toàn; không commit secrets.
- [ ] Mock test thành công/thất bại; production chỉ bật khi env đã đầy đủ.
- [ ] Nếu chưa có credential, hoàn thiện code & ghi lại bước kích hoạt rõ trong README.

**Exit:** Hệ thống contact có thể kiểm thử và kích hoạt an toàn; không có thông báo gửi thành công giả.

### Phase 5 — QA & Vercel readiness

- [ ] E2E theo width đã liệt kê, review keyboard/focus.
- [ ] Lighthouse optimization, images/font/bundle.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` toàn bộ PASS.
- [ ] Hướng dẫn Vercel Pro, Node 24, envs, domain, SSL, Preview Noindex, Search Console.
- [ ] Cập nhật README, `IMPLEMENTATION_PROGRESS.md`, nêu pending manual tasks.

**Exit:** Code sẵn sàng PR và deploy, có hướng dẫn bàn giao rõ.

### Phase P1 (chỉ thực hiện sau khi V1 PASS)

- [ ] Blog/Knowledge pages dựa trên JSON đã duyệt.
- [ ] Optional private JSON lead archive trong Vercel Blob.
- [ ] Analytics/Speed Insights có sự đồng ý chính sách phù hợp.

---

## 14. Yêu cầu báo cáo kết quả của Codex

Sau mỗi phase, trả lời ngắn gọn theo mẫu:

```text
PHASE X — <Tên phase>
Status: PASS / PARTIAL / BLOCKED
Changed files: ...
Implemented: ...
Tests run: ...
Results: ...
Known issues: ...
Next phase: ...
```

Khi kết thúc V1, cần cung cấp:

1. Danh sách route đã hoàn thành, checklist nghiệm thu.
2. Các câu lệnh chạy dự án và kiểm thử.
3. Các env còn cần chủ sở hữu cung cấp (chỉ tên biến, tuyệt đối không tiết lộ giá trị).
4. Hướng dẫn cập nhật thông tin công ty/dịch vụ thông qua JSON.
5. Danh sách nội dung cần luật sư duyệt và tài sản cần bổ sung (logo chuẩn, domain, OG, ảnh pháp lý nếu thiếu).
6. Kết quả build/test và vấn đề cần xử lý trước production.

---

## 15. Checklist chủ dự án cần cung cấp để Go-live

- [ ] File logo chính xác, nền trong suốt (SVG ưu tiên, hoặc PNG chất lượng cao) + phiên bản âm bản cho nền tối.
- [ ] Domain website chính thức để cấu hình canonical và DNS.
- [ ] Quyền truy cập Vercel trên gói hỗ trợ thương mại.
- [ ] Email sender domain đã verify trên Resend và API key.
- [ ] Site key + secret key Cloudflare Turnstile cho domain production.
- [ ] Phê duyệt copy marketing/giới thiệu/quy trình, mô tả dịch vụ.
- [ ] Phê duyệt chính sách bảo mật/đồng ý xử lý thông tin khách liên hệ.
- [ ] Kiểm tra lại số điện thoại, email, địa chỉ, số đăng ký và tên người đại diện trước khi xuất bản.
- [ ] Kết nối Google Search Console sau khi DNS và domain hoàn tất.

---

## 16. Tài liệu kỹ thuật gốc (tham khảo nếu API cập nhật)

- Next.js metadata: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js static params: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Next.js sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Vercel Node.js: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- Vercel runtime files: https://vercel.com/docs/functions/runtimes
- Vercel commercial plan policy: https://vercel.com/docs/limits/fair-use-guidelines
- Resend Next.js: https://resend.com/nextjs
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Vercel Private Blob (chỉ P1): https://vercel.com/docs/vercel-blob/private-storage

> **Lệnh giao việc đề xuất cho Codex:**  
> `Đọc kỹ plan.md và triển khai dự án DH26 LAW theo đúng các phase 0→5. Bắt đầu bằng audit repo; không sử dụng ảnh có người; nội dung trang web chỉ lấy từ JSON; bảo đảm Node 24, Next 16, SEO, responsive và build pass. Sau mỗi phase cập nhật IMPLEMENTATION_PROGRESS.md và thông báo kết quả, tiếp tục phase tiếp theo nếu không có blocker thực sự. Không tự nhận form gửi thành công khi chưa tích hợp email thực.`
