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
  const person_ = params.get('p');
  const id_ = params.get('id');

  console.log('=== Live2D API V2 调试 ===');
  console.log('请求URL:', url.href);
  console.log('person_:', person_);
  console.log('id_:', id_);

  const modelNames = Object.keys(modelList);
  let modelNum = modelNames.length;
  if (!R18) modelNum -= 1;

  // 参数转化 - 完全按照PHP逻辑
  let id: number;
  if (id_ && !isNaN(parseInt(id_))) {
    id = parseInt(id_) % modelNum;
  } else if (DEFAULT_ID !== null) {
    id = DEFAULT_ID;
  } else {
    id = Math.floor(Math.random() * modelNum);
  }

  // 参数转化 - 完全按照PHP的三元运算符逻辑
  // $person_ == "22" || $person_ == "33" ? $person = $person_ : $person = ["22","33"][mt_rand(0,1)];
  console.log('>>> 判断前: person_ =', person_);
  console.log('>>> person_ === "22" =', person_ === "22");
  console.log('>>> person_ === "33" =', person_ === "33");
  console.log('>>> person_ == "22" =', person_ == "22");
  console.log('>>> person_ == "33" =', person_ == "33");
  console.log('>>> typeof person_ =', typeof person_);
  
  const person = (person_ === "22" || person_ === "33") 
    ? person_ 
    : ["22", "33"][Math.floor(Math.random() * 2)];

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
    debug: {
      person_param: person_,
      person_param_type: typeof person_,
      person_equals_22: person_ === "22",
      person_equals_33: person_ === "33",
      final_person: person,
      id_param: id_,
      final_id: id,
      model_name: modelName
    },
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
