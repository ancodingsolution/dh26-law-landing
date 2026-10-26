# DH26 LAW

Website Next.js 16, React 19, TypeScript strict, Tailwind 4; Node.js 24 và pnpm 10.28.2. Dữ liệu public từ JSON, không database/CMS; Server Components mặc định.

Đọc `IMPLEMENTATION_PROGRESS.md` để biết trạng thái kiểm thử thực tế. Logo gốc chưa được cung cấp, hiện dùng text logo; không có ảnh người.

## Chạy local

```sh
corepack enable # nếu Corepack có sẵn; nếu không, cài pnpm 10.28.2 trước
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

## Kiểm tra

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm test:e2e:form
pnpm test:a11y
```

E2E dùng production build có sẵn, tự mở/đóng Next tại port 3100. Có thể đặt `E2E_BASE_URL` để kiểm tra server đã chạy. `docs/qa/` chứa screenshots và Lighthouse reports; `playwright-report/` và `test-results/` là output tạm. CI GitHub Actions chạy lint/typecheck/unit/build/E2E.

`test:e2e:form` build tạm với public key giả rõ ràng để kiểm tra UI bằng Playwright, mock script Turnstile và API ở trình duyệt (không có bypass phía server), sau đó luôn build lại bằng env ban đầu. Các ca này skip trong lệnh E2E thường khi chưa có fixture. Không gửi thư thật, không đổi file env. Không chạy đồng thời với server/build khác trên cùng `.next`.

Trong workspace hiện tại, Node 24.22.1 được tải chính thức, kiểm SHA256 và đặt riêng trong `.tools` (ignored). PowerShell có thể dùng runtime này cho phiên hiện tại:

```powershell
$env:PATH = "$PWD/.tools/node-v24.22.1-win-x64;$env:PATH"
pnpm dev
```

Máy khác cần tự cài Node 24 và pnpm; `.tools` không phải phần mã nguồn bàn giao. Không commit `.env.local`.

## Routes V1

