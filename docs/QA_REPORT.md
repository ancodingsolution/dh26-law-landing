# DH26 LAW — Báo cáo QA V1

Ngày kiểm tra gần nhất: 25/10/2026, sau cập nhật UI theo ảnh tham chiếu. Node 24.22.1; Next 16.4.3; React 19.3.1; pnpm 10.28.2; Chromium 156, Playwright 1.64.1; Lighthouse 13.5.0. Source và lockfile được tạo từ registry, không đoán patch version.

## Kết quả kiểm tra

| Kiểm tra | Kết quả |
| --- | --- |
| ESLint | PASS, không warning/error từ source |
| TypeScript strict | PASS |
| Vitest + Testing Library | 50 tests PASS |
| Next production build + content validation | PASS |
| Playwright thông thường | 24 PASS; các form fixture cases chạy riêng trong build có public test key |
| Playwright fixture form chạy riêng | 6/6 PASS, bao gồm form compact trang chủ; build thường được khôi phục sau đó |
| Axe WCAG A/AA | Không violation trên 9 trang ở 375px và 1440px |
| Responsive | 9 trang, widths 320/360/375/390/430/768/1024/1440; không tràn ngang |
| Keyboard | Skip link, menu mở/ESC/chọn link, focus về trigger, focus lỗi form: PASS |
| Phóng chữ 200% / reduced motion | PASS; đã sửa header wrap theo lỗi quan sát được |
| SEO | 9 trang có H1/title/description riêng, canonical/OG, breadcrumbs; link nội bộ 200, unknown route/slug 404 noindex |
| Production SEO configuration | Unit test robots allow public, chặn API, sitemap đủ 9 URL published: PASS |
| Preview/local SEO protection | Noindex/nofollow meta + header, robots Disallow, sitemap rỗng: PASS |
| API | Validation, byte limit, missing env, Turnstile hostname/action/token, email rejection/rate-limit/success mock: PASS |
| Dependency audit | `pnpm audit`: No known vulnerabilities found tại thời điểm kiểm tra |

Ảnh người: không có asset người, mặt người, chân dung, ảnh đội ngũ, avatar hay testimonials. Bản V2 dùng hai ảnh minh họa được tạo bằng built-in image_gen: cân công lý/sách luật và cột kiến trúc, tối ưu WebP (84 KB / 170 KB). Ảnh không mô tả văn phòng thật. Text logo và favicon chữ tạm vẫn giữ vì chưa có logo gốc. Không dựng lại logo từ ảnh mockup, không dùng mockup nguyên trang trong website. Prompt và đường dẫn asset nằm trong [visual-assets-v2.json](visual-assets-v2.json).

Đã review screenshot desktop/mobile: hero ảnh navy/gold, tên DH26 LAW nổi bật; sidebar form cạnh nội dung ở desktop, card dịch vụ gọn ở mobile, ảnh kiến trúc có chiều cao giới hạn. Thêm regression test kiểm tra ảnh tải thật và vị trí sidebar; đã sửa lỗi đường nối quy trình gây tràn ngang ở 768px. Data pháp lý, SEO routes và chống spam/email không thay đổi.

## Lighthouse

Đo trên production build phục vụ tại localhost; mobile theo cấu hình Lighthouse mặc định, desktop dùng `desktop-config` chính thức. Script tạo report riêng và tự tắt Chrome, không phụ thuộc WMI/taskkill của Windows.

| Chỉ số | Mobile | Desktop |
| --- | ---: | ---: |
| Performance | 89 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 69 | 69 |

Điểm SEO local giảm vì **cố ý chặn index/crawl Preview/local**. Không tháo bảo vệ để tăng điểm đo. Domain production chưa có nên chưa xác nhận Lighthouse SEO ≥95 trên môi trường live. Unit tests đã kiểm chứng cấu hình index/sitemap ở nhánh Production. Cần đo lại production HTTPS sau khi cấu hình domain thật.

Sau khi thêm ảnh và preload subset Latin-ext cần thiết của Noto Serif, mobile Performance tăng từ 87 lên 89; LCP lab khoảng 3.7s, CLS 0; chưa có INP và p75 field data. Performance 89 **chưa đạt mục tiêu lab 90** của plan; cần xác minh lại và tối ưu thêm critical font/JS trên production/CDN. Không nhận đây là bằng chứng đạt Core Web Vitals ngoài thực tế. Bản vector trước đây đạt mobile 91; kết quả không còn đại diện cho UI ảnh hiện tại. Hero đã dùng eager + fetchPriority high, about dùng lazy + priority low, ảnh WebP được phục vụ qua responsive next/image; không kết hợp preload với fetchPriority theo tài liệu Next 16. Header accessible name dùng nhãn native và axe PASS.

Reports: [mobile](qa/lighthouse-mobile.report.html), [desktop](qa/lighthouse-desktop.report.html); JSON đi kèm chứa số liệu đầy đủ. Screenshots: [320px](qa/home-320.png), [1440px](qa/home-1440.png). Đã review hình ảnh; mobile hero gọn, CTA sớm, section theo đúng thứ tự.

## Phạm vi và giới hạn

- Form unit/API tests dùng mock provider; E2E form fixture mock script Turnstile và API tại browser. Không gửi email thật. API production vẫn xác minh token ở Cloudflare, không chấp nhận fixture token hoặc bypass.
- Form mặc định thông báo chưa sẵn sàng vì chưa có credentials. Thiếu cấu hình server trả 503; không có success giả.
- Shared rate limiting là rule Vercel WAF cần chủ sở hữu bật. CONTACT_WAF_CONFIGURED chỉ là xác nhận vận hành, không tự tạo rule. Production API fail closed khi chưa xác nhận.
- Công cụ browser tích hợp lỗi `missing field sandboxPolicy`; đã dùng Playwright Chromium trong workspace cho toàn bộ kiểm tra trình duyệt và screenshot.
- Chưa deploy, chưa đổi DNS, chưa kiểm chứng thư thật/SSL/CWV production vì chưa có tài khoản/domain/secrets. Đây là các bước go-live của chủ sở hữu, đã ghi trong README.
- Các dependencies tooling có cảnh báo deprecation/peer thuộc ESLint 9 và nhánh OpenTelemetry của Lighthouse; không phát sinh lint/type/build/test error. Lockfile cố định dependency tree đã kiểm tra.

## Checklist trước production

- [ ] Logo gốc và bản nền tối; thay favicon chữ tạm, cập nhật OG với asset chuẩn nếu được cung cấp.
- [ ] Domain HTTPS chính thức, Vercel gói thương mại, DNS/SSL và redirect canonical.
- [ ] Resend verified sender/key, Turnstile site/secret/hostname, WAF rule thực tế.
- [ ] Công ty duyệt copy hero/about/values/process/services, chính sách/consent và thời hạn lưu email.
- [ ] Xác nhận lại NAP, thông tin người đại diện, thẻ luật sư và đăng ký hoạt động.
- [ ] Smoke test email delivery thật và tình huống lỗi; đo Lighthouse/CWV lại khi Turnstile thực tế được bật.
- [ ] Google Search Console, submit sitemap, theo dõi URL Inspection và field data.

P1 chưa triển khai: blog JSON, Vercel Blob Private, Analytics/Speed Insights. Không có database/CMS, ghi lead vào filesystem hoặc telemetry chứa thông tin form.
