import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import GFG from '../gfg'

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: props.debt,
      credit: props.credit,
      cash: props.cash,
    };
  }

  render () {
    if (this.props.status != 'in_progress')
      return null
    return (
      <React.Fragment>
        <h2>Actions</h2>

        {
          (0 < this.state.credit || 0 < this.state.debt)
            ? <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
              🏦 Bank
            </button>
            : <button type="button" className="btn btn-secondary" title="You need more credit" disabled>
              🏦 Bank
            </button>
        }

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
                <GFG.ThemeContext.Provider value={this.state}>
                  <Bank />
                </GFG.ThemeContext.Provider>
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
