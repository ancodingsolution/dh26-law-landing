import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
vi.mock("@/components/contact/turnstile-input", () => ({ TurnstileInput: ({ onToken }: { onToken: (token: string) => void }) => <button type="button" onClick={() => onToken("unit-test-token")}>Xác minh kiểm thử</button> }));
import { ContactForm } from "@/components/contact/contact-form";
import copy from "@/data/contact.json";
afterEach(() => vi.unstubAllGlobals());
function fillForm() {
  fireEvent.change(screen.getByLabelText("Họ và tên *"), { target: { value: "Khách kiểm thử" } });
  fireEvent.change(screen.getByLabelText("Số điện thoại *"), { target: { value: "0973787969" } });
  fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "client@example.org" } });
  fireEvent.change(screen.getByLabelText("Tin nhắn *"), { target: { value: "Tôi cần trao đổi về một vấn đề pháp lý." } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Xác minh kiểm thử" }));
}
test("unconfigured form is visibly unavailable and cannot submit", () => {
  render(<ContactForm siteKey="" />);
  expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent(copy.unavailable);
});
test("inline errors identify invalid inputs and missing consent", async () => {
  render(<ContactForm siteKey="test" />);
  fireEvent.click(screen.getByRole("button", { name: copy.submit }));
  await screen.findByText(copy.nameError);
  expect(screen.getByLabelText("Họ và tên *")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText(copy.consentError)).toBeVisible();
});
test("loading prevents duplicate send; successful response clears fields", async () => {
  let resolveResponse!: (response: Response) => void;
  const send = vi.fn().mockImplementation(() => new Promise<Response>((resolve) => { resolveResponse = resolve; }));
  vi.stubGlobal("fetch", send);
  render(<ContactForm siteKey="test" />); fillForm();
  fireEvent.click(screen.getByRole("button", { name: copy.submit }));
  await waitFor(() => expect(send).toHaveBeenCalledTimes(1));
  expect(screen.getByRole("button", { name: copy.submitting })).toBeDisabled();
  await act(async () => resolveResponse(Response.json({ success: true })));
  expect(await screen.findByText(copy.success)).toBeVisible();
  expect(screen.getByLabelText("Họ và tên *")).toHaveValue("");
});
test.each([502, 503, 429])("failure %i preserves entered data and allows retry", async (status) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ success: false }, { status })));
  render(<ContactForm siteKey="test" />); fillForm();
  fireEvent.click(screen.getByRole("button", { name: copy.submit }));
  await waitFor(() => expect(screen.getByRole("status")).toBeVisible());
  expect(screen.getByLabelText("Họ và tên *")).toHaveValue("Khách kiểm thử");
  expect(screen.queryByText(copy.success)).toBeNull();
  expect(screen.getByRole("button", { name: copy.submit })).toBeEnabled();
});
