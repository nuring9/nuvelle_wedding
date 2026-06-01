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

  const headers = { Authorization: `KakaoAK ${restKey}` };

  // 1차: 주소 검색
  const addressRes = await fetch(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
    { headers },
  );

  if (addressRes.ok) {
    const addressJson = await addressRes.json();
    const doc = addressJson.documents?.[0];
    if (doc) {
      return NextResponse.json({ lat: parseFloat(doc.y), lng: parseFloat(doc.x) });
    }
  }

  // 2차: 키워드 검색 (건물명/장소명)
  const keywordRes = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`,
    { headers },
  );

  if (!keywordRes.ok) {
    return NextResponse.json({ error: "Kakao API error" }, { status: 502 });
  }

  const keywordJson = await keywordRes.json();
  const doc = keywordJson.documents?.[0];

  if (!doc) {
    return NextResponse.json({ error: "No result" }, { status: 404 });
  }

  return NextResponse.json({ lat: parseFloat(doc.y), lng: parseFloat(doc.x) });
}
