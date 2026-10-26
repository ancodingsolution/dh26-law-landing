import { expect, test } from "vitest";
import { cn } from "@/lib/utils";
test("class variants preserve conditional classes and resolve Tailwind conflicts", () => {
  expect(cn("px-2", false && "hidden", "px-4")).toBe("px-4");
});
