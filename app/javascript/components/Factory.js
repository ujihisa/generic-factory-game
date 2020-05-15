import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Factory(props) {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const context = useContext(GFG.GameContext);
  /*
  const assignmentsSummary = [
    {
      name: 'Junior',
      numRoles: {
        produce: 6,
        mentor: 0,
      },
    }
  ]
  */

  const roleNames = ['produce', 'mentor']

  const [numRoleDiffs, setNumRoleDiffs] =
    useState(props.assignmentsSummary.reduce((o, d) =>
      ({
        ...o,
        [d.name]: roleNames.reduce((o, r) => ({
          ...o,
          [r]: 0,
        }), {}),
      }), {}));

  var assignmentValid = true;

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
                  <h6>Assign roles</h6>
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
                        props.assignmentsSummary.map((assignment) => {
                          const outerValid =
                            (Object.values(numRoleDiffs[assignment.name]).map((n) => parseInt(n) || 0).reduce((a, b) => a + b) == 0);

                          return <tr key={assignment.name}>
                            <th scope="col">{assignment.name}</th>
                            {
                              roleNames.map((roleName) => {
                                const innerValid =
                                  (0 <= assignment.numRoles[roleName] + parseInt(numRoleDiffs[assignment.name][roleName], 10));

                                if (!outerValid || !innerValid)
                                  assignmentValid = false

                                return <td scope="col" key={roleName}>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">{assignment.numRoles[roleName]} +</span>
                                    </div>
                                    <input type="number" className={`form-control ${(outerValid && innerValid) ? "" : "is-invalid"}`} required
                                      value={numRoleDiffs[assignment.name][roleName]} onChange={(e) => {
                                        setNumRoleDiffs({
                                          ...numRoleDiffs,
                                          [assignment.name]: {
                                            ...numRoleDiffs[assignment.name],
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
                    <form action={props.factory_assign_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
                      <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                      <input type="hidden" name="num_role_diffs_json" value={JSON.stringify(numRoleDiffs)} />
                      <input type="submit" value="Assign" className="btn btn-primary" disabled={assignmentValid ? "" : "disabled"} />
                    </form>
                  </div>

                  <h6>Buy&install an equipment</h6>
                  <p>You can add these equipments into your factory to increase your employees' production volume and quality.
                  These equipments themselves do not require any running fees, but effect permanently.</p>


                  <form action={props.factory_buyinstall_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
                    <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                    {
                      Object.values(props.allEquipments).map((equipment, i) =>
                        <div className="form-check" key={equipment.name}>
                          <input className="form-check-input" type="radio" name="equipmentRadios" id={`equipmentRadios${i}`} value={equipment.name}
                            selected={selectedEquipment == equipment.name} onChange={(e) => setSelectedEquipment(e.target.value)}
                            disabled={
                              (context.cash < equipment.install)
                                ? "disabled"
                                : (context.equipments.some((e) => e.name == equipment.name))
                                  ? "disabled"
                                  : ""
                            } />
                          <label className="form-check-label" htmlFor={`equipmentRadios${i}`}>
                            {equipment.name} ({GFG.numberToCurrency(equipment.install)}, {GFG.numberToCurrency(equipment.cost)}/m)
                          </label>
                          <small className="form-text text-muted">
                            {equipment.description}
                          </small>
                        </div>)
                    }

                    <div className="modal-footer">
                      {
                        selectedEquipment
                          ? <input type="submit" value={`Buy&install ${selectedEquipment}`} className="btn btn-primary" />
                          : <input type="submit" value="Select what to buy&install" className="btn btn-primary" disabled />
                      }
                    </div>
                  </form>
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
