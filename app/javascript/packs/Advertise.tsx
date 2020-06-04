import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Advertise(props) {
  const context: any = useContext(GFG.GameContext);

  return (<>
    {
      (10 <= context.credit)
        ?  <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#advertiseModal">
          📰 Advertise
        </button>
        : <span className="d-inline-block" data-toggle="popover"
          title="Feature locked"
          data-content="You need at least 10 credit" >
          <button type="button" className="btn btn-secondary" data-toggle="popover" disabled style={{pointerEvents: "none"}}>
            📰 Advertise
          </button>
        </span>
    }
    <div className="modal" id="advertiseModal" tabIndex={-1} role="dialog" aria-labelledby="advertiseModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contractModalLabel">📰 Advertise</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{overflowX: "auto"}}>
            <ul>
              <li>You need at least 5 credit</li>
              <li>Cost: $80K</li>
              <li>You get +10 credit in the next month</li>
              <li>You can only advertise once a month</li>
            </ul>
          </div>
          <div className="modal-footer">
            <form action={props.advertise_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
              {
                80 <= context.cash
                  ? <input type="submit" value="Pay $80K to advertise" className="btn btn-primary" />
                  : <input type="submit" value="Not enough cash" className="btn btn-primary" disabled />
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default Advertise;
