import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import GFG from '../gfg'
import CurrentStatus from './CurrentStatus'

class ActionMenu extends React.Component {
  static contextType = GFG.GameContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      cash: context.cash,
      storage: context.storage + 100,
      inputNumberStorage: 100,
    };
  }

  storagePrice() {
    return (this.state.storage - this.context.storage) / 100
  }

  render () {
    const min = this.context.storage;
    const max = this.context.cash * 50;
    return (
      <React.Fragment>
        {
          (0 < this.context.cash)
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
                    <li><b>$1K</b> to buy 100t capacity storage</li>
                    <li><b>$1K</b>/month to keep per 100t</li>
                    <li>Both products and ingredients are stored in storage. You can't store more than the capacity.</li>
                    <ul>
                      <li>The overflow will be simply discarded</li>
                    </ul>
                  </ul>

                  <input type="number" value={this.state.inputNumberStorage}
                    className={(parseInt(this.state.inputNumberStorage, 10) + this.context.storage == this.state.storage) ? "form-control" : "form-control is-invalid"}
                    onChange={(e) => {
                      this.setState({inputNumberStorage: e.target.value});
                      const calculatedStorage = this.context.storage + parseInt(e.target.value, 10);
                      (calculatedStorage % 100 == 0) && (min <= calculatedStorage) && (calculatedStorage <= max) && this.setState({storage: calculatedStorage})
                    }}/>

                  <input
                    type="range" className="custom-range" id="form-range-storage"
                    name="storage" value={this.state.storage}
                    min={min} max={max} step="100"
                    onChange={(e) => {
                      this.setState({
                        storage: e.target.value,
                        cash: this.context.cash - (parseInt(e.target.value, 10) - this.context.storage) / 100,
                        inputNumberStorage: e.target.value - this.context.storage,
                      })
                    }
                    }/>
                  {this.context.storage}t → {this.state.storage}t ({GFG.numberToCurrency(this.storagePrice())})
                  <CurrentStatus
                    month={this.context.month}
                    cash={this.state.cash}
                    debt={this.context.debt}
                    credit={this.context.credit}
                    storage={parseInt(this.state.storage, 10)}
                    ingredient={this.context.ingredient}
                    ingredientSubscription={this.context.ingredientSubscription}
                    product={this.context.product}
                    idleFactory={this.context.idleFactory}
                    factoryNames={this.context.factoryNames}
                    contractNames={this.context.contractNames}
                  />
                </div>
                <div className="modal-footer">
                  <input type="hidden" name="authenticity_token" value={this.context.formAuthenticityToken} />
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
  create_storages_game_url: PropTypes.string,
};
export default ActionMenu
