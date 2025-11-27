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
  // 固定为 33娘
  const person = "33";
  
  // 获取模型名称参数（优先）或时间戳参数
  // 使用Astro提供的url参数，而不是request.url
  let modelName_: string | null = null;
  let t_: string | null = null;
  const debugUrl = url.href;
  
  modelName_ = url.searchParams.get('model');
  t_ = url.searchParams.get('t');

  const modelNames = Object.keys(modelList);
  let modelNum = modelNames.length;
  if (!R18) modelNum -= 1;

  let modelName: string;
  let id: number = 0;
  
  // 如果指定了模型名称，使用指定的
  if (modelName_ && modelNames.indexOf(modelName_) !== -1) {
    modelName = modelName_;
    id = modelNames.indexOf(modelName_);
  } else if (t_ && !isNaN(parseInt(t_))) {
    // 否则使用时间戳生成随机索引
    const seed = parseInt(t_);
    id = seed % modelNum;
    modelName = modelNames[id];
  } else {
    // 完全随机
    id = Math.floor(Math.random() * modelNum);
    modelName = modelNames[id];
  }
  const baseUrl = '../';
  // 每次请求都生成新的时间戳（确保每次都不同）
  const requestTimestamp = Date.now() + Math.floor(Math.random() * 1000);
  const cacheBuster = '?v=' + requestTimestamp;
  
  const live2dConfig = {
    type: "Live2D Model Setting",
    name: `${person}-${modelName}`,
    label: person,
    debug_timestamp: requestTimestamp,
    debug_model_id: id,
    debug_model_name: modelName,
    debug_t_param: t_,
    debug_seed: t_ ? parseInt(t_) : null,
    debug_url: debugUrl,
    model: `${baseUrl}2233/model/${person}/${person}.v2.moc${cacheBuster}`,
    textures: [
      `${baseUrl}2233/model/${person}/texture_00.png${cacheBuster}`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 0)}${cacheBuster}`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 1)}${cacheBuster}`,
      `${baseUrl}2233/model/${person}/closet.${modelName}/${getTexture(modelName, 2)}${cacheBuster}`
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
          fade_in: 2000,
          fade_out: 2000
        }
      ],
      tap_body: [
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.touch.mtn`,
          fade_in: 150,
          fade_out: 100
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
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Cloudflare-CDN-Cache-Control': 'no-store',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Vary': '*'
    }
  });
};
