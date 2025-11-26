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

// 配置项
const DEFAULT_ID: number | null = null;
const R18 = false;

// 获取材质
function getTexture(modelName: string, textureIndex: number): string {
  const textures = modelList[modelName][textureIndex];
  if (Array.isArray(textures)) {
    return textures[Math.floor(Math.random() * textures.length)];
  }
  return textures;
}

export const GET: APIRoute = ({ url }) => {
  const params = url.searchParams;
  const personParam = params.get('p');
  const idParam = params.get('id');

  console.log('=== Live2D API V2 调试 ===');
  console.log('请求URL:', url.href);
  console.log('personParam:', personParam);
  console.log('idParam:', idParam);

  const modelNames = Object.keys(modelList);
  let modelNum = modelNames.length;
  if (!R18) modelNum -= 1;

  let id: number;
  if (idParam && !isNaN(parseInt(idParam))) {
    id = parseInt(idParam) % modelNum;
  } else if (DEFAULT_ID !== null) {
    id = DEFAULT_ID;
  } else {
    id = Math.floor(Math.random() * modelNum);
  }

  // 明确的人物判断
  let person: string;
  console.log('personParam 原始值:', personParam);
  console.log('personParam 类型:', typeof personParam);
  console.log('personParam === "22":', personParam === "22");
  console.log('personParam === "33":', personParam === "33");
  
  // 强制字符串比较
  if (String(personParam) === "22") {
    person = "22";
    console.log('选择了22娘');
  } else if (String(personParam) === "33") {
    person = "33";
    console.log('选择了33娘');
  } else {
    // 如果没有参数，根据随机数决定
    person = Math.random() > 0.5 ? "22" : "33";
    console.log('使用随机选择:', person);
  }

  console.log('最终 person:', person);
  console.log('最终 id:', id);

  const modelName = modelNames[id];
  console.log('modelName:', modelName);
  console.log('=======================');

  const baseUrl = '../';
  const live2dConfig = {
    type: "Live2D Model Setting",
    name: `${person}-${modelName}`,
    label: person,
    timestamp: Date.now(),
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
          fade_in: person === "22" ? 100 : 2000,
          fade_out: person === "22" ? 100 : 2000
        }
      ],
      tap_body: [
        {
          file: `${baseUrl}2233/model/${person}/${person}.v2.touch.mtn`,
          fade_in: person === "22" ? 500 : 150,
          fade_out: person === "22" ? 200 : 100
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
