const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || "";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface TranslateDestinationResponse {
  success: boolean;
  message: string | null;
  data: {
    query: string;
  } | null;
}

async function translateDestinationToEnglish(
  destination: string,
  accessToken: string,
) {
  const normalized = destination.trim();
  if (!normalized) return destination;
  if (!accessToken) return normalized;

  try {
    const res = await fetch(
      `${BASE_URL}/api/honeymoon/destinations/translate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ destination: normalized }),
      },
    );

    if (!res.ok) return normalized;

    const json = (await res.json()) as TranslateDestinationResponse;
    return json.data?.query?.trim() || normalized;
  } catch {
    return normalized;
  }
}

function buildDestinationImageQuery(englishDestination: string) {
  return englishDestination.trim();
}

// 여행지 이미지 검색
export async function searchDestinationImages(
  destination: string,
  count: number = 1,
  accessToken: string = "",
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) return [];

  try {
    const englishDestination = await translateDestinationToEnglish(
      destination,
      accessToken,
    );
    const query = encodeURIComponent(
      buildDestinationImageQuery(englishDestination),
    );

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json.results ?? [];
  } catch {
    return [];
  }
}
