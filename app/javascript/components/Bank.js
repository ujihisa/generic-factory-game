import React, { useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'

function Bank(props) {
  const context = useContext(GFG.GameContext);
  const [debt, setDebt] = useState(context.debt);

  const upper_limit = context.credit * 10;
  const interest_rate = 10 - context.credit / 10;
  const interest = Math.ceil(debt * interest_rate / 100);

  const bankProgressGoal = upper_limit;
  const bankProgress =
    <div className="progress">
      <div className="progress-bar bg-danger" role="progressbar" style={{width: `${100 * Math.min(context.debt, debt) / bankProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
        aria-valuenow={100 * Math.min(context.debt, debt) / bankProgressGoal}>
        { GFG.numberToCurrency(Math.min(context.debt, debt)) }
      </div>
      <div className={`progress-bar ${(debt < context.debt) && "bg-secondary"}`} role="progressbar" style={{width: `${100 * Math.abs(debt - context.debt) / bankProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
        aria-valuenow={100 * Math.abs(debt - context.debt) / bankProgressGoal}>
        { debt } - { context.debt } =
        { GFG.numberToCurrency(debt - context.debt) }
      </div>
    </div>;

  return (
    <React.Fragment>
      <input type="hidden" name="authenticity_token" value={props.formAuthenticityToken} />
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">🏦 Bank</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <ul>
          <li>You can borrow cash up to $<code>10 * credit</code>K</li>
          <li>The monthly interest rate is <code>(100 - credit)/10 %</code></li>
          <li>Interest rounds up after the decimal point</li>
          <ul>
            <li>For example if your credit is 75, the rate is <code>10 - 7.5 = 2.5%</code></li>
            <li>If you borrow $100K, you must pay $3K every month</li>
          </ul>
          <li>When your credit changes, it updates the interest rate immediately</li>
          <li>You must keep paying the interest until you wipe away the debt</li>
        </ul>
        <div className="row">
          <div className="col-3">
            <input type="text" className="form-control" value={GFG.numberToCurrency(context.debt)} readOnly />
            <small id="debtHelp" className="form-text text-muted">Current debt</small>
          </div>
          <div className="col-1">
            →
          </div>
          <div className="col-8">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="validationTooltipUsernamePrepend">$</span>
              </div>
              <input type="number" name="debt" value={debt} className="form-control" id="form-number-borrow-debt" required aria-describedby="debtHelp" min="0" onChange={(event) =>
                  setDebt(event.target.value == "" ? "" : Math.min(event.target.value, upper_limit))
                }/>
              <div className="input-group-append">
                <span className="input-group-text" id="validationTooltipUsernamePrepend">K</span>
              </div>
            </div>
            <small id="debtHelp" className="form-text text-muted">
              New debt
            </small>
          </div>
        </div>
        <br/>

        {
          context.darklaunch['enable-bank-client-side-adjuetment-buttons'] &&
            <div>
              <button type="button" className="btn btn-outline-secondary btn-sm" 
                disabled={debt == 0}
                onClick={(event) => {
                  setDebt(Math.max(0, context.debt - context.cash));
                  $('#form-range-bank').focus()
                }}>
                Min
              </button>
              &nbsp;
              <button type="button" className="btn btn-outline-secondary btn-sm" 
                onClick={(event) => {
                  const adjustment =
                    Math.ceil((context.debt + props.minCashForNextMonth) * interest_rate / 100) -
                    Math.ceil(context.debt * interest_rate / 100);
                  const ideal = context.debt + props.minCashForNextMonth + adjustment;
                  setDebt(Math.min(ideal, upper_limit));
                  $('#form-range-bank').focus()
                }}>
                便利
              </button>
              &nbsp;
              <button type="button" className="btn btn-outline-secondary btn-sm" 
                disabled={debt == upper_limit}
                onClick={(event) => {
                  setDebt(upper_limit);
                  $('#form-range-bank').focus()
                }}>
                Max
              </button>
            </div>
        }

        <input
          type="range" className="custom-range" id="form-range-bank"
          name="debt" value={debt}
          min="0" max={upper_limit}
          onChange={(event) =>
              setDebt(event.target.value)
          }/>
        <br/>

        {bankProgress}

        <small id="debtHelp" className="form-text text-muted">
          {
            (0 <= debt && debt <= upper_limit)
              ? (
                <div align="right">
                  Monthly interest: <b>{GFG.numberToCurrency(interest)}</b>
                  &nbsp;
                  (<b>{(10 - context.credit / 10)}%</b>)
                </div>
              )
              : (<span>ERROR</span>)
          }
        </small>
      </div>
      <div className="modal-footer">
        {
          (context.debt == debt)
            ? <input type="submit" value="No change" className="btn btn-primary" disabled />
            : (context.debt < debt)
              ? <input type="submit" value={`Borrow ${GFG.numberToCurrency(debt - context.debt)}`} className="btn btn-primary" />
              : (-debt + context.debt <= context.cash)
                ? <input type="submit" value={`Pay ${GFG.numberToCurrency(context.debt - debt)}`} className="btn btn-primary" />
                : <input type="submit" value="Not enough cash" className="btn btn-primary" disabled />
        }
      </div>

    </React.Fragment>
  );
}

Bank.propTypes = {
  minCashForNextMonth: PropTypes.number,
};

export default Bank
