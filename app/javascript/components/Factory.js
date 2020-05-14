import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Factory(props) {
  const context = useContext(GFG.GameContext);
  const dispatches = [
    {
      name: 'Junior',
      numRoles: {
        produce: 6,
        mentor: 0,
      },
    }
  ]

  const roleNames = ['produce', 'mentor']

  const [numRoleDiffs, setNumRoleDiffs] =
    useState(dispatches.reduce((o, d) =>
      ({
        ...o,
        [d.name]: roleNames.reduce((o, r) => ({
          ...o,
          [r]: 0,
        }), {}),
      }), {}));

  var dispatchValid = true;

  return (<>
    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#factoryModal">
      🏭 Factory
    </button>
    <div className="modal" id="factoryModal" tabIndex="-1" role="dialog" aria-labelledby="factoryModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contractModalLabel">🏭 Factory</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{overflowX: "auto"}}>
            <div className="container">
              <div className="row">
                <div className="col-8">
                  <table className="table table-hover table-sm">
                    <caption>Production Volume (t)</caption>
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">2 Junior</th>
                        <th scope="col">2 Intermediate</th>
                        <th scope="col">2 Senior</th>
                        <th scope="col">1 Chief</th>
                      </tr>
                    </thead>
                    <tbody className="table">
                      <tr>
                        <th scope="col">Base</th>
                        <td scope="col">20</td>
                      </tr>
                      <tr>
                        <th scope="col">Conveyor</th>
                        <td scope="col">+20</td>
                      </tr>
                      <tr>
                        <th scope="col">Mentored</th>
                        <td scope="col">+40</td>
                      </tr>
                      <tr>
                        <th scope="col">Subtotal</th>
                        <td scope="col">40</td>
                      </tr>
                      <tr>
                        <th scope="col">Total</th>
                        <td scope="col">40</td>
                      </tr>
                    </tbody>
                  </table>

                  <h6>Production Quality</h6>
                  INSERT TABLE HERE
                </div>
                <div className="col">
                  <h6>Dispatch roles</h6>
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Produce</th>
                        <th scope="col">Mentor</th>
                      </tr>
                    </thead>
                    <tbody className="table">
                      {
                        dispatches.map((dispatch) => {
                          const outerValid =
                            (Object.values(numRoleDiffs[dispatch.name]).map((n) => parseInt(n) || 0).reduce((a, b) => a + b) == 0);

                          return <tr key={dispatch.name}>
                            <th scope="col">{dispatch.name}</th>
                            {
                              roleNames.map((roleName) => {
                                const innerValid =
                                  (0 <= dispatch.numRoles[roleName] + parseInt(numRoleDiffs[dispatch.name][roleName], 10));

                                if (!outerValid || !innerValid)
                                  dispatchValid = false

                                return <td scope="col" key={roleName}>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">{dispatch.numRoles[roleName]} +</span>
                                    </div>
                                    <input type="number" className={`form-control ${(outerValid && innerValid) ? "" : "is-invalid"}`} required
                                      value={numRoleDiffs[dispatch.name][roleName]} onChange={(e) => {
                                        setNumRoleDiffs({
                                          ...numRoleDiffs,
                                          [dispatch.name]: {
                                            ...numRoleDiffs[dispatch.name],
                                            [roleName]: e.target.value,
                                          }
                                        });
                                      }} />
                                  </div>
                                </td>;
                              })
                            }
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                  
                  <div className="modal-footer">
                    <form action={props.factory_dispatch_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
                      <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                      <input type="hidden" name="num_role_diffs_json" value={JSON.stringify(numRoleDiffs)} />
                      <input type="submit" value="Dispatch" className="btn btn-primary" disabled={dispatchValid ? "" : "disabled"} />
                    </form>
                  </div>

                  <h6>Buy an equipment</h6>
                  <p>You can add these equipments into your factory to increase your employees' production volume and quality.
                  These equipments themselves do not require any running fees, but effect permanently.</p>

                  <select className="custom-select">
                    <option>Open this select menu</option>
                    <option>Workbenches ($10K)</option>
                  </select>
                  <dl>
                    <dt>Workbenches</dt>
                    <dd>blah blah</dd>
                  </dl>

                  <div className="modal-footer">
                    <input type="submit" value="Buy" className="btn btn-primary" disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default Factory;
