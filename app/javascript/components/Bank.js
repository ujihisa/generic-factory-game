import React from "react"
import PropTypes from "prop-types"
class Bank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: props.debt,
    };
  }

  render () {
    const upper_limit = this.props.credit * 10;
    let interest_rate = 10 - this.props.credit / 10;
    let interest = Math.ceil(this.state.debt * interest_rate / 100);

    return (
      <React.Fragment>
      <div className="row">
      <div className="col">
      <input type="text" className="form-control" value={this.props.debt} readOnly />
      <small id="debtHelp" className="form-text text-muted">Current debt</small>
      </div>

      <div className="col-8">
      <div className="input-group">
      <div className="input-group-prepend">
      <span className="input-group-text" id="validationTooltipUsernamePrepend">$</span>
      </div>
      <input type="number" name="debt" value={this.state.debt} className="form-control" id="form-number-borrow-debt" required aria-describedby="debtHelp" min="0" onChange={(event) =>
          this.setState({debt: event.target.value == "" ? "" : Math.min(event.target.value, upper_limit)})
      }/>
      <div className="input-group-append">
      <span className="input-group-text" id="validationTooltipUsernamePrepend">K</span>
      </div>
      </div>
      <small id="debtHelp" className="form-text text-muted">
      New debt, up to ${upper_limit}K
      </small>
      </div>
      </div>

      <small id="debtHelp" className="form-text text-muted">
      {
        (0 <= this.state.debt && this.state.debt <= upper_limit)
        ? (
          <span>
          Cash you gain: <b>${this.state.debt - this.props.debt}K</b><br/>
          Monthly interest: <b>${interest}</b>
          &nbsp;
          (<b>{(10 - this.props.credit / 10)}%</b>)
          </span>
        )
        : (<span>ERROR</span>)
      }
      </small>

      </React.Fragment>
    );
  }
}

Bank.propTypes = {
  debt: PropTypes.number,
  cash: PropTypes.number,
  credit: PropTypes.number
};
export default Bank
