import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"

class ActionMenu extends React.Component {
  render () {
    if (this.props.status != 'in_progress')
      return null
    return (
      <React.Fragment>
        <h2>Actions</h2>

        <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
          🏦 Bank
        </button>

        <div className="modal" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form action={this.props.action} acceptCharset="UTF-8" data-remote="true" method="post">
                <input type="hidden" name="authenticity_token" value={this.props.authenticity_token} />
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">🏦 Bank</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <ul>
                    <li>You can borrow cash up to $<code>10 * credit</code>K</li>
                    <li>The monthly interest rate is <code>10 - credit/10 %</code></li>
                    <li>Interest rounds up after the decimal point</li>
                    <ul>
                      <li>For example if your credit is 75, the rate is <code>10 - 7.5 = 2.5%</code></li>
                      <li>If you borrow $100K, you must pay $3K every month</li>
                    </ul>
                    <li>When your credit changes, it updates the interest rate immediately</li>
                    <li>You must keep paying the interest until you wipe away the debt</li>
                  </ul>

                  <Bank debt={this.props.debt} cash={this.props.cash} credit={this.props.credit} />
                </div>
                <div className="modal-footer">
                  <input type="submit" value="Borrow/Pay" className="btn btn-primary" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <br/><br/>
      </React.Fragment>
    );
  }
}

ActionMenu.propTypes = {
  status: PropTypes.string,
  cash: PropTypes.number,
  debt: PropTypes.number,
  credit: PropTypes.number,
  action: PropTypes.string,
  formAuthenticityToken: PropTypes.string,
};
export default ActionMenu
