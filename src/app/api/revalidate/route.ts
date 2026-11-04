import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { contentTag, isContentType } from "@/lib/content/tags";

/**
 * Sanity webhook → on-demand cache revalidation.
 * Configure a GROQ-powered webhook in sanity.io/manage that POSTs
 * `{ "_type": _type }` here, signed with SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Revalidation is not configured" }, { status: 501 });
  }

  let tag: string;
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!isContentType(body?._type)) {
      return NextResponse.json({ message: "Unknown or missing _type" }, { status: 400 });
    }
    tag = contentTag(body._type);
  } catch (error) {
    console.error("Revalidation webhook received a malformed request", error);
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }

  try {
    // Expire immediately so unpublished or deleted documents are never served from cache.
    revalidateTag(tag, { expire: 0 });
    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    // 5xx lets Sanity retry the webhook.
    console.error("Revalidation failed", error);
    return NextResponse.json({ message: "Revalidation failed" }, { status: 500 });
  }
}
