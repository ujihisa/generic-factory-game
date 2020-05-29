import React from "react"
import PropTypes from "prop-types"
import GFG from '../gfg'

class SubscribeIngredient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientSubscription: this.props.ingredientSubscription,
    };
  }

  render () {
    const volBefore = this.props.ingredientSubscription
    const volAfter = this.state.ingredientSubscription
    const changeFee = Math.abs((volAfter - volBefore) * 0.1)
    // const maxVol = volBefore + this.props.cash / 0.1
    const maxVol = this.props.storage

    return (
      <React.Fragment>
        <div className="modal-body">
          <p>
            $1K for every 10t ingredients. (0.10 $K/t)
          </p>

          Current subscription: {this.props.ingredientSubscription}t ${this.props.ingredientSubscription * 0.1}K<br/>

          <input
          type="range" className="custom-range" id="form-range-subscribe-ingredient"
          name="ingredient_subscription" value={this.state.ingredientSubscription}
          min="0" max={maxVol} step="10"
          onChange={(event) =>
            this.setState({ingredientSubscription: event.target.value})
          }/>

          New subscription: {this.state.ingredientSubscription}t ${this.state.ingredientSubscription * 0.1}K<br/>
          Change fee: ${changeFee}K
        </div>
        <div className="modal-footer">
          {
            changeFee == 0
              ? <input type="submit" value="Cancel" disabled className="btn btn-primary" />
              : <input type="submit" value={`Pay ${GFG.numberToCurrency(changeFee)} to subscribe ${this.state.ingredientSubscription}t`} className="btn btn-primary" />
          }
        </div>
      </React.Fragment>
    );
  }
}

SubscribeIngredient.propTypes = {
  cash: PropTypes.number,
  ingredientSubscription: PropTypes.number,
  storage: PropTypes.number,
};
export default SubscribeIngredient
