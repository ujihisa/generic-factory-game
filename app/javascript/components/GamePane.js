import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import ActionMenu from "./ActionMenu"
import GFG from '../gfg'
import CurrentStatus from './CurrentStatus'

class GamePane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debt: props.debt,
      credit: props.credit,
      cash: props.cash,
      storage: props.storage,
      ingredientSubscription: props.ingredientSubscription,
      subscribe_ingredients_game_url: props.subscribe_ingredients_game_url,
    };
  }

  componentDidMount() {
    $('[data-toggle="popover"]').popover()
  }

  render () {
    $('.example-popover').popover({
      container: 'body'
    })
    const actions =
    (this.props.status != 'in_progress')
      ? null
      :
      (
        <React.Fragment>
          <ActionMenu
            parent={this.props}
            cash={this.state.cash}
            storage={this.state.storage}
            formAuthenticityToken={this.props.formAuthenticityToken}
            create_storages_game_url={this.props.create_storages_game_url} />

          <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#buyIngredientModal">
            📦 Buy Ingredient
          </button>
          <br/><br/>

          🏭 <a href={this.props.new_game_factory_path}>Build a Factory</a> (工場建設)
          <br/><br/>

          💼 <a href={this.props.new_employee_game_path}>Hire an employee</a> (従業員新規雇用)
          <br/><br/>

          ➡️ <a href={this.props.new_dispatch_game_path}>Dispatch an employee</a> (従業員の割当)
          <br/><br/>

          📜 <a href={this.props.new_game_contract_path}>Make a contract</a> (新規契約を結ぶ)
          <br/><br/>

          {
            (0 < this.state.credit || 0 < this.state.debt)
              ? <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModal">
                🏦 Bank
              </button>
              : <span className="d-inline-block" data-toggle="popover"
                title="Feature locked"
                data-content="You need at least 1 credit" >
                <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
                  🏦 Bank
                </button>
              </span>
          }

          <div className="modal" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <form action={this.props.action} acceptCharset="UTF-8" data-remote="true" method="post">
                  <input type="hidden" name="authenticity_token" value={this.props.formAuthenticityToken} />
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

          {
            (20 <= this.state.credit || 0 < this.state.ingredientSubscription)
              ?  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#subscribeIngredientModal">
                📦 Subscribe Ingredient
              </button>
              : <span className="d-inline-block" data-toggle="popover"
                title="Feature locked"
                data-content="You need at least 20 credit" >
                <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
                  📦 Subscribe Ingredient
                </button>
              </span>
          }

          <div className="modal" id="subscribeIngredientModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <form action={this.props.subscribe_ingredients_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">📦 Subscribe Ingredient</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <SubscribeIngredient cash={this.state.cash} ingredientSubscription={this.state.ingredientSubscription} storage={this.state.storage} />
                </form>
              </div>
            </div>
          </div>

          <br/><br/>

          <form action={this.props.end_month_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
            <br/>
            {
              (this.props.estimate_status == 'game_over') &&
                <div className="alert alert-danger" role="alert">
                  Are you sure? {(this.props.debt < this.props.credit * 10) ? "Try borrowing more cash" : "Find what you can do to survive!"}
                </div>
            }
            <input type="submit" name="commit" value="End month"  data-disable-with="End month"
              className={`btn btn-lg ${
            {in_progress: 'btn-primary', game_over: 'btn-danger', completed: 'btn-success'}[this.props.estimate_status]
          }`} />
            <small className="form-text text-muted">
              You employees work to produce product, and you deliver the accumulated product to your customers until they're satisfied.
            </small>
          </form>

        </React.Fragment>
      );
    return (
      <div className="row">
        <div className="col-md-5 themed-grid-col">
          <h2>Actions</h2>
          {actions}
        </div>
        <div className="col-md-6 themed-grid-col">
          <h2>Current status</h2>
          <CurrentStatus
            month={this.props.month}
            cash={this.props.cash}
            debt={this.props.debt}
            credit={this.props.credit}
            storage={this.props.storage}
            ingredient={this.props.ingredient}
            ingredientSubscription={this.props.ingredientSubscription}
            product={this.props.product}
            idleFactory={this.props.idleFactory}
            factoryNames={this.props.factoryNames}
            contractNames={this.props.contractNames}
          />
        </div>
      </div>
    );
  }
}

GamePane.propTypes = {
  status: PropTypes.string,
  cash: PropTypes.number,
  debt: PropTypes.number,
  credit: PropTypes.number,
  storage: PropTypes.number,
  ingredientSubscription: PropTypes.number,
  action: PropTypes.string,
  formAuthenticityToken: PropTypes.string,
  subscribe_ingredients_game_url: PropTypes.string,
  end_month_game_url: PropTypes.string,
  create_storages_game_url: PropTypes.string,
  month: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number,
  idleFactory: PropTypes.object,
  factoryNames: PropTypes.array,
  contractNames: PropTypes.array,
};
export default GamePane
