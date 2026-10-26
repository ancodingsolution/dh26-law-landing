export class PayloadTooLargeError extends Error {}
/** Enforce actual UTF-8 byte size even for chunked requests or forged Content-Length. */
export async function readLimitedJson(request: Request, limit = 16_384): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length && Number(length) > limit) throw new PayloadTooLargeError();
  if (!request.body) throw new SyntaxError("Empty body");
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new PayloadTooLargeError(); }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body);
  } finally { reader.releaseLock(); }
}
