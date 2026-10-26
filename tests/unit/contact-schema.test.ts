import { describe, expect, test } from "vitest";
import { contactSchema } from "@/schemas/contact.schema";
export const validContact = { name: "Nguyễn Văn An", phone: "0973.787.969", email: "client@example.org", message: "Tôi cần trao đổi về một vấn đề pháp lý.", consent: true, turnstileToken: "unit-test-token", website: "" };
describe("contact validation", () => {
  test("trims data and accepts Vietnamese phone formats", () => {
    for (const phone of ["0973.787.969", "+84 973 787 969", "02412345678"]) expect(contactSchema.safeParse({ ...validContact, phone }).success).toBe(true);
    expect(contactSchema.parse(validContact).phone).toBe("0973787969");
    expect(contactSchema.parse({ ...validContact, name: "  Nguyễn An  " }).name).toBe("Nguyễn An");
  });
  test.each([
    { name: "" }, { name: "a" }, { name: "a".repeat(101) }, { name: "Name\nInjected" },
    { phone: "123" }, { phone: "+12025550123" }, { email: "invalid" }, { email: "a".repeat(255) },
    { message: "short" }, { message: "a".repeat(2001) }, { consent: false }, { website: "spam" }, { unknown: true },
  ])("rejects invalid payload %j", (patch) => expect(contactSchema.safeParse({ ...validContact, ...patch }).success).toBe(false));
});
