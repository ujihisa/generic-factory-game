import React from "react"
import PropTypes from "prop-types"
class IngredientDelivery extends React.Component {
  constructor(props) {
    super(props);
    this.spaceLeft = this.props.storage - this.props.ingredient - this.props.product;
    this.spaceLeftTruncated = this.spaceLeft - (this.spaceLeft % 20);
    this.state = {
      vol: this.spaceLeftTruncated,
      delay: 2,
    };
  }

  readableDate(month) {
    const readableMonth =
      [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ][month % 12];
    return `${readableMonth} ${Math.floor(2020 + month / 12)}`;
  }

  render () {
    const costPerVol = {1: 0.5, 2: 0.1, 3: 0.05}[this.state.delay];
    const cost = costPerVol * this.state.vol;
    const f = (event) => {
      this.setState({delay: event.target.value})
    };
    const balance = this.props.cash - cost;

    return (
      <React.Fragment>
        <div className="modal-body">
          You pay first, and you get later.
          <ul>
            <li>Pay <b>$10K</b> per <b>20t</b> if you wish ingredient to be delivered <u>next month</u></li>
            <li>Pay <b>$2K</b> per <b>20t</b> if you wish ingredient to be delivered in <u>2 month</u></li>
            <li>Pay <b>$1K</b> per <b>20t</b> if you wish ingredient to be delivered in <u>3 month</u></li>
            <li>Overflow ingredient will be simply trashed</li>
          </ul>


          Get delivered due
          <div className="row">
            <div className="col">
              <label className="btn btn-secondary">
                <input type="radio" name="delay" id="option1" value="1" autoComplete="off" onChange={f} />
                {this.readableDate(this.props.month + 1)}
              </label>
            </div>
            <div className="col">
              <label className="btn btn-secondary active">
                <input type="radio" name="delay" id="option2" value="2" autoComplete="off" defaultChecked onChange={f} />
                {this.readableDate(this.props.month + 2)}
              </label>
            </div>
            <div className="col">
              <label className="btn btn-secondary">
                <input type="radio" name="delay" id="option3" value="3" autoComplete="off" onChange={f} />
                {this.readableDate(this.props.month + 3)}
              </label>
            </div>
          </div>

          <br/> <br/>

          Volume: <b>{this.state.vol}</b>

          <input
          type="range" className="custom-range" id="form-range-buy-ingredient"
          name="vol" defaultValue={this.state.vol}
          min="20" max={this.props.cash / 0.05} step="20"
          onChange={(event) =>
            this.setState({vol: event.target.value})
          }/>
          Cash Balance:
          ${this.props.cash}K - <b>${cost}K</b> = {0 <= balance ? <b>${balance}K</b> : <font color="red">ERROR</font>}<br/>
        </div>
        <div className="modal-footer">
          <input type="submit" value="Buy" className="btn btn-primary" />
        </div>
      </React.Fragment>
    );
  }
}

IngredientDelivery.propTypes = {
  month: PropTypes.number,
  cash: PropTypes.number,
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number
};
export default IngredientDelivery
