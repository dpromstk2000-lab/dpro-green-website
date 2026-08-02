window.GREEN_WEB_CONFIG = Object.freeze({
  version: "WEB-GREEN-5-LINE-CUSTOMER-ROUTES-20260802",
  site: {
    publicName: "地域の観葉植物レンタル専門店",
    serviceName: "観葉植物レンタル・定期メンテナンス",
    region: "[主な対応地域]",
    operatorName: "[運営法人名]",
    address: "",
    businessHours: "",
    closedDays: "",
    demo: true
  },
  links: {
    contact: "contact.html",
    lineGuide: "line.html",
    line: "",
    phone: "",
    customerGuide: "line.html#customer-portal",
    customerPortal: "",
    headquarters: "",
    privacy: "privacy.html"
  },
  api: {
    baseUrl: "https://dpro-green-rental-line-api.dpromstk2000.workers.dev",
    facilityCode: "dpro_green_rental_demo",
    maxPhotos: 4,
    maxOriginalImageBytes: 12582912,
    maxUploadImageBytes: 5242880,
    maxImageEdge: 1600,
    jpegQuality: 0.82
  },
  line: {
    templates: {
      consultation: {
        title: "観葉植物レンタルをLINEで相談",
        note: "設置場所、希望時期、現在のお悩みが分かる範囲でお送りください。",
        message: "観葉植物レンタルについて相談したいです。設置を考えている場所と希望時期をお伝えします。"
      },
      photo: {
        title: "設置場所の写真から相談",
        note: "LINEへ移動後、設置を考えている場所の写真を添えてください。個人情報や機密情報が写っていないかご確認ください。",
        message: "設置場所の写真から観葉植物レンタルを相談したいです。写真を送りますので、植物の大きさや配置について案内をお願いします。"
      },
      visit: {
        title: "訪問予定について確認",
        note: "お客様番号や会社名が分かる場合は、個人情報を送りすぎない範囲で添えてください。",
        message: "契約中のお客様です。次回の訪問予定について確認したいです。"
      },
      report: {
        title: "作業報告について確認",
        note: "対象の訪問日が分かる場合は、日付を添えると確認がスムーズです。",
        message: "契約中のお客様です。作業報告と植物の状態について確認したいです。"
      },
      plant_issue: {
        title: "植物の状態を相談",
        note: "植物全体と気になる部分の写真があると、状況を共有しやすくなります。",
        message: "契約中の植物について相談したいです。気になる状態があるため、写真と状況を送ります。"
      },
      additional: {
        title: "植物の追加・変更を相談",
        note: "追加したい場所や変更したい植物が分かる写真があれば添えてください。",
        message: "契約中のお客様です。植物の追加または配置変更について相談したいです。"
      },
      after_inquiry: {
        title: "受付番号をLINEで伝える",
        note: "受付番号だけで確認できない場合は、担当者から必要事項をご案内します。",
        message: "ホームページから相談しました。受付番号は {receptionNumber} です。続けてLINEで相談したいです。"
      },
      portal_help: {
        title: "お客様画面の利用方法を確認",
        note: "本番ではLINE本人確認後、確認済みのお客様情報だけを表示します。",
        message: "契約中のお客様です。お客様画面の開き方について確認したいです。"
      }
    }
  },
  lineFallbackMessage: "観葉植物レンタルについて相談したいです。設置を考えている場所と希望時期をお伝えします。",
  featureFlags: {
    show_price_information: false,
    show_personal_home_service: false,
    show_outdoor_plants: false,
    show_seasonal_service: false,
    show_spot_rental: false,
    show_plant_disposal: false,
    show_staff_introduction: false,
    show_case_studies: true,
    show_customer_reviews: false,
    show_recruitment: false,
    show_line_consultation: true,
    show_photo_inquiry: true,
    show_customer_portal_link: true,
    show_maintenance_report_feature: true,
    show_google_map: false,
    show_headquarters_branding: false
  }
});
