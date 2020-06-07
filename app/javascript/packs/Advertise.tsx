import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg';
import { Trans, useTranslation } from 'react-i18next';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ja: {
    translation: {
      "📰 Advertise": "📰 広告",
      "<0>You need at least 5 credit</0><1>Cost&colon; 80K</1><2>You get +10 credit in the next month</2><3>You can only advertise once a month</3>": "<0>少なくともcreditが5必要です</0><1>Cost: $80K</1><2>翌月にcredit +10</2><3>広告は一月に一回まで</3>",
      "Pay $80K to advertise": "広告を行う ($80Kの支払い)",
      "Not enough cash": "Cash不足",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // lng: "en",
    lng: "ja",
    fallbackLng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome
    debug: true,
    missingKeyHandler: ((lng, ns, key, fallbackValue) => {
      console.log(lng, ns, key, fallbackValue);
    }),

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

interface Context {
  credit: number;
  cash: number;
}

function Advertise(props) {
  const context: Context = useContext(GFG.GameContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
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
  }, [])

  return (<>
    {
      (10 <= context.credit)
        ?  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#advertiseModal">
          {t("📰 Advertise")}
        </button>
        : <span className="d-inline-block" data-toggle="popover"
          title="Feature locked"
          data-content="You need at least 10 credit" >
          <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
            {t("📰 Advertise")}
          </button>
        </span>
    }
    <div className="modal" id="advertiseModal" tabIndex={-1} role="dialog" aria-labelledby="advertiseModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contractModalLabel">📰 Advertise</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{overflowX: "auto"}}>
            <ul>
              <Trans t={t}>
                <li>You need at least 5 credit</li>
                <li>Cost&colon; 80K</li>
                <li>You get +10 credit in the next month</li>
                <li>You can only advertise once a month</li>
              </Trans>
            </ul>
          </div>
          <div className="modal-footer">
            <form action={props.advertise_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
              {
                80 <= context.cash
                  ? <input type="submit" value={t("Pay $80K to advertise").toString()} className="btn btn-primary" />
                  : <input type="submit" value={t("Not enough cash").toString()} className="btn btn-primary" disabled />
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default Advertise;
