import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import ActionMenu from "./ActionMenu"
import GFG from '../gfg'

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
    if (this.props.status != 'in_progress')
      return null
    return (
      <React.Fragment>
        <ActionMenu
          parent={this.props}
          cash={this.state.cash}
          storage={this.state.storage}
          formAuthenticityToken={this.props.formAuthenticityToken}
          create_storages_game_url={this.props.create_storages_game_url} />
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
          (10 <= this.state.credit || 0 < this.state.ingredientSubscription)
            ?  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#subscribeIngredientModal">
              📦 Subscribe Ingredient
            </button>
            : <span className="d-inline-block" data-toggle="popover"
              title="Feature locked"
              data-content="You need at least 10 credit" >
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
          <small>
            Estimated new cash: <b>{ GFG.numberToCurrency(this.props.estimate_cash) }</b>
          </small>
          <br/>
          {
            (this.props.estimate_status == 'game_over') &&
              <div className="alert alert-danger" role="alert">
                Your cash will run out! Try borrowing some cash to survive.
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
  estimate_cash: PropTypes.number,
  create_storages_game_url: PropTypes.string,
  month: PropTypes.number,
  ingredient: PropTypes.number,
  product: PropTypes.number,
  idleFactory: PropTypes.object,
  factoryNames: PropTypes.array,
  contractNames: PropTypes.array,
};
export default GamePane
