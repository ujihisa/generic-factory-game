import i18n from "i18next";
import { initReactI18next } from "react-i18next";

(fetch('/translations.json')
  .then(
    (response) => {
      if (response.status !== 200) {
        console.log("Translation API Failed", response);
        return;
      }
      response.json().then((data) => {
        const resources =
          data.reduce((memo, translationHash) => {
            memo[translationHash.lang] = memo[translationHash.lang] || {translation: {}}
            memo[translationHash.lang].translation = {
              ...memo[translationHash.lang].translation,
              [translationHash.key]: translationHash.value,
            };
            return memo;
          }, {})
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

      })
    }
  ).catch((err) =>
    alert(err)
  ));

$(document).on('turbolinks:load', () => {
  const button = $("#toggle-languages-button");

  button.attr("disabled", null);
  button.html("🇨🇦")
  button.click(() => {
    if (i18n.language == "en") {
      i18n.changeLanguage("ja");
      button.html("🇯🇵")
    } else {
      i18n.changeLanguage("en");
      button.html("🇨🇦")
    }
  });
});

export default i18n;
