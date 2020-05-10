import React from "react"
import PropTypes from "prop-types"
import GFG from '../gfg'

class BuyIngredient extends React.Component {
  constructor(props) {
    super(props);
    this.spaceLeft = this.props.storage - this.props.ingredient - this.props.product;
    this.spaceLeftTruncated = this.spaceLeft - (this.spaceLeft % 20);
    this.max = Math.min(
      Math.floor(this.props.cash / 0.5 / 20) * 20,
      this.spaceLeftTruncated);
    this.state = {
      vol: 0,
      delay: 1,
      inputNumberVol: 0,
    };
  }

  readableDate(month) {
    return `${GFG.currentMonth(month)} ${Math.floor(2020 + month / 12)}`;
  }

  render () {
    const costPerVol = {1: 0.5, 2: 0.1, 3: 0.05}[this.state.delay];
    const cost = costPerVol * this.state.vol;
    const f = (event) => {
      this.setState({delay: event.target.value})
    };
    const cashBalance =
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{width: `${100 * (this.props.cash - cost) / this.props.cash}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * (this.props.cash - cost) / this.props.cash}>
          Cash left: {GFG.numberToCurrency(this.props.cash - cost)}
        </div>
        <div className="progress-bar bg-secondary" role="progressbar" style={{width: `${100 * cost / this.props.cash}%`}} aria-valuemin="0" aria-valuemax="100"
          aria-valuenow={100 * cost / this.props.cash}>
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

    return (
      <React.Fragment>
        <div className="modal-body">
          <p>
            $10K for every 20t ingredients.
          </p>

          <input type="number"
            value={this.state.inputNumberVol}
            className={(this.state.inputNumberVol == this.state.vol) ? "form-control" : "form-control is-invalid"}
            onChange={(e) => {
              this.setState({inputNumberVol: e.target.value});
              (e.target.value % 20 == 0) && (20 <= e.target.value) && (e.target.value <= this.max) && this.setState({vol: e.target.value})
            }}/>

          <input
          type="range" className="custom-range" id="form-range-buy-ingredient"
          name="vol" value={this.state.vol}
          min="20" max={this.max} step="20"
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
      </React.Fragment>
    );
  }
}

BuyIngredient.propTypes = {
  month: PropTypes.number,
  cash: PropTypes.number,
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number
};
export default BuyIngredient
