import type { APIRoute } from 'astro';

// 获取访客IP
function getClientIP(request: Request): string {
  const cfConnectingIP = request.headers.get('CF-Connecting-IP');
  const xForwardedFor = request.headers.get('X-Forwarded-For');
  const xRealIP = request.headers.get('X-Real-IP');
  
  return cfConnectingIP || xForwardedFor?.split(',')[0] || xRealIP || 'unknown';
}

// 获取浏览器信息
function getBrowserInfo(userAgent: string): { name: string; version: string } {
  if (userAgent.includes('Firefox/')) {
    const match = userAgent.match(/Firefox\/([^\s]+)/);
    return { name: 'Firefox浏览器', version: match?.[1] || 'unknown' };
  } else if (userAgent.includes('Edg/')) {
    const match = userAgent.match(/Edg\/([^\s]+)/);
    return { name: 'Edge浏览器', version: match?.[1] || 'unknown' };
  } else if (userAgent.includes('Chrome/')) {
    const match = userAgent.match(/Chrome\/([^\s]+)/);
    return { name: 'Chrome浏览器', version: match?.[1] || 'unknown' };
  } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome')) {
    const match = userAgent.match(/Version\/([^\s]+)/);
    return { name: 'Safari浏览器', version: match?.[1] || 'unknown' };
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    return { name: 'IE浏览器', version: 'unknown' };
  }
  return { name: '未知浏览器', version: 'unknown' };
}

// 获取操作系统
function getOS(userAgent: string): string {
  if (userAgent.includes('Windows NT 10.0')) return 'Windows 10/11';
  if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
  if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
  if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
  if (userAgent.includes('Windows NT 6.0')) return 'Windows Vista';
  if (userAgent.includes('Windows NT 5.1')) return 'Windows XP';
  if (userAgent.includes('Mac OS X')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return '未知系统';
}

// 获取IP位置和天气信息
async function getLocationAndWeather(ip: string) {
  try {
    // 获取IP位置信息
    const ipResponse = await fetch(`https://api.xwteam.cn/api/ip/ip?key=aOxWVWCoyTFGsBTstbPmXySBp0&ip=${ip}`);
    const ipData = await ipResponse.json();
    
    if (!ipData.data) {
      return { location: '未知位置', weather: '天气信息获取失败' };
    }
    
    const { province, city } = ipData.data;
    
    // 获取天气信息
    const weatherResponse = await fetch(`https://api.xwteam.cn/api/weather/weather?key=aOxWVWCoyTFGsBTstbPmXySBp0&province=${province}&city=${city}`);
    const weatherData = await weatherResponse.json();
    
    if (!weatherData.data) {
      return { location: `${province}${city}`, weather: '天气信息获取失败' };
    }
    
    const w = weatherData.data;
    const weatherInfo = `降雨量: ${w.now_rain} 相对湿度: ${w.now_humidity}\n气温: ${w.now_temperature} 体感温度: ${w.now_feelst}\n风向: ${w.now_wind_direction} 气压: ${w.now_airpressure}\n舒适度: ${w.now_icomfort}`;
    
    return { location: `${province}${city}`, weather: weatherInfo };
  } catch (error) {
    console.error('获取位置和天气失败:', error);
    return { location: '位置获取失败', weather: '天气信息获取失败' };
  }
}

// 生成随机背景色
function getRandomBackground(): string {
  const backgrounds = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];
  const index = Math.floor(Date.now() / 1000 / 3600) % backgrounds.length;
  return backgrounds[index];
}

export const GET: APIRoute = async ({ request }) => {
  // 检查referer
  const referer = request.headers.get('referer') || '';
  const allowedDomains = ['xwteam.cn', 'xwteam.com', 'localhost', '127.0.0.1'];
  
  const isAllowed = allowedDomains.some(domain => 
    referer.includes(domain) || request.url.includes(domain)
  );
  
  if (!isAllowed && referer) {
    // 返回错误图片
    return new Response('Forbidden', { status: 403 });
  }
  
  // 获取访客信息
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const browser = getBrowserInfo(userAgent);
  const os = getOS(userAgent);
  
  // 获取位置和天气（异步）
  const { location, weather } = await getLocationAndWeather(ip);
  
  // 生成SVG
  const background = getRandomBackground();
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="250" fill="url(#bg)" rx="10"/>
  
  <!-- 标题 -->
  <text x="200" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">
    访客签名卡
  </text>
  
  <!-- 分隔线 -->
  <line x1="20" y1="45" x2="380" y2="45" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"/>
  
  <!-- IP信息 -->
  <text x="20" y="70" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">
    IP地址: ${ip}
  </text>
  
  <!-- 位置信息 -->
  <text x="20" y="90" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">
    来自: 「${location}」
  </text>
  
  <!-- 浏览器信息 -->
  <text x="20" y="110" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">
    浏览器: ${browser.name} (${browser.version})
  </text>
  
  <!-- 系统信息 -->
  <text x="20" y="130" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">
    系统: ${os}
  </text>
  
  <!-- 天气标题 -->
  <text x="20" y="155" font-family="Arial, sans-serif" font-size="12" fill="#ffffff" font-weight="bold">
    当前天气:
  </text>
  
  <!-- 天气信息 -->
  ${weather.split('\n').map((line, index) => 
    `<text x="20" y="${175 + index * 15}" font-family="Arial, sans-serif" font-size="10" fill="#ffffff">${line}</text>`
  ).join('\n  ')}
  
  <!-- 版权信息 -->
  <text x="200" y="240" font-family="Arial, sans-serif" font-size="10" fill="#ffffff" fill-opacity="0.8" text-anchor="middle">
    幸福の家 (www.xwteam.cn)
  </text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};
