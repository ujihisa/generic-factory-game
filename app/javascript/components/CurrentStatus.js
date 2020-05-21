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
      <table className="table table-hover table-sm">
        <tbody>
          <tr>
            <th scope="col"><strong>Date</strong></th>
            <td scope="col">
              { GFG.currentMonth(context.month) } { 2020 + Math.floor(context.month / 12) }
            </td>
            <td scope="col"></td>
          </tr>
          <tr>
            <th scope="col"><strong>Money</strong></th>
            <td scope="col">
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
            <td scope="col"></td>
          </tr>
          <tr>
            <th scope="col"><strong>Credit</strong></th>
            <td scope="col">
              { props.credit }
              <div className="progress">
                <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${props.credit}%`}} aria-valuemin="0" aria-valuemax="100"
                  aria-valuenow={props.credit}>
                </div>
              </div>
            </td>
            <td scope="col"></td>
          </tr>
          <tr>
            <th scope="col"><strong>Storage</strong></th>
            <td scope="col">
              {
                (props.storage == 0)
                  ? <div className="alert alert-primary" role="alert">You must buy Storage first</div>
                  : <>
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
                    Size: { props.storage }t
                    <br/>
                    Ingredient: { props.ingredient }t (+ { props.ingredientSubscription }t)
                    <br/>
                    Product Volume: { props.product }t
                    <br/>
                    Product Quality { props.quality.toPrecision(4) }
                  </>
              }
            </td>
            <td scope="col">
              🗄️
              <br/>
              📦
              <br/>
              <br/>
            </td>
          </tr>
          <tr>
            <th scope="col"><strong>Factory</strong></th>
            <td scope="col">
              Production Volume <b>+{ props.productionVolume }t</b>
              <br/>
              Production Quality <b>{ props.productionQuality.toPrecision(4) }</b>
              <br/>
              {
                (context.equipments.some((e) => e.name == 'Factory base'))
                  ? <ul className="list-unstyled">
                    {
                      context.equipments.map((e) =>
                        <li key={e.name}>{e.name}</li>)
                    }
                  </ul>
                  : <div className="alert alert-primary" role="alert">You must install Factory base first</div>
              }
            </td>
            <td scope="col">
              🏭
            </td>
          </tr>
          <tr>
            <th scope="col"><strong>Contracts</strong></th>
            <td scope="col">
              {
                Object.keys(context.signedContracts).join(", ")
              }
              <br/>
              <small className="form-text text-muted">
                Requiring <b>{props.productRequiredNextMonth}t</b> products
              </small>
            </td>
            <td scope="col">
              📜
            </td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
}

CurrentStatus.propTypes = {
  cash: PropTypes.number,
  debt: PropTypes.number,
  credit: PropTypes.number,
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  ingredientSubscription: PropTypes.number,
  product: PropTypes.number,
  quality: PropTypes.number,
  productionVolume: PropTypes.number,
  productionQuality: PropTypes.number,
  productRequiredNextMonth: PropTypes.number,
};
export default CurrentStatus