| Route | Nội dung |
| --- | --- |
| `/` | Hero, trust, dịch vụ, giới thiệu, giá trị, quy trình, form |
| `/gioi-thieu` | Công ty, giấy đăng ký, người đại diện bằng text |
| `/dich-vu` | 4 lĩnh vực hoạt động |
| `/dich-vu/tham-gia-to-tung` | Tham gia tố tụng |
| `/dich-vu/tu-van-phap-luat` | Tư vấn pháp luật |
| `/dich-vu/dai-dien-ngoai-to-tung` | Đại diện ngoài tố tụng |
| `/dich-vu/dich-vu-phap-ly-khac` | Dịch vụ pháp lý khác |
| `/lien-he` | Form + NAP |
| `/chinh-sach-bao-mat` | Chính sách dự thảo, có đánh dấu cần duyệt |
| Route/slug lạ | HTTP 404, noindex, CTA về trang chủ |
| `/api/contact` | Chỉ POST; GET trả 405 |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon` | SEO kỹ thuật |

## Cập nhật nội dung qua JSON

- `src/data/company.json`: nguồn duy nhất cho tên pháp lý, NAP, người đại diện và số/ngày đăng ký. Ngày cấp đúng là 21/09/2026, không phải ngày đăng bố cáo.
- `src/data/site.json`: SEO trang chủ, nhãn, CTA, disclaimer.
- `src/data/homepage.json`: hero, trust, values, process, contact intro và thứ tự 4 dịch vụ.
- `src/data/navigation.json`: điều hướng; chỉ được trỏ tới route public được hỗ trợ.
- `src/data/services/*.json`: slug/tên/mô tả/body/SEO/status. Chỉ `published` được render và index. Tên file phải khớp slug. V1 cố định 4 nhóm dịch vụ đăng ký; nếu bổ sung nhóm mới phải cập nhật loader `src/lib/content.ts` và rà soát phạm vi pháp lý trước.
- `src/data/pages.json`: trang con, bản dự thảo bảo mật, 404.
- `src/data/contact.json`: nhãn, validation, API feedback và tiêu đề email.

Quy trình: sửa JSON → chạy kiểm tra → PR/duyệt nội dung → merge → Vercel redeploy. Prebuild kiểm tra tất cả JSON, trường bắt buộc, kiểu dữ liệu, slug trùng, metadata, reference và domain production. Không có thao tác ghi JSON lúc runtime. Không đưa nội dung pháp luật chuyên sâu hoặc tuyên bố chuyên môn/thành tích chưa được công ty xác nhận.

Logo gốc chưa được cung cấp: hiện là text logo và favicon chữ tạm. Cung cấp logo sáng/tối trong `public/brand/`, sau đó tích hợp giữ nguyên file gốc, dùng next/image với kích thước và alt hợp lý. OG hiện đã có 1200×630 dạng chữ; cập nhật với logo chính thức sau khi được cung cấp. Không có ảnh người hoặc mockup nguyên trang nhúng vào website.

### Giao diện theo ảnh tham chiếu — 25/10/2026

Trang chủ đã cập nhật theo hình desktop/mobile do chủ sở hữu gửi: header trắng, hero ảnh navy/gold với tên DH26 LAW nổi bật, 4 trust items, dịch vụ dạng card, ảnh giới thiệu, quy trình icon/số bước và form tư vấn cạnh nội dung trên desktop. Mobile giữ một cột, hero ngắn, card dịch vụ gọn và ảnh kiến trúc có tỷ lệ giới hạn.

Ảnh minh họa tạo bằng **built-in image_gen**, không có người, không phải ảnh văn phòng thật của công ty:

- `public/images/legal-hero-v2.webp`: cân công lý, sách luật, bút trên bàn; khoảng 84 KB.
- `public/images/legal-architecture-v2.webp`: cột kiến trúc cổ điển; khoảng 170 KB.

Prompt đầy đủ và nguồn gốc ghi tại `docs/visual-assets-v2.json`. Chỉ tối ưu kích thước/encoding sang WebP khi đưa ảnh vào repo. `next/image` đảm nhận responsive sizes, hero eager/high priority, about lazy/low priority; schema và prebuild kiểm tra tham chiếu asset. Sửa đường dẫn/alt qua `homepage.json`. CSS mới ở `src/app/home-v2.css`; form compact dùng chung validation/API với form ở trang liên hệ. Logo trong mockup không được dựng lại từ ảnh vì chưa có asset gốc riêng. Dữ liệu pháp lý và cơ chế chống spam/gửi mail được giữ nguyên.

## Kích hoạt form (Phase 4)

Form không gửi khi chưa có `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. API trả 503 nếu thiếu cấu hình email/Turnstile hoặc cấu hình Google Sheets chỉ được điền một phần. Khi chưa bật Sheets, chỉ trả `success: true` sau khi Resend trả ID xác nhận chấp nhận email. Khi bật Sheets, API lưu Sheet trước rồi gửi email; chỉ báo tiếp nhận thành công khi Google xác nhận đã ghi một dòng. Nếu email lỗi sau khi đã lưu, API vẫn báo thành công và log mã yêu cầu để nhân sự tra cứu; chưa có hàng đợi tự gửi lại email. Việc chấp nhận email bởi provider chưa đồng nghĩa thư đã đến inbox; kiểm tra trạng thái delivery/bounce trong Resend khi vận hành.

Hướng dẫn đầy đủ tạo Service Account, bảng tính và lấy env: [Cấu hình Google Sheets](docs/google-sheets-setup.md). Không có env Google thì luồng email hoạt động như cũ.

1. Verify domain gửi trên Resend, cung cấp `RESEND_API_KEY` và `CONTACT_SENDER_EMAIL` (email thuộc domain đã verify, không mặc định gửi từ Gmail).
2. `CONTACT_RECIPIENT_EMAIL` tùy chọn; mặc định lấy email công ty trong `company.json`.
3. Tạo Cloudflare Turnstile widget cho hostname thật; cấu hình `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_SITE_URL`. Nếu cần thử trên Preview, thêm hostname chính xác vào `TURNSTILE_ALLOWED_HOSTNAMES` và dashboard Turnstile. Không có bypass token ở development/production.
4. Production: tạo Vercel Firewall/WAF rate-limit rule cho phương thức POST, path `/api/contact`, theo IP (ví dụ 5 requests/60 giây, block 429 trong 60 giây; điều chỉnh khi vận hành). Chỉ đặt `CONTACT_WAF_CONFIGURED=true` sau khi kiểm tra rule có hiệu lực. Đây là biện pháp có trạng thái chia sẻ của hạ tầng, không dùng bộ đếm trong RAM của function. Flag không tự tạo rule.
5. Phê duyệt chính sách bảo mật, thời hạn lưu giữ email, nội dung consent và copy trước go-live. Redeploy vì biến NEXT_PUBLIC được đóng gói khi build. Gửi thử một yêu cầu được phép, kiểm tra inbox và các nhánh lỗi; không dùng thông tin khách thật khi QA.

API dùng Zod, giới hạn thực tế 16KiB kể cả request chunked, honeypot, kiểm tra Origin khi có, xác minh token/hostname/action `contact`, timeout upstream, escape HTML email và replyTo được validate. Lưu lead vào Google Sheets khi được cấu hình; không lưu vào filesystem hoặc JSON công khai, không log PII/secrets. Sheets dùng RAW để bảo toàn số điện thoại và tránh diễn giải nội dung thành công thức. Không tự retry append sau timeout vì có thể tạo dòng trùng. Response: 400 malformed/type, 403 origin, 413 payload, 422 validation/spam, 429 rate limit, 502 upstream, 503 configuration. WAF có thể trả 429 trước khi request đến function.

Unit test mock Cloudflare/Resend/Google và component test kiểm tra loading/success/error; không gửi email hoặc ghi bảng tính thật trong bộ test.

## Biến môi trường cần cung cấp

| Tên biến | Yêu cầu |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Domain canonical HTTPS chính thức; bắt buộc khi VERCEL_ENV=production |
| `RESEND_API_KEY` | Secret server; bắt buộc để gửi |
| `CONTACT_SENDER_EMAIL` | Email thuộc domain đã verify; bắt buộc |
| `CONTACT_RECIPIENT_EMAIL` | Tùy chọn; mặc định email company.json |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` trong key JSON; cần khi bật lưu Sheet |
| `GOOGLE_PRIVATE_KEY` | `private_key` trong cùng JSON; secret server, nhận xuống dòng thật hoặc `\n` |
| `GOOGLE_SPREADSHEET_ID` | ID bảng tính trong URL; cần khi bật lưu Sheet |
| `GOOGLE_SHEET_NAME` | Tên tab; mặc định `Contacts` khi đã cấu hình Google, để trống nếu chỉ gửi email |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public key; cần có khi build để bật UI gửi |
| `TURNSTILE_SECRET_KEY` | Secret server để siteverify |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Tùy chọn, danh sách hostname chính xác cho Preview, phân cách bằng dấu phẩy |
| `CONTACT_WAF_CONFIGURED` | `true` sau khi rule WAF production đã bật và thử thành công |

Không dùng `NEXT_PUBLIC_` cho secrets. Không có chế độ gửi giả hoặc token bypass. Preview nên bỏ secrets hoặc dùng cấu hình kiểm thử tách biệt, không gửi đến khách thật.

## Vercel và go-live

1. Tạo Git repository, commit cả pnpm-lock.yaml, đẩy source và import vào Vercel trên gói cho phép sử dụng thương mại (Pro hoặc phù hợp hơn). Repo ban đầu chưa có `.git`; triển khai này không tự tạo remote/commit hay tài khoản.
2. Framework Next.js, root repository, Node.js 24.x, install `pnpm install --frozen-lockfile`, build `pnpm build`. `vercel.json` chọn region `sin1` cho function; không export static vì có API server.
3. Đặt env riêng cho Production/Preview. NEXT_PUBLIC_SITE_URL phải là origin sạch, không credentials/path/query/hash; build production chặn URL thiếu, localhost, HTTP và domain `.example`/`.invalid`.
4. Sau khi chủ sở hữu cấp quyền, thêm domain trong Settings → Domains, cấu hình DNS đúng giá trị Vercel cung cấp, xác nhận SSL đã cấp. Chọn một domain canonical; redirect alias/www về domain đó trên Vercel. Không tự đoán IP DNS hoặc tọa độ/maps.
5. Kích hoạt và kiểm thử Turnstile, Resend, WAF theo phần form. Chưa có credentials thì web vẫn chạy và form hiển thị trạng thái chưa sẵn sàng; API không báo success.
6. Preview/local: robots Disallow `/`, meta noindex/nofollow và X-Robots-Tag; sitemap rỗng. Production: robots allow public, disallow `/api/`, sitemap gồm 9 URL published. VERCEL_ENV do Vercel cung cấp; không tự đặt production cho Preview. Bật Deployment Protection cho Preview nếu cần kiểm soát người xem; robots không bảo vệ dữ liệu.
7. Trước khi public, luật sư/công ty phải duyệt hero/marketing, mô tả dịch vụ, giới thiệu, giá trị, quy trình, chính sách bảo mật/consent và thời hạn lưu email; xác nhận lại toàn bộ NAP, thẻ luật sư, giấy đăng ký. Dòng nhắc review trong dữ liệu/trang dịch vụ có thể được biên tập sau khi duyệt.
8. Mở production domain kiểm tra canonical/OG/robots/sitemap, thử form và inbox/bounce. Kết nối Google Search Console bằng xác minh DNS, submit `/sitemap.xml`, kiểm tra URL Inspection; theo dõi index/CWV khi có dữ liệu thực tế. Không cam kết thứ hạng hay thời điểm index.

Chưa deploy hoặc cấu hình DNS vì chưa có tài khoản/domain được cung cấp. P1 (blog, Blob private, Analytics) chưa triển khai theo phạm vi Phase 0–5.

## Lighthouse và QA

```sh
pnpm build
pnpm start --port 3200
# terminal khác: đặt CHROME_PATH nếu Chrome không ở đường dẫn workspace được hỗ trợ
pnpm audit:lighthouse http://localhost:3200
```

Script chạy mobile mặc định Lighthouse và desktop bằng desktop-config chính thức, lưu HTML/JSON trong `docs/qa/`. Local/Preview cố ý noindex nên điểm SEO Lighthouse giảm; không gỡ bảo vệ Preview để tăng điểm. Đo lại trên production HTTPS sau khi domain và quyền index được xác nhận. Chỉ số lab là phép đo tại máy kiểm thử, chưa phải Core Web Vitals p75 field data. Nếu bật Turnstile thực tế, kiểm tra lại latency/script bên thứ ba và UI ở 320px.

Thiết kế dùng tokens navy/gold/ivory, nội dung tối đa 1200px, headings clamp, vùng chạm khoảng 44px, reduced motion, skip link và form labels. Bộ QA kiểm tra 8 viewport, mọi route, keyboard/focus, text zoom 200%, axe WCAG A/AA, SSR HTML, metadata/OG, robots/sitemap và API fail-closed. Screenshots trong `docs/qa/` không phải ảnh nhúng trong website.

## Nguồn kỹ thuật đã đối chiếu

- [Next.js metadata](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params); đồng thời đọc docs đi kèm Next được cài trong node_modules.
- [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Fair Use](https://vercel.com/docs/limits/fair-use-guidelines), [WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting), [domains](https://vercel.com/docs/domains/working-with-domains).
- [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) và [widget rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/).
- [Resend send email](https://resend.com/docs/api-reference/emails/send-email).
