import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Hiring(props) {
  const context = useContext(GFG.GameContext);

  // like {Junior: 0, Intermediate: 0, Senior: 0, ...}
  const [numEmployees, setNumEmployees] = useState(Object.fromEntries(Object.keys(context.employeeGroups).map((k) => [k, 0])));

  const modalTable =
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col"><small>Recruiting</small> fee</th>
          <th scope="col"><small>Monthly</small> salary</th>
          <th scope="col"><small>Base production</small> volume</th>
          <th scope="col"><small>Base production</small> quality</th>
          <th scope="col">#</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.entries(context.employeeGroups).map(([name, employee]) =>
            <tr key={name}>
              <th scope="row"><img src={`/images/${employee.image}`} style={{height: "1.5em"}} />&nbsp;{name}</th>
              <td>{GFG.numberToCurrency(employee.recruiting_fee)}</td>
              <td>{GFG.numberToCurrency(employee.salary)}</td>
              <td>{employee.volume}</td>
              <td>{employee.quality}</td>
              <td>
                {
                  employee.required_credit <= context.credit
                    ? (<div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">{employee.num_hired} +</span>
                      </div>
                      <input type="number" className="form-control" value={numEmployees[name]} aria-label="Username" aria-describedby="basic-addon1"
                         onChange={(e) => setNumEmployees(
                          {
                            ...numEmployees,
                            [name]: e.target.value && Math.max(0, e.target.value),
                          }
                        )} />
                    </div>)
                    : <>At least <b>{employee.required_credit}</b> credit required to recruit</>
                }
              </td>
            </tr>)
        }
      </tbody>
    </table>;

  const totalRecruitingFee = Object.entries(numEmployees).map(([name, num]) =>
    context.employees[name].recruiting_fee * num
  ).reduce((a, b) => a + b);
  const totalSalary = Object.entries(numEmployees).map(([name, num]) =>
    context.employees[name].salary * num
  ).reduce((a, b) => a + b);
  const totalNumber = Object.values(numEmployees).map((x) => parseInt(x, 10) || 0).reduce((a, b) => a + b);

  const modalSubmit =
    (context.cash < totalRecruitingFee)
    ? <input type="submit" value="Not enough cash" className="btn btn-primary" disabled />
    : (totalRecruitingFee == 0)
    ? <input type="submit" value="Cancel" className="btn btn-primary" disabled />
    : <input type="submit" value={`Pay ${GFG.numberToCurrency(totalRecruitingFee)} to hire ${totalNumber} employees`} className="btn btn-primary" />

  return (<>
    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#hiringModal">
      💼 Hiring
    </button>
    <div className="modal" id="hiringModal" tabIndex="-1" role="dialog" aria-labelledby="hiringModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <form action={props.hire_game_path} acceptCharset="UTF-8" data-remote="true" method="post">
            <div className="modal-header">
              <h5 className="modal-title" id="contractModalLabel">💼 Hiring</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{overflowX: "auto"}}>
              { modalTable }
              <div className="modal-footer" style={{overflowX: "auto"}}>
                <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                <input type="hidden" name="num_employees_json" value={JSON.stringify(numEmployees)} />
                { modalSubmit }
              </div>
              <hr/>

              <details>
                <summary>Glossary</summary>
                <dl>
                  <dt>Junior (workers)</dt>
                  <dd>Have few factory experience. Without others' help they can't work efficiently. In this game juniors are always juniors; they don't grow.</dd>

                  <dt>Intermediate (workers)</dt>
                  <dd>Have some factory experiences. Same as juniors, intermediates don't grow.</dd>

                  <dt>Senior (workers)</dt>
                  <dd>Have a lot of experiences, but require farely expensive salary.</dd>

                  <dt>Motivated intermediate / Passionated senior (workers)</dt>
                  <dd>Exactly same as intermediates/seniors but they love working at a higher class company rather than just for money</dd>

                  <dt>Production volume (t)</dt>
                  <dd>Indicated how much this employee consumes ingredients and produces productions, assuming you have "Factory base"</dd>

                  <dt>Production quality</dt>
                  <dd>Helps getting more credit by selling high quality products to your customers. The product quality is calculated by the average of your employees production quality, weighted by each production volumes.</dd>

                  <dt>Produce (role)</dt>
                  <dd>The default role for newly hired employees.</dd>

                  <dt>Mentor (role)</dt>
                  <dd>Stops production and increase 3 other employees production qualities up to same as the mentor.</dd>

                  <dt>Factory equipments</dt>
                  <dd>Enhances all your employees production and quality (see details at Equipment menu.) e.g. "Conveyor".</dd>

                  <dt>Layoff</dt>
                  <dd>Not implemented yet.</dd>
                </dl>
              </details>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>);
};

export default Hiring;
