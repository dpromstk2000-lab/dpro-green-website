/* DPRO GREEN KASUYA product catalog data
   Front-end data source for the website product-introduction area.
   Fields can be replaced by an API/Supabase payload without changing page markup. */
window.KASUYA_PRODUCT_CATALOG = {
  schema_version: "1.0",
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
  ]
};
