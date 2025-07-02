import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { placeId } = await req.json();

    // 헤더 설정
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Referer': 'https://map.naver.com/',
      'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
      'sec-ch-ua-platform': '"Windows"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'iframe',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-site',
      'upgrade-insecure-requests': '1'
    };

    // 네이버 플레이스 페이지 요청
    const url = `https://pcmap.place.naver.com/restaurant/${placeId}/menu/list`;
    const response = await fetch(url, { headers });
    const html = await response.text();

    // HTML 파싱
    const menuItems = html.match(/class="E2jtL"[^>]*>[\s\S]*?<\/li>/g) || [];
    const menuData = menuItems.map(item => {
      const name = item.match(/class="lPzHi"[^>]*>([^<]*)</) || [];
      const price = item.match(/class="GXS1X"[^>]*><em>([^<]*)</) || [];
      const description = item.match(/class="kPogF"[^>]*>([^<]*)</) || [];
      const image = item.match(/class="place_thumb"[^>]*><img[^>]*src="([^"]*)"/) || [];

      return {
        name: name[1]?.trim() || "",
        price: price[1]?.trim() || "",
        description: description[1]?.trim() || "맛있는 메뉴입니다",
        image: image[1] || "/placeholder.svg"
      };
    }).filter(item => item.name && item.price);

    return NextResponse.json({
      place_id: placeId,
      total_items: menuData.length,
      items: menuData
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '메뉴 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 