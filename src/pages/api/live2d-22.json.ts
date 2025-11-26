import type { APIRoute } from 'astro';

// 模型列表配置
const modelList: Record<string, (string | string[])[]> = {
  "default.v2": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2016.xmas": ["texture_01.png", "texture_02.png", ["texture_03_1.png", "texture_03_2.png"]],
  "2017.cba-normal": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.cba-super": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.summer.super": ["texture_01.png", "texture_02.png", ["texture_03_1.png", "texture_03_2.png"]],
  "2017.newyear": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.school": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.summer.normal": ["texture_01.png", "texture_02.png", ["texture_03_1.png", "texture_03_2.png"]],
  "2017.tomo-bukatsu.high": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.valley": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.vdays": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2017.tomo-bukatsu.low": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2018.bls-summer": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2018.bls-winter": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2018.lover": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2018.spring": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2019.deluxe": ["texture_01.png", "texture_02.png", ["texture_03_1.png", "texture_03_2.png"]],
  "2019.summer": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2019.bls": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2020.newyear": ["texture_01.png", "texture_02.png", "texture_03.png"],
  "2018.playwater": ["texture_01.png", "texture_02.png", "texture_03.png"]
};

const DEFAULT_ID: number | null = null;
const R18 = false;

function getTexture(modelName: string, textureIndex: number): string {
  const textures = modelList[modelName][textureIndex];
  if (Array.isArray(textures)) {
    return textures[Math.floor(Math.random() * textures.length)];
  }
  return textures;
}

export const GET: APIRoute = ({ url, request }) => {
  // 固定为 22娘
  const person = "22";
  
  // 获取时间戳参数用作随机种子
  let t_: string | null = null;
  try {
    const urlObj = new URL(request.url);
    t_ = urlObj.searchParams.get('t');
  } catch (e) {
    // 尝试从 URL 字符串解析
    const urlString = request.url || url.href;
    const matchT = urlString.match(/[?&]t=([^&]*)/);
    if (matchT) t_ = matchT[1];
  }

  const modelNames = Object.keys(modelList);
  let modelNum = modelNames.length;
  if (!R18) modelNum -= 1;

  // 使用时间戳作为种子生成随机索引
  let id: number;
  if (t_ && !isNaN(parseInt(t_))) {
    // 使用时间戳生成伪随机数
    const seed = parseInt(t_);
    id = seed % modelNum;
  } else {
    id = Math.floor(Math.random() * modelNum);
  }

  const modelName = modelNames[id];
  const baseUrl = '../';
  
  const live2dConfig = {
    type: "Live2D Model Setting",
    name: `${person}-${modelName}`,
    label: person,
    debug_timestamp: Date.now(),
    debug_model_id: id,
    debug_model_name: modelName,
    model: `${baseUrl}2233/model/${person}/${person}.v2.moc`,
    textures: [
      `${baseUrl}2233/model/${person}/texture_00.png`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 0)}`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 1)}`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 2)}`
    ],
    hit_areas_custom: {
      head_x: [-0.35, 0.6],
      head_y: [0.19, -0.2],
      body_x: [-0.3, -0.25],
      body_y: [0.3, -0.9]
    },
    layout: {
      center_x: -0.05,
      center_y: 0.25,
      height: 2.7
    },
    motions: {
      idle: [
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.idle-01.mtn`,
          fade_in: 2000,
          fade_out: 2000
        },
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.idle-02.mtn`,
          fade_in: 2000,
          fade_out: 2000
        },
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.idle-03.mtn`,
          fade_in: 100,
          fade_out: 100
        }
      ],
      tap_body: [
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.touch.mtn`,
          fade_in: 500,
          fade_out: 200
        }
      ],
      thanking: [
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.thanking.mtn`,
          fade_in: 2000,
          fade_out: 2000
        }
      ]
    }
  };

  return new Response(JSON.stringify(live2dConfig), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
};
