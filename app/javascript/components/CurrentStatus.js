import React from "react"
import PropTypes from "prop-types"

import GFG from '../gfg'

class CurrentStatus extends React.Component {
  static contextType = GFG.GameContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
  }

  render () {
    const moneyCol = (this.props.dept == 0) ? this.props.cash : 123

    const moneyProgressGoal = 2 * this.props.debt + 1000
    const moneyProgress =
      <div className="progress">
        <div className="progress-bar bg-danger" role="progressbar" style={{width: `${100 * this.props.debt / moneyProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * this.props.debt / moneyProgressGoal}>
          { GFG.numberToCurrency(this.props.debt) }
        </div>
        <div className="progress-bar" role="progressbar" style={{width: `${100 * this.props.cash / moneyProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * this.props.cash / moneyProgressGoal}>
          { GFG.numberToCurrency(this.props.cash) }
        </div>
      </div>;

    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <th><strong>Date</strong></th>
              <td>
                { GFG.currentMonth(this.props.month) } { 2020 + Math.floor(this.props.month / 12) }
              </td>
              <td></td>
            </tr>
            <tr>
              <th><strong>Money</strong></th>
              <td>
                {
                  (this.props.debt == 0)
                    ?  <b>{ GFG.numberToCurrency(this.props.cash) }</b>
                    : <span>
                      Debt: <b>{ GFG.numberToCurrency(this.props.debt) }</b><br/>
                      Cash: <b>{ GFG.numberToCurrency(this.props.cash) }</b><br/>
                      Total: <b>{ GFG.numberToCurrency(this.props.cash - this.props.debt) }</b>
                    </span>
                }
                {moneyProgress}
              </td>
              <td></td>
            </tr>
            <tr>
              <th><strong>Credit</strong></th>
              <td>
                { this.props.credit }
                <div className="progress">
                  <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${this.props.credit}%`}} aria-valuemin="0" aria-valuemax="100"
                    aria-valuenow={this.props.credit}>
                  </div>
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <th><strong>Storage</strong></th>
              <td>
                Size: { this.props.storage }t
                <br/>
                Ingredient: { this.props.ingredient }t (+ { this.props.ingredientSubscription }t)
                <br/>
                Product: { this.props.product }t

                {
                  (() => {
                    const pProduct = 100 * this.props.product / this.props.storage
                    const pIngredient = 100 * this.props.ingredient / this.props.storage
                    const pIngredientSubscription = 100 * this.props.ingredientSubscription / this.props.storage
                    return <div className="progress">
                      <div className="progress-bar bg-primary" role="progressbar" style={{width: `${pProduct}%`}} aria-valuemin="0" aria-valuemax="100"
                        aria-valuenow={pProduct}>
                        P
                      </div>
                      <div className="progress-bar bg-info" role="progressbar" style={{width: `${pIngredient}%`}} aria-valuemin="0" aria-valuemax="100"
                        aria-valuenow={pIngredient}>
                        I
                      </div>
                      <div className="progress-bar bg-info" role="progressbar" style={{width: `${pIngredientSubscription}%`, height: "2px"}} aria-valuemin="0" aria-valuemax="100"
                        aria-valuenow={pIngredientSubscription}>
                      </div>
                    </div>
                  })()
                }
              </td>
              <td>
                🗄️
                <br/>
                📦
                <br/>
                <br/>
              </td>
            </tr>
            <tr>
              <th><strong>Idle Employees</strong></th>
              <td>
                {
                  React.Children.map(
                    [
                      ...Array(this.props.idleFactory.junior).fill('junior'),
                      ...Array(this.props.idleFactory.intermediate).fill('intermediate'),
                      ...Array(this.props.idleFactory.senior).fill('senior')
                    ],
                    (e) =>
                      <img src={`/images/employee-${e}.png`} width="16" title={e} />)
                }
              </td>
              <td>
                💼
              </td>
            </tr>
            <tr>
              <th><strong>Factories</strong></th>
              <td>
                { this.props.factoryNames.join(", ") }
              </td>
              <td>
                🏭
              </td>
            </tr>
            <tr>
              <th><strong>Contracts</strong></th>
              <td>
                {
                  // TODO: Replace this with
                  // this.context.signedContracts.join(", ")
                  this.context.signedContracts && this.context.signedContracts.join(", ")
                }
              </td>
              <td>
                📜
              </td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

CurrentStatus.propTypes = {
  month: PropTypes.number,
  cash: PropTypes.number,
  debt: PropTypes.number,
  credit: PropTypes.number,
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  ingredientSubscription: PropTypes.number,
  product: PropTypes.number,
  idleFactory: PropTypes.object,
  factoryNames: PropTypes.array,
  contractNames: PropTypes.array,
};
export default CurrentStatus
