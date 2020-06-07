import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg';
import { Trans, useTranslation } from 'react-i18next';

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
                <li>Cost&#58; $80K</li>
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
