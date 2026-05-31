import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const restKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  if (!restKey) {
    return NextResponse.json(
      { error: "Kakao REST API key not configured" },
      { status: 500 },
    );
  }

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    { headers: { Authorization: `KakaoAK ${restKey}` } },
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Kakao API error" }, { status: 502 });
  }

  const json = await res.json();
  const doc = json.documents?.[0];

  if (!doc) {
    return NextResponse.json({ error: "No result" }, { status: 404 });
  }

  return NextResponse.json({ lat: parseFloat(doc.y), lng: parseFloat(doc.x) });
}
