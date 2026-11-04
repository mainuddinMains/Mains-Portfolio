import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
const parseBody = vi.fn();

vi.mock("next/cache", () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }));
vi.mock("next-sanity/webhook", () => ({ parseBody: (...args: unknown[]) => parseBody(...args) }));

const { POST } = await import("./route");
const request = () => new Request("http://localhost/api/revalidate", { method: "POST" }) as never;

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    parseBody.mockReset();
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "s3cret");
  });

  it("returns 501 when no secret is configured", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "");
    expect((await POST(request())).status).toBe(501);
    expect(parseBody).not.toHaveBeenCalled();
  });

  it("rejects invalid signatures", async () => {
    parseBody.mockResolvedValue({ isValidSignature: false, body: { _type: "project" } });
    expect((await POST(request())).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects unknown document types", async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: "sanity.imageAsset" } });
    expect((await POST(request())).status).toBe(400);
  });

  it("revalidates the tag for a valid webhook", async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: "conference" } });
    const res = await POST(request());
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("content:conference", { expire: 0 });
  });

  it("returns 400 for malformed requests", async () => {
    parseBody.mockRejectedValue(new SyntaxError("Unexpected token"));
    expect((await POST(request())).status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 500 when revalidation fails so Sanity can retry", async () => {
    parseBody.mockResolvedValue({ isValidSignature: true, body: { _type: "project" } });
    revalidateTag.mockImplementation(() => {
      throw new Error("cache unavailable");
    });
    expect((await POST(request())).status).toBe(500);
  });
});
