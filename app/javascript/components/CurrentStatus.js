import React, { useState, useContext } from 'react';
import PropTypes from "prop-types"

import GFG from '../gfg'

function CurrentStatus(props) {
  const context = useContext(GFG.GameContext);

  const moneyCol = (props.dept == 0) ? props.cash : 123

  const moneyProgressGoal = 2 * props.debt + 1000
  const moneyProgress =
    <div className="progress">
      <div className="progress-bar bg-danger" role="progressbar" style={{width: `${100 * props.debt / moneyProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
        aria-valuenow={100 * props.debt / moneyProgressGoal}>
        { GFG.numberToCurrency(props.debt) }
      </div>
      <div className="progress-bar" role="progressbar" style={{width: `${100 * props.cash / moneyProgressGoal}%`}} aria-valuemin="0" aria-valuemax="100"
        aria-valuenow={100 * props.cash / moneyProgressGoal}>
        { GFG.numberToCurrency(props.cash) }
      </div>
    </div>;

  return (
    <React.Fragment>
      <table id="tableCurrentStatus">
        <tbody>
          <tr>
            <th><strong>Date</strong></th>
            <td>
              { GFG.currentMonth(props.month) } { 2020 + Math.floor(props.month / 12) }
            </td>
            <td></td>
          </tr>
          <tr>
            <th><strong>Money</strong></th>
            <td>
              {
                (props.debt == 0)
                  ?  <b>{ GFG.numberToCurrency(props.cash) }</b>
                  : <span>
                    Debt: <b>{ GFG.numberToCurrency(props.debt) }</b><br/>
                    Cash: <b>{ GFG.numberToCurrency(props.cash) }</b><br/>
                    Total: <b>{ GFG.numberToCurrency(props.cash - props.debt) }</b>
                  </span>
              }
              {moneyProgress}
            </td>
            <td></td>
          </tr>
          <tr>
            <th><strong>Credit</strong></th>
            <td>
              { props.credit }
              <div className="progress">
                <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${props.credit}%`}} aria-valuemin="0" aria-valuemax="100"
                  aria-valuenow={props.credit}>
                </div>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <th><strong>Storage</strong></th>
            <td>
              Size: { props.storage }t
              <br/>
              Ingredient: { props.ingredient }t (+ { props.ingredientSubscription }t)
              <br/>
              Product: { props.product }t

              {
                (() => {
                  const pProduct = 100 * props.product / props.storage
                  const pIngredient = 100 * props.ingredient / props.storage
                  const pIngredientSubscription = 100 * props.ingredientSubscription / props.storage
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
                    ...Array(props.idleFactory.junior).fill('junior'),
                    ...Array(props.idleFactory.intermediate).fill('intermediate'),
                    ...Array(props.idleFactory.senior).fill('senior')
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
            <th><strong>Factory</strong></th>
            <td>
              Manual
              <br/>
              Volume +{ props.productionYield }t
              <br/>
              Average Quality xx.x
              <br/>
              <ul className="list-unstyled">
                {
                  context.equipments && // TODO: remove this line
                  context.equipments.map((e) =>
                    <li key={e.name}>{e.name}</li>)
                }
              </ul>
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
                // context.signedContracts.join(", ")
                context.signedContracts && context.signedContracts.join(", ")
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
  productionYield: PropTypes.number,
};
export default CurrentStatus
