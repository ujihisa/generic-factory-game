import React from "react"
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import GFG from '../gfg'

class ActionMenu extends React.Component {
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

  render () {
    if (this.props.status != 'in_progress')
      return null
    return (
      <React.Fragment>
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

        {
          (10 <= this.state.credit || 0 < this.state.ingredientSubscription)
            ?  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#subscribeIngredientModal">
              📦 Subscribe Ingredient
            </button>
            :  <button type="button" className="btn btn-secondary" title="You need at least 10 credit" disabled>
              📦 Subscribe Ingredient
            </button>
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

ActionMenu.propTypes = {
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
};
export default ActionMenu
