import React from "react"
import PropTypes from "prop-types"
import GamePane from "./GamePane"
import GFG from '../gfg'

class Bank extends React.Component {
  static contextType = GFG.GameContext;

  constructor(props) {
    super(props);
    this.state = {
      debt: '',
    };
  }

  componentDidMount() {
    this.setState({
      debt: this.context.debt,
    });
  }

  render () {
    const upper_limit = this.context.credit * 10;
    const interest_rate = 10 - this.context.credit / 10;
    const interest = Math.ceil(this.state.debt * interest_rate / 100);

    const bankProgressGoal = upper_limit;
    const bankProgress =
      <div className="progress">
        <div className="progress-bar bg-danger" role="progressbar" style={{width: `${100 * Math.min(this.context.debt, this.state.debt) / bankProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * Math.min(this.context.debt, this.state.debt) / bankProgressGoal}>
          { GFG.numberToCurrency(Math.min(this.context.debt, this.state.debt)) }
        </div>
        <div className={`progress-bar ${(this.state.debt < this.context.debt) && "bg-secondary"}`} role="progressbar" style={{width: `${100 * Math.abs(this.state.debt - this.context.debt) / bankProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * Math.abs(this.state.debt - this.context.debt) / bankProgressGoal}>
          { this.state.debt } - { this.context.debt } =
          { GFG.numberToCurrency(this.state.debt - this.context.debt) }
        </div>
      </div>;

    return (
      <React.Fragment>
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
              <input type="text" className="form-control" value={GFG.numberToCurrency(this.context.debt)} readOnly />
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
                <input type="number" name="debt" value={this.state.debt} className="form-control" id="form-number-borrow-debt" required aria-describedby="debtHelp" min="0" onChange={(event) =>
                    this.setState({debt: event.target.value == "" ? "" : Math.min(event.target.value, upper_limit)})
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

          <input
          type="range" className="custom-range" id="form-range-subscribe-ingredient"
          name="ingredient_subscription" value={this.state.debt}
          min="0" max={upper_limit}
          onChange={(event) =>
            this.setState({debt: event.target.value})
          }/>
          <br/>

          {bankProgress}

          <small id="debtHelp" className="form-text text-muted">
            {
              (0 <= this.state.debt && this.state.debt <= upper_limit)
                ? (
                  <div align="right">
                    Monthly interest: <b>{GFG.numberToCurrency(interest)}</b>
                    &nbsp;
                    (<b>{(10 - this.context.credit / 10)}%</b>)
                  </div>
                )
                : (<span>ERROR</span>)
            }
          </small>
        </div>
        <div className="modal-footer">
          {
            (this.context.debt == this.state.debt)
              ? <input type="submit" value="No change" className="btn btn-primary" disabled />
              : (this.context.debt < this.state.debt)
                ? <input type="submit" value={`Borrow ${GFG.numberToCurrency(this.state.debt - this.context.debt)}`} className="btn btn-primary" />
                : (-this.state.debt + this.context.debt <= this.context.cash)
                  ? <input type="submit" value={`Pay ${GFG.numberToCurrency(this.context.debt - this.state.debt)}`} className="btn btn-primary" />
                  : <input type="submit" value="Not enough cash" className="btn btn-primary" disabled />
          }
        </div>

      </React.Fragment>
    );
  }
}

Bank.propTypes = {
};
export default Bank
