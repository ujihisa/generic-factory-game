import React, { useState, useContext } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'

interface Context {
  credit: number;
  cash: number;
  storage: number;
  debt: number;
  ingredient: number;
  ingredientSubscription: number;
  product: number;
  quality: number;
  formAuthenticityToken: string;
  month: number;
  employeeGroups: any[];
  equipments: any[];
  signedContracts: string[];
  contractDump: { name: string }[];
}

function CurrentStatus(props) {
  const context: Context = useContext(GFG.GameContext);

  const moneyCol = (props.dept == 0) ? props.cash : 123;

  const moneyProgressGoal = 2 * props.debt + 1000;
  const moneyProgress =
    <div className="progress">
      <div className="progress-bar bg-danger" role="progressbar" style={{width: `${100 * props.debt / moneyProgressGoal}%`}}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={100 * props.debt / moneyProgressGoal}>
        { GFG.numberToCurrency(props.debt) }
      </div>
      <div className="progress-bar" role="progressbar" style={{width: `${100 * props.cash / moneyProgressGoal}%`}}
        aria-valuemin={0}
        aria-valuemax={100}
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
              {
                ['December', 'January', 'February'].includes(GFG.currentMonth(context.month))
                  ? '🏂'
                  : ['March', 'April', 'May'].includes(GFG.currentMonth(context.month))
                    ? '🌼'
                    : ['June', 'July', 'August'].includes(GFG.currentMonth(context.month))
                    ? '🌞'
                    : ['September', 'October', 'November'].includes(GFG.currentMonth(context.month))
                      ? '🍁'
                      : '-'
              }
              { GFG.currentMonth(context.month) } { 2020 + Math.floor(context.month / 12) }
            </td>
            <td scope="col"></td>
          </tr>
          <tr>
            <th scope="col">
              <strong>
                <u data-toggle="tooltip" title="If your cash goes less than 0, the game is over. if your total money goes equal or more than 1000, this game ends with your victory.">
                  Money
                </u>
              </strong>
            </th>
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
            <th scope="col">
              <strong>
                <u data-toggle="tooltip" title="Up to 100. It gradually increases/decreases to the production quality you deliver.">
                  Credit
                </u>
              </strong>
            </th>
            <td scope="col">
              { props.credit }
              <div className="progress">
                <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${props.credit}%`}}
                  aria-valuemin={0}
                  aria-valuemax={100}
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
                          <div className="progress-bar bg-primary" role="progressbar" style={{width: `${pProduct}%`}}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={pProduct}>
                            P
                          </div>
                          <div className="progress-bar bg-info" role="progressbar" style={{width: `${pIngredient}%`}}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={pIngredient}>
                            I
                          </div>
                          <div className="progress-bar bg-info" role="progressbar" style={{width: `${pIngredientSubscription}%`, height: "2px"}}
                            aria-valuemin={0}
                            aria-valuemax={100}
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
              <div style={{position: "relative"}}>
                <div>
                  {
                    Object.values(context.employeeGroups).flatMap((employeeGroup) => 
                      Array(employeeGroup.num_hired).fill(null).map((_, i) =>
                        <img
                          key={`${employeeGroup.name}-${i}`}
                          src={`/images/${employeeGroup.image}`}
                          style={{height: "2.0em"}}
                          data-toggle="tooltip" title={`${employeeGroup.name} #${i + 1}`}
                          />)
                    )
                  }
                  <br/>
                  Production Volume <b>+{ props.productionVolume }t</b>
                  <br/>
                  Production Quality <b>{ props.productionQuality.toPrecision(4) }</b>
                  <br/>
                </div>
                {
                  (0 < context.equipments.length) &&
                    <div style={{position: "relative", height: "200px"}}>
                      {
                        context.equipments.
                          filter((equipment) => context.equipments.every((e) => !e.deprecate.includes(equipment.name))).
                          map((equipment, i) =>
                            <img key={i} src={`/images/${equipment.image.src}`} style={{position: "absolute", zIndex: equipment.image.z}} />)

                      }
                    </div>
                }
                <div>
                  {
                    (context.equipments.some((e) => e.type == 'base'))
                      ? <ul className="list-unstyled">
                        {
                          context.equipments.
                            filter((e) => context.equipments.every((e2) => !e2.deprecate.includes(e.name))).
                            map((e) =>
                              <li key={e.name}>
                                <u data-toggle="tooltip" title={
                                  ['production', 'quality'].
                                    flatMap((type) =>
                                      Object.entries(e[type]).
                                      filter(([_, v]) => v).
                                      map(([k, v]) =>
                                        type == 'production'
                                          ? `${k} vol +${v}t`
                                          : `${k} quality +${v}`
                                      )
                                    ).
                                    concat(`${GFG.numberToCurrency(e.cost)}/m`).
                                    join(", ")
                                  }>
                                  {e.name}
                                </u>
                              </li>)
                        }
                      </ul>
                      : <div className="alert alert-primary" role="alert">You must install Factory base first</div>
                  }
                </div>
              </div>
            </td>
            <td scope="col">
              🏭
            </td>
          </tr>
          <tr>
            <th scope="col"><strong>Contracts</strong></th>
            <td scope="col">
              {
                Object.keys(context.signedContracts).map((c) => context.contractDump[c].name).join(", ")
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
