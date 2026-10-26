# DH26 LAW — Implementation progress

Ngày: 24/10/2026. Đã đọc toàn bộ `plan.md`. Repo ban đầu chỉ có kế hoạch, không có Git metadata, mã nguồn hoặc assets.

## Phase 0 — Audit & Bootstrap

Status: PASS (runtime recovered)

- [x] Audit repo, bảo toàn `plan.md`, kiểm tra Node/pnpm/assets.
- [x] Next.js 16/App Router, TS strict, ESLint, Tailwind 4, next/font tiếng Việt, tokens, cn, test config.
- [x] `.env.example`, `.gitignore`, README, engines Node 24.
- [x] Install dependencies, tạo pnpm-lock.yaml từ registry và chạy dev server.
- [x] Lint/typecheck/unit/build PASS.

Changed files: package.json, tsconfig.json, next.config.ts, eslint/postcss/vitest config, src/app, src/lib/utils.ts, tests, README, env example.

Tests run: kiểm tra runtime; `node --version` và pnpm không chạy vì Node không có trong PATH. Tải Node bằng HTTPS thất bại do Windows TLS `SEC_E_NO_CREDENTIALS`. Browser tool cũng trả lỗi `missing field sandboxPolicy`. Không có yêu cầu nâng quyền vì policy hiện tại không cho phép.

Recovery: dùng PHP/OpenSSL với CA bundle của Git để tải Node chính thức, đối chiếu SHA256; runtime riêng `.tools/node-v24.22.1-win-x64`, không đổi cài đặt máy. pnpm 10.28.2 đã resolve Next 16.4.3 / React 19.3.1 từ registry, có lockfile thật. Chạy lại pnpm lint, typecheck, test (1/1 PASS), build: PASS. Đã sửa warning export PostCSS và bật ESM cho tooling. Logo gốc và favicon thương hiệu chờ bổ sung; hiện chỉ text logo, chưa tự tạo logo.

Next phase: Phase 1 — Data & Shared Layout.

## Phase 1 — Data & Shared Layout

Status: PASS

- [x] Company/site/homepage/navigation JSON; 4 dịch vụ đúng phạm vi đăng ký, nội dung đề xuất trung tính.
- [x] Zod schemas, validation trước build, filename/slug, duplicate slug, metadata và broken references.
- [x] Header, MobileNav, Footer, Container, SectionHeading, Button variants theo cấu trúc shadcn/native semantics.
- [x] Menu có aria-expanded, ESC, đóng khi chọn link/ra ngoài và trả focus về trigger.
- [x] Rà soát code; pnpm lint, typecheck, test (7/7), build: PASS.

