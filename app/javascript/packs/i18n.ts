import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ja: {
    translation: {
      "📰 Advertise": "📰 広告",
      "<0>You need at least 5 credit</0><1>Cost&#58; $80K</1><2>You get +10 credit in the next month</2><3>You can only advertise once a month</3>": "<0>少なくともcreditが5必要です</0><1>Cost: $80K</1><2>翌月にcredit +10</2><3>広告は一月に一回まで</3>",
      "Pay $80K to advertise": "広告を行う ($80Kの支払い)",
      "Not enough cash": "Cash不足",
      "🗄️ Storage": "🗄️ 倉庫",
      "<0><0><0>$1K</0> to buy 100t capacity storage</0><1><0>$1K</0>/month to keep per 100t</1><2>Both products and ingredients are stored in storage. You can't store more than the capacity.</2><3><0>The overflow will be simply discarded, and pay penalty <1>$1K</1> per 5t.</0></3></0>": "<0><0>100t容量の倉庫ごとに<0>$1K</0></0><1>100tごとに月<0>$1K</0></1><2>商品と原料のどこらも倉庫に保持されます。容量より多くこれらを所持することはできません。</2><3><0>超過したものは、ペナルティ5tごとに<1>$1K</1>を支払って、破棄されます。</0></3></0>",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    // lng: "ja",
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome
    debug: true,

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
