import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types"
import Bank from "./Bank"
import SubscribeIngredient from "./SubscribeIngredient"
import Storage from "./Storage"
import GFG from '../gfg'
import CurrentStatus from './CurrentStatus'
import Contracts from './Contracts'
import BuyIngredient from './BuyIngredient'
import Hiring from './Hiring'
import Factory from './Factory'
import Advertise from './Advertise'

function GamePane(props) {
  useEffect(() => {
    $(document.body).keydown((e) => {
      if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
        if (e.key == "s")
          $('#storageModal').modal('show')
        else if (e.key == "b")
          $('#buyIngredientModal').modal('show')
        else if (e.key == "h")
          $('#hiringModal').modal('show')
        else if (e.key == "c")
          $('#contractsModal').modal('show')
        else if (e.key == "f")
          $('#factoryModal').modal('show')
        else if (e.key == "a" && 10 <= context.credit)
          $('#advertiseModal').modal('show')
      }
    })

    $('[data-toggle="popover"]').popover()

    if (props.alert) {
      $('#noticeModal').modal('show')
      $('#noticeModaldalOk').trigger('focus')
    }
  })

  const noticeModal = props.alert &&
    <div className="modal" id="noticeModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <small className="text-muted">{props.notice}</small>
            {props.alert.split("\n").map((s, idx) => <p key={idx}>{s}</p>)}
          </div>
          <div className="modal-footer">
            <button type="button" id="noticeModaldalOk" className="btn" data-dismiss="modal" autoFocus>Ok</button>
          </div>
        </div>
      </div>
    </div>;

  $('.example-popover').popover({
    container: 'body'
  })
  const actions =
    (props.status != 'in_progress')
    ? null
    : (
      <React.Fragment>
        { noticeModal }
        <GFG.GameContext.Provider value={{
          signedContracts: props.signedContracts,
          credit: props.credit,
          cash: props.cash,
          storage: props.storage,
          formAuthenticityToken: props.formAuthenticityToken,
          month: props.month,
          debt: props.debt,
          ingredient: props.ingredient,
          product: props.product,
          quality: props.quality,
          ingredientSubscription: props.ingredientSubscription,
          equipments: props.equipments,
          employees: props.employees,
          employeeGroups: props.employeeGroups,
        }}>
          <Storage
            productionVolume={props.productionVolume}
            productionQuality={props.productionQuality}
            create_storages_game_url={props.create_storages_game_url} />

          <BuyIngredient 
            ingredient={props.ingredient}
            product={props.product}
            buy_ingredients_game_url={props.buy_ingredients_game_url}
          />
          <br/><br/>

          <Hiring hire_game_path={props.hire_game_path} />
          <br/><br/>

          <Factory
            assignmentsSummary={props.assignmentsSummary}
            factory_assign_game_path={props.factory_assign_game_path}
            factory_buyinstall_game_path={props.factory_buyinstall_game_path}
            allEquipments={props.allEquipments} />
        <br/><br/>

        <Contracts contractDump={props.contractDump} createContractUrl={props.createContractUrl} cancelContractUrl={props.cancelContractUrl} />

        {
          (0 < props.credit || 0 < props.debt)
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
              <form action={props.action} acceptCharset="UTF-8" data-remote="true" method="post">
                <input type="hidden" name="authenticity_token" value={props.formAuthenticityToken} />
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">🏦 Bank</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <GFG.GameContext.Provider value={props}>
                  <Bank />
                </GFG.GameContext.Provider>
              </form>
            </div>
          </div>
        </div>

        <br/><br/>

        {
          (20 <= props.credit || 0 < props.ingredientSubscription)
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
              <form action={props.subscribe_ingredients_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">📦 Subscribe Ingredient</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <SubscribeIngredient cash={props.cash} ingredientSubscription={props.ingredientSubscription} storage={props.storage} />
              </form>
            </div>
          </div>
        </div>

        <br/><br/>
        <Advertise advertise_game_path={props.advertise_game_path} />

        <form action={props.end_month_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
          <br/>
          {
            (props.estimate_status == 'game_over') &&
              <div className="alert alert-danger" role="alert">
                Are you sure? {(props.debt < props.credit * 10) ? "Try borrowing more cash" : "Find what you can do to survive!"}
              </div>
          }
          <input type="submit" name="commit" value="End month"  data-disable-with="End month"
            className={`btn btn-lg ${
          {in_progress: 'btn-primary', game_over: 'btn-danger', completed: 'btn-success'}[props.estimate_status]
        }`} />
          <small className="form-text text-muted">
            You employees work to produce product, and you deliver the accumulated product to your customers until they're satisfied.
          </small>
        </form>
        </GFG.GameContext.Provider>

      </React.Fragment>
    );

  return (
    <GFG.GameContext.Provider value={{
      signedContracts: props.signedContracts,
      equipments: props.equipments,
      month: props.month,
    }}>
      <div className="row">
        <div className="col-md-5 themed-grid-col">
          <h2>Actions</h2>
          {actions}
        </div>
        <div className="col-md-6 themed-grid-col">
          <h2>Current status</h2>
          <CurrentStatus
            cash={props.cash}
            debt={props.debt}
            credit={props.credit}
            storage={props.storage}
            ingredient={props.ingredient}
            ingredientSubscription={props.ingredientSubscription}
            product={props.product}
            quality={props.quality}
            productionVolume={props.productionVolume}
            productionQuality={props.productionQuality}
            productRequiredNextMonth={props.productRequiredNextMonth}
          />
        </div>
      </div>
    </GFG.GameContext.Provider>
  );
}

GamePane.propTypes = {
  status: PropTypes.string,
  month: PropTypes.number,
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
  ingredient: PropTypes.number,
  product: PropTypes.number,
  quality: PropTypes.number,
  createContractUrl: PropTypes.string,
  cancelContractUrl: PropTypes.string,
  contractDump: PropTypes.object,
  signedContracts: PropTypes.object,
  notice: PropTypes.string,
  productionVolume: PropTypes.number,
  productionQuality: PropTypes.number,
  equipments: PropTypes.array,
  employees: PropTypes.object,
  employeeGroups: PropTypes.object,
  productRequiredNextMonth: PropTypes.number,
  factory_buyinstall_game_path: PropTypes.string,
  advertise_game_path:PropTypes.string, 
  assignmentsSummary: PropTypes.array,
};
export default GamePane
