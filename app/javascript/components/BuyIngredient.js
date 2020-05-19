import React from "react"
import PropTypes from "prop-types"
import GFG from '../gfg'

class BuyIngredient extends React.Component {
  static contextType = GFG.GameContext;

  constructor(props, context) {
    super(props, context);
    this.spaceLeft = context.storage - this.props.ingredient - this.props.product;
    this.spaceLeftTruncated = this.spaceLeft - (this.spaceLeft % 40);
    this.max = Math.min(
      Math.floor(context.cash / 0.25 / 40) * 40,
      this.spaceLeftTruncated);
    this.state = {
      vol: Math.min(40, this.spaceLeftTruncated),
      inputNumberVol: Math.min(40, this.spaceLeftTruncated),
    };
  }

  render () {
    const costPerVol = 0.25;
    const cost = costPerVol * this.state.vol;
    const cashBalance =
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: `${100 * (this.context.cash - cost) / this.context.cash}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * (this.context.cash - cost) / this.context.cash}>
          Cash left: {GFG.numberToCurrency(this.context.cash - cost)}
        </div>
        <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${100 * cost / this.context.cash}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * cost / this.context.cash}>
          Cost: {GFG.numberToCurrency(cost)}
        </div>
      </div>
    const storageBalance =
      <div className="progress">
        <div className="progress-bar bg-info" role="progressbar" style={{width: `${100 * (this.state.vol) / this.spaceLeft}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * (this.state.vol) / this.spaceLeft}>
          Vol: {this.state.vol}t
        </div>
        <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${100 * (this.spaceLeft - this.state.vol) / this.spaceLeft}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * (this.spaceLeft - this.state.vol) / this.spaceLeft}>
          Space left: {this.spaceLeft - this.state.vol}t
        </div>
      </div>

    return (<>
      {
        (0 < this.context.storage)
          ? <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#buyIngredientModal">
            📦 Buy Ingredient
          </button>
          : <span className="d-inline-block" data-toggle="popover"
            title="Feature locked"
            data-content="You need at least 1 storage" >
            <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
              📦 Buy Ingredient
            </button>
          </span>
      }
      <div className="modal" id="buyIngredientModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form action={this.props.buy_ingredients_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
              <input type="hidden" name="authenticity_token" value={this.context.formAuthenticityToken} />
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">📦 Buy Ingredient</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  $10K for every 40t ingredients.
                </p>
                <input type="number"
                  value={this.state.inputNumberVol}
                  className={(this.state.inputNumberVol == this.state.vol) ? "form-control" : "form-control is-invalid"}
                  onChange={(e) => {
                    this.setState({inputNumberVol: e.target.value});
                    (e.target.value % 40 == 0) && (40 <= e.target.value) && (e.target.value <= this.max) && this.setState({vol: e.target.value})
                  }}/>

                <input
                type="range" className="custom-range" id="form-range-buy-ingredient"
                name="vol" value={this.state.vol}
                min="40" max={this.max} step="40"
                onChange={(e) => {
                  this.setState({inputNumberVol: e.target.value});
                  this.setState({vol: e.target.value})
                }}/>
                <br/>

                {cashBalance}
                <br/>
                {storageBalance}
              </div>
              <div className="modal-footer">
                {
                  (this.state.vol == 0)
                    ? <input type="submit" value="Not enough volume to buy" className="btn btn-primary" disabled />
                    : <input type="submit" value={`Pay ${GFG.numberToCurrency(cost)} to get ${this.state.vol}t now`} className="btn btn-primary" />
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </>);
  }
}

BuyIngredient.propTypes = {
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number,
  buy_ingredients_game_url: PropTypes.string,
};
export default BuyIngredient
