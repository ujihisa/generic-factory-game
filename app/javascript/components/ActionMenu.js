import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import GFG from '../gfg'
import CurrentStatus from './CurrentStatus'

class ActionMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cash: this.props.cash,
      storage: this.props.storage,
    };
  }

  storagePrice() {
    return (this.state.storage - this.props.storage) / 100
  }

  render () {
    return (
      <React.Fragment>
        {
          (0 < this.props.cash)
            ? <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#storageModal">
              🗄️ Storage
            </button>
            : <span className="d-inline-block" data-toggle="popover"
              title="Feature locked"
              data-content="You need at least 1 cash" >
              <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
                🗄️ Storage
              </button>
            </span>
        }
        <div className="modal" id="storageModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form action={this.props.create_storages_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    🗄️ Storage
                  </h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <ul>
                    <li><b>$1K</b> to buy</li>
                    <li><b>$1K</b>/month to keep</li>
                    <li><b>$1K</b>/month to keep</li>
                    <li>Both products and ingredients are stored in storage. You can't store more than the capacity.</li>
                    <ul>
                      <li>The overflow will be simply discarded</li>
                    </ul>
                  </ul>
                  <input
                    type="range" className="custom-range" id="form-range-storage"
                    name="storage" value={this.state.storage}
                    min={this.props.storage} max={this.props.cash * 100} step="100"
                    onChange={(event) => {
                      this.setState({
                        storage: event.target.value,
                        cash: this.props.cash - (parseInt(event.target.value, 10) - this.props.storage) / 100,
                      })
                    }
                    }/>
                  {this.props.storage}t → {this.state.storage}t ({GFG.numberToCurrency(this.storagePrice())})
                  <CurrentStatus
                    month={this.props.parent.month}
                    cash={this.state.cash}
                    debt={this.props.parent.debt}
                    credit={this.props.parent.credit}
                    storage={parseInt(this.state.storage, 10)}
                    ingredient={this.props.parent.ingredient}
                    ingredientSubscription={this.props.parent.ingredientSubscription}
                    product={this.props.parent.product}
                    idleFactory={this.props.parent.idleFactory}
                    factoryNames={this.props.parent.factoryNames}
                    contractNames={this.props.parent.contractNames}
                  />
                </div>
                <div className="modal-footer">
                  <input type="hidden" name="authenticity_token" value={this.props.formAuthenticityToken} />
                  {
                    (this.storagePrice() == 0)
                      ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                      : <input type="submit" value={`Pay ${GFG.numberToCurrency(this.storagePrice())} to Buy`} className="btn btn-primary" />
                  }
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
  cash: PropTypes.number,
  storage: PropTypes.number,
  formAuthenticityToken: PropTypes.string,
  create_storages_game_url: PropTypes.string,
};
export default ActionMenu
