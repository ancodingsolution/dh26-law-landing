import { describe, expect, test } from "vitest";
import { company, services, getServiceBySlug, serviceParams } from "@/lib/content";
import { companySchema, servicesSchema, validateReferences } from "@/schemas/content.schema";

describe("content contract", () => {
  test("confirmed registration date and contact data are preserved", () => {
    expect(company.registration.date).toBe("2026-09-21");
    expect(company.contact.phoneE164).toBe("+84973787969");
    expect(services).toHaveLength(4);
  });
  test("missing and incorrectly typed company fields fail", () => {
    expect(companySchema.safeParse({ ...company, registration: {} }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, legalName: 123 }).success).toBe(false);
  });
  test("duplicate slug and missing public metadata fail", () => {
    expect(servicesSchema.safeParse([services[0], services[0]]).success).toBe(false);
    expect(servicesSchema.safeParse([{ ...services[0], seo: undefined }]).success).toBe(false);
  });
  test("references to unknown services and routes fail", () => {
    expect(() => validateReferences(["missing"], services.map((s) => s.slug), [])).toThrow("Broken service reference");
    expect(() => validateReferences([], [], ["/missing"])).toThrow("Broken navigation");
  });
  test("published service lookup and static params agree", () => {
    expect(getServiceBySlug("missing")).toBeUndefined();
    for (const { slug } of serviceParams()) expect(getServiceBySlug(slug)?.status).toBe("published");
  });
});
