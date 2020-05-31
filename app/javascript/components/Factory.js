import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

const capitalize = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1)

function Factory(props) {
  useEffect(() => {
    $('[data-toggle="tooltip"]').tooltip()
  }, []);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const context = useContext(GFG.GameContext);

  const equipmentsForEstimate = props.allEquipments[selectedEquipment]
    ? [...context.equipments, props.allEquipments[selectedEquipment]]
    : context.equipments;

  const equipmentsForEstimateWithoutDeprecated =
    equipmentsForEstimate.
    filter((eq) => !equipmentsForEstimate.some((e) => e.deprecate.includes(eq.name)));

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

  const sum = GFG.sum;

  const signed = (n) => (n < 0) ? `${n}` : `+${n}`;

  const volumeSubtotalFromAssignmentsSummaryItem = (as) => 
    context.employees[as.name].volume +
      sum(
        equipmentsForEstimateWithoutDeprecated.
        map((eq) => eq.production[as.name]));

  const qualitySubtotalFromAssignmentsSummaryItem = (as) => 
    (0 < as.numRoles.produce)
      ? (
        context.employees[as.name].quality +
        sum(
          equipmentsForEstimateWithoutDeprecated.
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
                              <code>{context.employees[as.name].volume}</code>
                            </td>)
                        }
                      </tr>
                      {
                        equipmentsForEstimate.
                          map((eq) =>
                          <tr key={eq.name}>
                            <th scope="col">
                              <small className="form-text text-muted">
                                {eq.name}
                              </small>
                            </th>
                            {
                              props.assignmentsSummary.map((as) => 
                                equipmentsForEstimate.some((e) => e.deprecate.includes(eq.name))
                                  ? <td key={as.name} scope="col"><del><code>{signed(eq.production[as.name])}</code></del></td>
                                  : <td key={as.name} scope="col"><code>{signed(eq.production[as.name])}</code></td>)
                            }
                          </tr>)
                      }
                      <tr>
                        <th scope="col">Subtotal</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              <code>{signed(volumeSubtotalFromAssignmentsSummaryItem(as))}</code>
                            </td>)
                        }
                      </tr>
                      <tr>
                        <th scope="col">Total</th>
                        <td scope="col" colSpan={props.assignmentsSummary.length}>
                          <code>
                            {
                              props.assignmentsSummary.map((as) =>
                                `(${as.numRoles.produce} * ${volumeSubtotalFromAssignmentsSummaryItem(as)})`
                              ).join(' + ')
                            }
                            &nbsp;=&nbsp;
                            <strong>
                              {
                                sum(props.assignmentsSummary.map((as) => as.numRoles.produce * volumeSubtotalFromAssignmentsSummaryItem(as)))
                              }
                            </strong>
                          </code>
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
                              <code>{context.employees[as.name].quality}</code>
                            </td>)
                        }
                      </tr>
                      {
                        equipmentsForEstimate.
                          map((eq) =>
                          <tr key={eq.name}>
                            <th scope="col">
                              <small className="form-text text-muted">
                                {eq.name}
                              </small>
                            </th>
                            {
                              props.assignmentsSummary.map((as) => 
                                equipmentsForEstimate.some((e) => e.deprecate.includes(eq.name))
                                  ? <td key={as.name} scope="col"><del><code>{signed(eq.quality[as.name])}</code></del></td>
                                  : <td key={as.name} scope="col"><code>{signed(eq.quality[as.name])}</code></td>)
                            }
                          </tr>)
                      }
                      <tr>
                        <th scope="col">Subtotal</th>
                        {
                          props.assignmentsSummary.map((as) => 
                            <td key={as.name} scope="col">
                              <code>{qualitySubtotalFromAssignmentsSummaryItem(as)}</code>
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
                          <code>
                            {
                              (
                                sum(props.assignmentsSummary.map((as) =>
                                  qualitySubtotalFromAssignmentsSummaryItem(as) * as.numRoles.produce * volumeSubtotalFromAssignmentsSummaryItem(as)
                                )) / sum(props.assignmentsSummary.map((as) => as.numRoles.produce * volumeSubtotalFromAssignmentsSummaryItem(as)))
                              ) || 0
                            }
                          </code>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <strong>Monthly fee</strong>
                  <p>
                    <code>
                      {
                        equipmentsForEstimateWithoutDeprecated.map((e) => e.cost).join(" + ")
                      }
                      &nbsp;=&nbsp;
                      {
                        GFG.numberToCurrency(sum(equipmentsForEstimateWithoutDeprecated.map((e) => e.cost)))
                      }
                    </code>
                  </p>

                  {
                    selectedEquipment &&
                      <img src={`/images/${props.allEquipments[selectedEquipment].image.src}`} />
                  }
                </div>
                <div className="col">
                  <h6>
                    <>Assign </>
                    <u href="#" data-toggle="tooltip" title="Each employees have their own tasks to be assigned.
                      See Hiring page's glossary for the details.">
                    tasks
                    </u>
                  </h6>
                  <form action={props.factory_assign_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
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
                      <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                      <input type="hidden" name="num_role_diffs_json" value={JSON.stringify(numRoleDiffs)} />
                      <input type="submit" value="Assign" className="btn btn-primary" disabled={assignmentValid ? "" : "disabled"} />
                    </div>
                  </form>

                  <h6>
                    <>Buy&install an </>
                    <u href="#" data-toggle="tooltip" title="You can add these equipments into your factory to increase
                      your employees' production volumes and/or qualities.
                      An equipment effects permanently until you buy an upgraded version of the same kind (see deprecates signs below).">
                      equipment
                    </u>
                  </h6>

                  <form action={props.factory_buyinstall_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
                    <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                    {
                      Object.values(props.allEquipments).map((equipment, i) =>
                        <div className="border-top form-check" key={equipment.name} >
                          <input className="form-check-input" type="radio" name="equipmentRadios" id={`equipmentRadios${i}`} value={equipment.name}
                            checked={selectedEquipment == equipment.name} onChange={(_) => 0}
                            onClick={(e) =>
                                (selectedEquipment == equipment.name) ?
                                  setSelectedEquipment(null) :
                                  setSelectedEquipment(equipment.name)
                            }
                            disabled={
                              (context.equipments.some((e) => e.name == equipment.name || e.deprecate.includes(equipment.name)))
                                ? "disabled"
                                : ""
                            } />
                          <label className="form-check-label" htmlFor={`equipmentRadios${i}`}>
                            <strong>{equipment.name} </strong>
                            {
                              (context.equipments.some((e) => e.deprecate.includes(equipment.name)) )
                                ? <span className="badge badge-secondary">deprecated</span>
                                : (context.equipments.some((e) => e.name == equipment.name)) 
                                  ? <>
                                    <span className="badge badge-secondary">installed</span>
                                    <small className="text-muted">({GFG.numberToCurrency(equipment.cost)}/m)</small>
                                  </>
                                    : (context.cash < equipment.install)
                                      ? <span className="badge badge-warning">
                                        {GFG.numberToCurrency(equipment.install)}, {GFG.numberToCurrency(equipment.cost)}/m
                                      </span>
                                      : <span className="badge badge-primary">
                                        {GFG.numberToCurrency(equipment.install)}, {GFG.numberToCurrency(equipment.cost)}/m
                                      </span>
                            }
                          </label>

                          {
                            (context.equipments.some((e) => e.deprecate.includes(equipment.name)))
                              ? ""
                              : <>
                                {
                                  equipment.deprecate.length
                                    ? <small className="form-text text-muted">
                                      <u href="#" data-toggle="tooltip" title=""
                                        data-original-title="It cancels the effects and the monthly cost of specified equipment(s)">
                                        Deprecates
                                      </u> {equipment.deprecate.join(", ")}
                                    </small>
                                    : ""
                                }
                                <p>{ equipment.description }</p>
                              </>
                          }
                        </div>)
                    }

                    <div className="modal-footer">
                      {
                        (selectedEquipment && context.cash < props.allEquipments[selectedEquipment].install)
                          ? <input type="submit" value="Not enough cash" className="btn btn-primary" disabled />
                          : selectedEquipment
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
