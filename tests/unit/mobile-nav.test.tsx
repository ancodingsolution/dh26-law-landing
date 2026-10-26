import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MobileNav } from "@/components/layout/mobile-nav";
test("mobile navigation closes with Escape and returns focus to trigger", () => {
  render(<MobileNav items={[{ label: "Trang chủ", href: "/" }]} openLabel="Mở menu" closeLabel="Đóng menu" navigationLabel="Điều hướng chính" />);
  fireEvent.click(screen.getByRole("button", { name: "Mở menu" }));
  const link = screen.getByRole("link", { name: "Trang chủ" });
  link.focus();
  fireEvent.keyDown(link, { key: "Escape" });
  expect(screen.getByRole("button", { name: "Mở menu" })).toHaveFocus();
  expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
});
