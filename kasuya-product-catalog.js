/* DPRO GREEN KASUYA product catalog data
   Front-end data source for the website product-introduction area.
   Fields can be replaced by an API/Supabase payload without changing page markup. */
window.KASUYA_PRODUCT_CATALOG = {
  schema_version: "1.1",
  updated_at: "2026-09-09",
  fields: [
    "id","name","category","image","monthly_price","size","material",
    "feature","recommended_for","rental_enabled","purchase_enabled",
    "visible","source_url"
  ],
  items: [
    {
      id: "kozimi",
      name: "Kozimi（コズミ）",
      category: "本部オリジナル商品",
      image: null,
      monthly_price: null,
      size: null,
      material: "国産間伐材",
      feature: "国産間伐材を活用し、組み合わせ方で空間に合わせやすいプランター。",
      recommended_for: "オフィス・エントランスなど",
      rental_enabled: true,
      purchase_enabled: null,
      visible: true,
      source_url: "https://green-pocket.biz/catalog/915/"
    },
    {
      id: "greeba-dx",
      name: "グリーバ-DX",
      category: "本部オリジナル商品",
      image: null,
      monthly_price: null,
      size: null,
      material: null,
      feature: "設置スペースに合わせて構成できる室内緑化システム。",
      recommended_for: "オフィス・共用空間など",
      rental_enabled: true,
      purchase_enabled: null,
      visible: true,
      source_url: "https://green-pocket.biz/catalog/area/original/"
    },
    {
      id: "shirakaba-planter",
      name: "白樺プランター",
      category: "本部オリジナル商品",
      image: null,
      monthly_price: null,
      size: null,
      material: "白樺",
      feature: "天然素材の表情を生かし、植物と空間に自然なアクセントを加えるプランター。",
      recommended_for: "受付・店舗・待合など",
      rental_enabled: true,
      purchase_enabled: null,
      visible: true,
      source_url: "https://green-pocket.biz/catalog/area/items/"
    },
    {
      id: "crest",
      name: "クレスト",
      category: "本部オリジナル商品",
      image: null,
      monthly_price: null,
      size: null,
      material: null,
      feature: "落ち着いた素材感で、グリーンを引き立てるプランター。",
      recommended_for: "エントランス・応接・店舗など",
      rental_enabled: true,
      purchase_enabled: null,
      visible: true,
      source_url: "https://green-pocket.biz/catalog/area/items/"
    }
  ],
  shop_items: [
    {id:"monstera",name:"モンステラ",category:"観葉植物",image:"shop-monstera-main.webp",size:"M〜L",feature:"大きな葉が空間のアクセントになる定番グリーン。",recommended_for:"受付・オフィス・リビング",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"pachira",name:"パキラ",category:"観葉植物",image:"shop-pachira-main.webp",size:"M〜L",feature:"すっきりした樹形で、さまざまな内装に合わせやすい植物。",recommended_for:"受付・執務室・店舗",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"sansevieria",name:"サンセベリア",category:"観葉植物",image:"shop-sansevieria-main.webp",size:"S〜M",feature:"縦のラインが美しく、省スペースにも置きやすい植物。",recommended_for:"カウンター・待合・デスク周辺",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"benjamin",name:"ベンジャミン",category:"観葉植物",image:"shop-benjamin-main.webp",size:"M〜L",feature:"細かな葉がやわらかな印象をつくる樹形タイプ。",recommended_for:"エントランス・応接・店舗",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"gift-green",name:"ギフトグリーン",category:"ギフト",image:"shop-gift-green.webp",size:"M",feature:"開店・移転などのお祝い用途を想定したグリーンギフト。",recommended_for:"開店・移転・お祝い",rental_enabled:false,purchase_enabled:true,visible:true},
    {id:"set-clean",name:"グリーン＋白鉢セット",category:"PLANT + POT",image:"shop-set-clean.webp",size:"M",feature:"明るく清潔感のある空間に合わせやすい組み合わせ。",recommended_for:"クリニック・受付・オフィス",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"set-modern",name:"グリーン＋チャコール鉢セット",category:"PLANT + POT",image:"shop-set-modern.webp",size:"M",feature:"落ち着いた内装を引き締めるモダンな組み合わせ。",recommended_for:"オフィス・店舗・ショールーム",rental_enabled:true,purchase_enabled:true,visible:true},
    {id:"set-natural",name:"グリーン＋ナチュラル鉢セット",category:"PLANT + POT",image:"shop-set-natural.webp",size:"M",feature:"木やベージュ系の内装になじむ自然な組み合わせ。",recommended_for:"サロン・店舗・ラウンジ",rental_enabled:true,purchase_enabled:true,visible:true}
  ]
};
