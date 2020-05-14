import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Hiring(props) {
  const context = useContext(GFG.GameContext);
  const [numEmployees, setNumEmployees] = useState({Junior: 0, Intermediate: 0, Senior: 0});

  useEffect(() => {
    $('#hiringModal').modal('show');
  });

  const modalTable =
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col"><small>Recruiting</small> fee</th>
          <th scope="col"><small>Monthly</small> salary</th>
          <th scope="col"><small>Production</small> volume</th>
          <th scope="col"><small>Production</small> quality</th>
          <th scope="col">#</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.entries(props.employees).map(([name, employee]) =>
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
    props.employees[name].recruiting_fee * num
  ).reduce((a, b) => a + b);
  const totalSalary = Object.entries(numEmployees).map(([name, num]) =>
    props.employees[name].salary * num
  ).reduce((a, b) => a + b);
  const totalNumber = Object.values(numEmployees).map((x) => parseInt(x, 10) || 0).reduce((a, b) => a + b);

  const modalSubmit =
    (context.cash < totalRecruitingFee)
    ? <>not enough cash</>
    : (totalRecruitingFee == 0)
    ? <>Cancel</>
    : <input type="submit" value={`Pay ${GFG.numberToCurrency(totalRecruitingFee)} to hire ${totalNumber} props.employees`} />;

  return (<>
    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#hiringModal">
      💼 Hiring
    </button>
    <div className="modal" id="hiringModal" tabIndex="-1" role="dialog" aria-labelledby="hiringModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contractModalLabel">💼 Hiring</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{overflowX: "auto"}}>
            { modalTable }
            { JSON.stringify(numEmployees) }
            { modalSubmit }
            {/*

            <form action={props.createContractUrl} acceptCharset="UTF-8" data-remote="true" method="post">
              {
                contract &&
                  <input type="hidden" name="name" value={contract} />
              }
              <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
              {
                !contract
                  ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                  : (context.credit < props.contractAll[contract].required_credit ||
                    context.signedContracts.includes(contract))
                      ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                      : <input type="submit" value={`Sign Contract ${contract}`} className="btn btn-primary" />
              }
            </form>
              */}
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

                <dt>Chief (workers)</dt>
                <dd>Great at organizing and leading. They don't produce a lot by themselves you can leverage their quality standard to other props.employees.</dd>

                <dt>Motivated Junior (workers)</dt>
                <dd>Exactly same as juniors but they aren't greedy</dd>

                <dt>Production volume (t)</dt>
                <dd>Indicated how much this employee consumes ingredients and produces productions, assuming you have "Workbenches" equipment in your factory</dd>

                <dt>Production quality</dt>
                <dd>Helps getting more credit by selling high quality products to your customers. The product quality is calculated by the average of your props.employees production quality, weighted by each production volumes.</dd>

                <dt>Produce (role)</dt>
                <dd>The default role for newly hired props.employees.</dd>

                <dt>Mentor (role)</dt>
                <dd>Stops production and increase 3 other props.employees production qualities up to same as the mentor.</dd>

                <dt>Factory equipments</dt>
                <dd>Enhances all your props.employees production and quality (see details at Equipment menu.) e.g. "Workbenches", and "Conveyor".</dd>

                <dt>Layoff</dt>
                <dd>Not implemented yet.</dd>
              </dl>
            </details>
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default Hiring;
