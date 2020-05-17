import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

const capitalize = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1)

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

  const sum = (xs) => xs.reduce((a, b) => a + b, 0);
  const volumeSubtotalFromAssignmentsSummaryItem = (as) => 
    as.numRoles.produce *
      (
        context.employees[as.name].volume +
        sum(
          [...context.equipments, props.allEquipments[selectedEquipment]].
          filter((eq) => eq).
          map((eq) => eq.production[as.name])));

  const qualitySubtotalFromAssignmentsSummaryItem = (as) => 
    (0 < as.numRoles.produce)
      ? (
        context.employees[as.name].quality +
        sum(
          [...context.equipments, props.allEquipments[selectedEquipment]].
          filter((eq) => eq).
          map((eq) => eq.quality[as.name])))
    : 0;

  const [numRoleDiffs, setNumRoleDiffs] =
    useState(props.assignmentsSummary.reduce((o, a) =>
      ({
        ...o,
        [a.name]: Object.keys(a.numRoles).reduce((o, r) => ({
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
                <div className="col-7">
                  <table className="table table-hover table-sm">
                    <caption>Production Volume (t)</caption>
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <th key={as.name} scope="col">
                              {as.numRoles.produce} { as.name }
                            </th>)
                        }
                      </tr>
                    </thead>
                    <tbody className="table">
                      <tr>
                        <th scope="col">Base</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              {context.employees[as.name].volume}
                            </td>)
                        }
                      </tr>
                      {
                        [...context.equipments, props.allEquipments[selectedEquipment]].
                          filter((eq) => eq && eq.name != "Factory base").
                          map((eq) =>
                          <tr key={eq.name}>
                            <th scope="col">{eq.name}</th>
                            {
                              props.assignmentsSummary.map((as) => 
                                <td key={as.name} scope="col">{as.numRoles.produce} * {eq.production[as.name]}</td>)
                            }
                          </tr>)
                      }
                      <tr>
                        <th scope="col">Subtotal</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              {volumeSubtotalFromAssignmentsSummaryItem(as)}
                            </td>)
                        }
                      </tr>
                      <tr>
                        <th scope="col">Total</th>
                        <td scope="col" colSpan={props.assignmentsSummary.length}>
                          {
                            sum(props.assignmentsSummary.map(volumeSubtotalFromAssignmentsSummaryItem))
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <table className="table table-hover table-sm">
                    <caption>Production Quality</caption>
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <th key={as.name} scope="col">
                              {as.numRoles.produce} { as.name }
                            </th>)
                        }
                      </tr>
                    </thead>
                    <tbody className="table">
                      <tr>
                        <th scope="col">Base</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              {context.employees[as.name].quality}
                            </td>)
                        }
                      </tr>
                      {
                        [...context.equipments, props.allEquipments[selectedEquipment]].
                          filter((eq) => eq && eq.name != "Factory base").
                          map((eq) =>
                          <tr key={eq.name}>
                            <th scope="col">{eq.name}</th>
                            {
                              props.assignmentsSummary.map((as) => 
                                <td key={as.name} scope="col">{as.numRoles.produce} * {eq.quality[as.name]}</td>)
                            }
                          </tr>)
                      }
                      <tr>
                        <th scope="col">Subtotal</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              {qualitySubtotalFromAssignmentsSummaryItem(as)}
                            </td>)
                        }
                      </tr>
                      <tr>
                        <th scope="col">Mentor</th>
                        <td scope="col" colSpan={props.assignmentsSummary.length}>(client-side calculation not implemented yet)</td>
                      </tr>
                      <tr>
                        <th scope="col">Total</th>
                        <td scope="col" colSpan={props.assignmentsSummary.length}>
                          {
                            (
                              sum(props.assignmentsSummary.map((as) =>
                                qualitySubtotalFromAssignmentsSummaryItem(as) * volumeSubtotalFromAssignmentsSummaryItem(as)
                              )) / sum(props.assignmentsSummary.map(volumeSubtotalFromAssignmentsSummaryItem))
                            ) || 0
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col">
                  <h6>Assign tasks</h6>
                  <table className="table table-hover table-sm">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        {
                          Object.keys(props.assignmentsSummary[0].numRoles).map((roleName) =>
                            <th scope="col" key={roleName}>{capitalize(roleName)}</th>)
                        }
                      </tr>
                    </thead>
                    <tbody className="table">
                      {
                        props.assignmentsSummary.map((assignment) => {
                          const outerValid =
                            sum(Object.values(numRoleDiffs[assignment.name]).map((n) => parseInt(n) || 0)) == 0;

                          return <tr key={assignment.name}>
                            <th scope="col">{assignment.name}</th>
                            {
                              Object.entries(assignment.numRoles).map(([roleName, roleNum]) => {
                                const innerValid =
                                  (0 <= roleNum + parseInt(numRoleDiffs[assignment.name][roleName], 10));

                                if (!outerValid || !innerValid)
                                  assignmentValid = false

                                return (
                                  <td scope="col" key={roleName}>
                                    <div className="input-group">
                                      {
                                        (roleName == "produce")
                                          ? <>{roleNum} + {numRoleDiffs[assignment.name][roleName]}</>
                                          : <>
                                            <div className="input-group-prepend">
                                              <span className="input-group-text">{roleNum} +</span>
                                            </div>
                                            <input type="number" className="form-control" required
                                              min={-roleNum}
                                              max={sum(Object.values(assignment.numRoles)) - roleNum}
                                              value={numRoleDiffs[assignment.name][roleName]} onChange={(e) => {
                                                setNumRoleDiffs({
                                                  ...numRoleDiffs,
                                                  [assignment.name]: {
                                                    ...numRoleDiffs[assignment.name],
                                                    [roleName]: e.target.value,
                                                    produce: -parseInt(e.target.value, 10),
                                                  }
                                                });
                                              }} />
                                          </>
                                      }
                                    </div>
                                  </td>
                                );
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
                        <div className="form-check" key={equipment.name} >
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
                            { (context.equipments.some((e) => e.name == equipment.name)) && " ✔️" }
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
