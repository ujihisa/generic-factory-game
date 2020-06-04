import React, { useState, useContext } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'
import CurrentStatus from '../components/CurrentStatus'

interface Context {
  credit: number;
  cash: number;
  storage: number;
  debt: number;
  ingredient: number;
  ingredientSubscription: number;
  product: number;
  quality: number;
  formAuthenticityToken: string;
}

function Storage(props) {
  const context: Context = useContext(GFG.GameContext);
  const [cash, setCash] = useState<number>(context.cash);
  const [storage, setStorage] = useState<number>(context.storage + 100);
  const [inputNumberStorage, setInputNumberStorage] = useState("100");

  const storagePrice = () =>
    (storage - context.storage) / 100;

  const min = context.storage;
  const max = Math.min(context.storage + context.cash * 100, min + 3000);
  return (
    <React.Fragment>
      {
        (0 < context.cash)
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
      <div className="modal" id="storageModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form action={props.create_storages_game_url} acceptCharset="UTF-8" data-remote="true" method="post">
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

                <input type="number" value={inputNumberStorage}
                  className={(parseInt(inputNumberStorage, 10) + context.storage == storage) ? "form-control" : "form-control is-invalid"}
                  onChange={(e) => {
                    setInputNumberStorage(e.target.value);
                    const calculatedStorage = context.storage + parseInt(e.target.value, 10);
                    (calculatedStorage % 100 == 0) && (min <= calculatedStorage) && (calculatedStorage <= max) && setStorage(calculatedStorage)
                  }}/>

                <input
                  type="range" className="custom-range" id="form-range-storage"
                  name="storage" value={storage}
                  min={min} max={max} step="100"
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setStorage(value)
                    setCash(context.cash - (value - context.storage) / 100)
                    setInputNumberStorage((value - context.storage).toString())
                  }}/>
                {context.storage}t → {storage}t ({GFG.numberToCurrency(storagePrice())})
                <CurrentStatus
                  cash={cash}
                  debt={context.debt}
                  credit={context.credit}
                  storage={storage}
                  ingredient={context.ingredient}
                  ingredientSubscription={context.ingredientSubscription}
                  product={context.product}
                  quality={context.quality}
                  productionVolume={props.productionVolume}
                  productionQuality={props.productionQuality}
                  productRequiredNextMonth={props.productRequiredNextMonth}
                />
              </div>
              <div className="modal-footer">
                <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                {
                  (storagePrice() == 0)
                    ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                    : <input type="submit" value={`Pay ${GFG.numberToCurrency(storagePrice())} to Buy`} className="btn btn-primary" />
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

Storage.propTypes = {
  create_storages_game_url: PropTypes.string,
  productRequiredNextMonth: PropTypes.number,
  productionVolume: PropTypes.number,
  productionQuality: PropTypes.number,
};
export default Storage
