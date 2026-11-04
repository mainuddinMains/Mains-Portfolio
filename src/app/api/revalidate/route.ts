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

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!isContentType(body?._type)) {
      return NextResponse.json({ message: "Unknown or missing _type" }, { status: 400 });
    }

    const tag = contentTag(body._type);
    revalidateTag(tag, "max");
    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    console.error("Revalidation webhook failed", error);
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