Changed files: src/data/**, src/schemas/content.schema.ts, src/lib/content.ts, src/components/layout/**, src/components/ui/**, scripts/validate-content.ts, layout/page/globals, tests/unit/content/mobile-nav.

Results: NAP và thông tin pháp lý chỉ từ company.json; không có ảnh người, không bịa thống kê/review. Browser tích hợp còn lỗi sandboxPolicy nên QA visual chuyển sang Playwright local. Các route đích sẽ được hoàn thiện Phase 3 theo thứ tự kế hoạch.

Known issues: logo gốc chưa có; các copy dịch vụ/marketing cần công ty duyệt trước go-live.

Next phase: Phase 2 — Landing Page UI.

## Phase 2 — Landing Page UI

Status: PASS

- [x] Hero 2 CTA, cân công lý vector tự vẽ dạng trang trí (không phải logo); không có ảnh người.
- [x] Trust → services → about → values → process → contact, đúng thứ tự; nội dung từ JSON.
- [x] Form UI 4 trường, consent, thông báo chưa sẵn sàng và submit disabled; chưa giả lập gửi.
- [x] Typography/spacing responsive; mobile ẩn visual trang trí, CTA sớm; card/form 1 cột ở 320px.
- [x] Lint/typecheck/unit 7 tests/build: PASS; Playwright 9 cases qua 8 widths + menu: PASS.
- [x] Review trực tiếp screenshots `docs/qa/home-320.png`, `docs/qa/home-1440.png`.

Changed files: src/components/home/**, src/components/contact/**, src/components/services/service-cards.tsx, src/data/contact.json, globals.css/page.tsx, playwright.config.ts, tests/e2e/home.spec.ts.

Results: không horizontal overflow ở 320,360,375,390,430,768,1024,1440px; không lỗi JS/hydration; menu ESC/link navigation/focus hoạt động. Browser tích hợp unavailable (sandboxPolicy); dùng Playwright Chromium local đã cài trong workspace.

Known issues: các trang con và backend thực hiện ở Phase 3/4. Logo vẫn dùng text đúng yêu cầu fallback.

Next phase: Phase 3 — Trang con & SEO.

## Phase 3 — Trang con & SEO

Status: PASS

- [x] Giới thiệu, dịch vụ, 4 chi tiết dịch vụ, liên hệ, bảo mật (đánh dấu bản dự thảo), 404.
- [x] generateStaticParams/generateMetadata, async params, unknown slug 404; tất cả nội dung page từ JSON.
- [x] Metadata riêng, canonical tuyệt đối, OG/Twitter, ảnh OG 1200×630 và favicon text tạm; không tự tạo logo.
- [x] Sitemap chỉ gồm published trên production; robots/noindex meta + header trên preview/local; kiểm tra domain production ở prebuild.
- [x] LegalService/Service/BreadcrumbList; NAP từ company.json, escape JSON-LD, không rating/geo/awards giả.
- [x] Lint/typecheck, 11 unit tests, build và 11 E2E: PASS.

Changed files: src/data/pages.json, src/app/{gioi-thieu,dich-vu,lien-he,chinh-sach-bao-mat,not-found,sitemap,robots,opengraph-image,icon}, src/lib/{site-url,metadata,jsonld}, PageIntro/JsonLd, tests/unit/seo.test.ts, tests/e2e/pages.spec.ts.

Results: 9 public pages trả 200 với 1 H1, title/description riêng và HTML đọc được không cần JS; các link nội bộ hợp lệ, unknown route/slug trả 404 noindex. Đã sửa assertion test để chấp nhận canonical origin được Next chuẩn hóa bỏ dấu `/` cuối. Windows Playwright-managed server gặp treo lúc shutdown, đã dùng server riêng + E2E_BASE_URL, test kết thúc exit 0 (11/11).

Known issues: sitemap local/preview cố ý rỗng; domain thật cần cấu hình để production index. Logo/copy/privacy còn cần chủ sở hữu cung cấp/phê duyệt.

Next phase: Phase 4 — Contact backend.

## Phase 4 — Contact backend

Status: PASS (code + mock verification; live activation pending credentials)

- [x] Shared Zod + React Hook Form/resolver; lỗi tiếng Việt, consent, aria-describedby/invalid, loading/success/error, giữ dữ liệu khi lỗi, chống double submit.
- [x] POST /api/contact: body 16KiB thực tế, validation, honeypot, Origin, server verification token/hostname/action; timeout và response lỗi cố định.
- [x] Resend adapter server-only, sender đã cấu hình, replyTo khách, HTML escape + plain text; chỉ success khi provider trả ID.
- [x] Production fail closed nếu chưa xác nhận WAF dùng chung; không có in-memory rate limiter, không ghi lead vào JSON và không log PII.
- [x] Mock test success/failure/missing env/Turnstile invalid/provider error/rate limit; UI giữ dữ liệu và không success giả.
- [x] Lint/typecheck, 48 unit/component tests, production build: PASS.
- [x] README có hướng dẫn env, Turnstile, WAF, sender verify và bước kiểm thử trước kích hoạt.

Changed files: schemas/contact.schema, lib/{contact-config,request-body,turnstile,email}, api/contact, contact-form/turnstile-input, tests/unit/contact-*.test.*, vitest config, package/lock, README.

Known issues: chưa thử delivery thật vì chưa có Resend/Turnstile/domain/WAF của chủ sở hữu; không gửi email ra ngoài. Cần phê duyệt chính sách/copy và xác nhận thời hạn lưu email trước khi kích hoạt production.

Next phase: Phase 5 — QA & Vercel readiness.

## Phase 5 — QA & Vercel readiness

Status: PASS (local code/QA and handoff; production go-live tasks remain manual)

- [x] Rà soát code và dữ liệu pháp lý; không có ảnh người, claim/review/rating giả, dummy CTA hoặc secret trong source.
- [x] 9 trang ở 8 widths bắt buộc; không horizontal overflow; mobile hero gọn; keyboard/menu/focus/skip link và text zoom 200%.
- [x] Axe WCAG 2 A/AA + 2.1 A/AA trên 9 trang ở mobile/desktop: không violation. Mở rộng 2.1 A phát hiện label brand, đã sửa bằng accessible name native và test lại PASS.
- [x] Form E2E fixture 5/5 PASS (validation, focus, loading, success, lỗi 502/503/429 giữ dữ liệu); chỉ mock widget/API tại browser, không bypass server và không gửi thư thật. Build bình thường được khôi phục tự động.
- [x] `pnpm lint`, `pnpm typecheck`, `pnpm test` (50/50), `pnpm build`: PASS.
- [x] `pnpm test:e2e`: 23 PASS, 5 fixture cases skip có giải thích; 5 cases đó đã chạy riêng thành công qua `pnpm test:e2e:form`.
- [x] Lighthouse reports + screenshots; tối ưu fonts, kiểm tra bundle; pnpm audit không phát hiện lỗ hổng đã biết ở thời điểm chạy.
- [x] README hướng dẫn JSON, env, Vercel Pro/commercial, Node 24, region sin1, domain/DNS/SSL, Preview noindex, Resend/Turnstile/WAF, Search Console và checklist owner.
- [x] vercel.json, pnpm lockfile, CI kiểm tra; scripts test server/Chrome đóng process trực tiếp để tránh lỗi shutdown trên Windows.

Changed files: README.md, docs/QA_REPORT.md, docs/qa/*, vercel.json, .github/workflows/ci.yml, scripts/{test-e2e,test-form-e2e,audit}.mjs, tests/e2e/*, tests/unit/production-seo.test.ts, content schemas/validator, font config/header CSS/accessibility, company locality/country từ JSON.

Results: mobile Lighthouse Performance 91 / Accessibility 100 / Best Practices 100; desktop 100 / 100 / 100. Local SEO score 66 do chủ động noindex và robots Disallow cho Preview/local; không xem là bằng chứng SEO production đạt 95. Mobile lab LCP lần cuối khoảng 3.3s, CLS 0; chưa có field CWV/INP/p75. Đã lưu reports HTML/JSON thật và review screenshots 320/1440px. Chi tiết ở `docs/QA_REPORT.md`.

Known issues / manual go-live:

- [ ] Cung cấp logo gốc sáng/tối (text logo/favicon chữ đang dùng theo fallback), domain và tài khoản Vercel gói thương mại.
- [ ] Cấu hình Resend sender đã verify/API key, Turnstile site/secret/hostname, WAF shared rate limit; smoke test delivery thật.
- [ ] Công ty/luật sư duyệt hero/marketing/about/values/process/services và chính sách/consent/thời hạn lưu email; xác nhận lại thông tin pháp lý/NAP.
- [ ] Deploy production có quyền truy cập, DNS/SSL/canonical redirect; kiểm tra sitemap/index/OG trên domain thật, Search Console và đo lại Lighthouse/CWV khi dịch vụ thực được bật.

Next phase: V1 code hoàn thành; chờ owner go-live checklist. P1 không triển khai trong phạm vi Phase 0–5.

## Tổng kết nghiệm thu

- [x] Hoàn thành code lần lượt Phase 0 → 5, giữ nguyên plan.md, ghi kiểm tra và kết quả sau mỗi phase.
- [x] Routes: `/`, `/gioi-thieu`, `/dich-vu`, 4 `/dich-vu/[slug]`, `/lien-he`, `/chinh-sach-bao-mat`, 404, POST `/api/contact`, sitemap/robots/OG/icon.
- [x] Nội dung từ JSON có Zod và prebuild validation; responsive navy/gold/ivory, không sử dụng ảnh người.
- [x] Test/build và báo cáo QA đủ; không nhận đã gửi email thật hoặc đã deploy khi chưa có cấu hình/tài khoản.

## Cập nhật giao diện theo ảnh tham chiếu — 25/10/2026

Status: PASS cho UI/code/responsive; Lighthouse mobile performance còn dưới mục tiêu lab.

- [x] Đọc lại AGENTS.md và hướng dẫn next/image của Next đang cài; giữ stack Next 16/Node 24 và toàn bộ route/backend đã có.
- [x] Tạo ảnh mới bằng built-in image_gen theo yêu cầu; không có người/khuôn mặt/logo giả, không mô tả văn phòng thực. Asset cuối lưu trong workspace, prompt đầy đủ ở docs/visual-assets-v2.json.
- [x] `public/images/legal-hero-v2.webp` (1659×948, 83,546 bytes); `public/images/legal-architecture-v2.webp` (1200×900, 169,766 bytes).
- [x] Hero ảnh nền có gradient navy, thương hiệu DH26 LAW hai màu, heading/CTA HTML thật; mobile hero gọn.
- [x] Header trắng dạng thanh nổi, 4 trust items, service cards và ảnh giới thiệu, values/process icons; bố cục desktop nội dung trái + form phải, mobile một cột.
- [x] Form compact dùng chung React Hook Form/Zod/Turnstile/API; labels, consent, trạng thái lỗi và cơ chế không success giả vẫn hoạt động.
- [x] Nội dung/đường dẫn ảnh/alt từ JSON có schema; prebuild fail khi thiếu asset; dùng next/image eager/high priority cho hero, lazy/low priority cho ảnh giới thiệu.
- [x] Rà soát screenshots 320px/1440px; kiểm tra 8 viewport, text zoom 200%, keyboard/focus và axe WCAG A/AA; sửa lỗi đường nối quy trình tràn ngang tại 768px.
- [x] pnpm lint/typecheck/build PASS; Vitest 50/50 PASS; E2E tổng quát 24 PASS, E2E form fixture 6/6 PASS (gồm form sidebar). Build bình thường được khôi phục sau fixture.
- [x] Cập nhật README, QA_REPORT, ảnh chụp và Lighthouse HTML/JSON thật.

Changed files: src/app/{page,layout,home-v2.css}, src/components/home/sections.tsx, components/contact/{contact-form,contact-section}, ui/button, homepage JSON/schema, validate-content script, public/images/*, E2E tests, docs. Bỏ visual SVG không còn dùng. Bổ sung ignore cho pnpm cache cục bộ.

Results: desktop Lighthouse Performance 100; mobile 89 sau tối ưu preload font Latin-ext (từ 87, còn dưới mục tiêu lab 90); Accessibility/Best Practices 100 ở cả hai. Mobile lab LCP 3.7s, CLS 0. SEO local 69 do chủ động noindex/robots chặn môi trường thử nghiệm, cần đo lại domain production. Báo cáo cũ mobile 91 là bản vector ngày 24/10, không dùng để đại diện bản UI có ảnh này.

Known issues: tiếp tục tối ưu mobile critical fonts/JS khi vận hành; chưa có field CWV. Logo trong mockup chưa có file gốc riêng nên vẫn dùng text logo/favicon chữ; không dựng lại logo. Các việc credentials, WAF, phê duyệt nội dung và domain/go-live ở checklist trước vẫn còn; chưa deploy hoặc gửi email thật.
