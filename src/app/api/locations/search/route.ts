import { NextResponse } from "next/server";

interface NominatimSearchResult {
  place_id: number;
  name?: string;
  display_name: string;
  lat: string;
  lon: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q")?.trim() ?? "";

  if (keyword.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const upstream = new URL("https://nominatim.openstreetmap.org/search");
  upstream.searchParams.set("q", keyword);
  upstream.searchParams.set("format", "jsonv2");
  upstream.searchParams.set("addressdetails", "1");
  upstream.searchParams.set("limit", "8");
  upstream.searchParams.set("accept-language", "zh-CN,zh;q=0.9,en;q=0.7");

  try {
    const response = await fetch(upstream, {
      headers: {
        "User-Agent": "zhiwei/0.1 location-search",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ suggestions: [] }, { status: 200 });
    }

    const payload = (await response.json()) as NominatimSearchResult[];
    const suggestions = payload.map((item) => ({
      id: String(item.place_id),
      label: item.display_name,
      shortLabel: item.name?.trim() || item.display_name.split(",")[0]?.trim() || item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

    return NextResponse.json({ suggestions });
  } catch {
    return NextResponse.json({ suggestions: [] }, { status: 200 });
  }
}
