import React, { useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'

function SubscribeIngredient(props) {
  const [ingredientSubscription, setIngredientSubscription] =
    useState(props.ingredientSubscription);

  const volBefore = props.ingredientSubscription
  const volAfter = ingredientSubscription
  const changeFee = Math.abs((volAfter - volBefore) * 0.1)
  // const maxVol = volBefore + props.cash / 0.1
  const maxVol = props.storage

  return (
    <React.Fragment>
      <div className="modal-body">
        <p>
          $1K for every 10t ingredients. (0.10 $K/t)
        </p>

        Current subscription: {props.ingredientSubscription}t ${props.ingredientSubscription * 0.1}K<br/>

        <input
          type="range" className="custom-range" id="form-range-subscribe-ingredient"
          name="ingredient_subscription" value={ingredientSubscription}
          min="0" max={maxVol} step="10"
          onChange={(event) =>
              setIngredientSubscription(event.target.value)
          }/>

        New subscription: {ingredientSubscription}t ${ingredientSubscription * 0.1}K<br/>
        Change fee: ${changeFee}K
      </div>
      <div className="modal-footer">
        {
          changeFee == 0
            ? <input type="submit" value="Cancel" disabled className="btn btn-primary" />
            : <input type="submit" value={`Pay ${GFG.numberToCurrency(changeFee)} to subscribe ${ingredientSubscription}t`} className="btn btn-primary" />
        }
      </div>
    </React.Fragment>
  );
}

SubscribeIngredient.propTypes = {
  cash: PropTypes.number,
  ingredientSubscription: PropTypes.number,
  storage: PropTypes.number,
};
export default SubscribeIngredient
