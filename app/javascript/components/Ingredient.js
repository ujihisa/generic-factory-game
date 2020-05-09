import React from "react"
import PropTypes from "prop-types"
class Ingredient extends React.Component {
  constructor(props) {
    super(props);
    this.spaceLeft = this.props.storage - this.props.ingredient - this.props.product;
    this.spaceLeftTruncated = this.spaceLeft - (this.spaceLeft % 20);
    this.state = {
      vol: this.spaceLeftTruncated,
    };
  }

  render () {
    let cost = this.state.vol / 20;

    return (
      (this.spaceLeftTruncated == 0) ?
      (<React.Fragment>No space left</React.Fragment>) :
      (
      <React.Fragment>
      
      <input
      type="range" className="custom-range" id="form-range-buy-ingredient"
      name="vol" defaultValue={this.state.vol}
      min="0" max={this.spaceLeftTruncated} step="20"
      onChange={(event) =>
        this.setState({vol: event.target.value})
      }/>
        vol: {this.state.vol}<br/>
        Cost: {cost}<br/>
        New Cash: {this.props.cash - cost}<br/>
      </React.Fragment>
      )
    );
  }
}

Ingredient.propTypes = {
  cash: PropTypes.number,
  storage: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number
};
export default Ingredient
