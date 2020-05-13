import React, { useState, useContext } from 'react';
import GFG from '../gfg'

function Hiring() {
  const context = useContext(GFG.GameContext);
  const [debt, setDebt] = useState(context.debt);
  return (<>
    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#hiringModal">
      💼 Hiring
    </button>
    <div className="modal" id="hiringModal" tabIndex="-1" role="dialog" aria-labelledby="hiringModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contractModalLabel">💼 Hiring</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body" style={{overflowX: "auto"}}>
            {/*
            <ul>
              <li>契約は、このゲームでお金を得る唯一の方法である。</li>
              <li>商品契約を結ぶと、毎月決まった量の生産物を渡し、それによって毎月決まった額の報酬を得る。</li>
              <li>もしも生産物を渡せなければ、ペナルティとしてその月の報酬の10倍の額を支払う。</li>
              <li>一度契約を結ぶと、解約する方法は無い。契約する前に、必要な生産物をきちんと生産できるか事前に確認せよ。</li>
              <li>特定の月は、生産物の量と報酬の額が変動する。具体的にどの月にどう変わるかは、結ぶ契約による。</li>
            </ul>
            <br/>


            <div className="row">
              {
                React.Children.map(
                  Object.entries(props.contractAll).map((c) => {
                    const name = c[0];
                    const signed = context.signedContracts.includes(name);
                    const locked = context.credit < c[1].required_credit;
                    const selected = name == contract;
                    return (
                      <div className="col-sm-4">
                        <div className={`card ${signed ? "border-light" : locked ? "text-white bg-dark" : selected ? "text-white bg-primary" : "border-info"} mb-3`}
                          onClick={(_) => {
                            setContract(selected ? null : name) 
                            if (!chart) {
                              // !?
                            } else if (selected) {
                              chart.data.datasets = chartDefaultDatasets;

                              chart.update();
                            } else {
                              chart.data.datasets = [
                                ...chartDefaultDatasets,
                                {
                                  backgroundColor: '#007bff',
                                  borderColor: '#000000',
                                  label: name,
                                  borderWidth: 1,
                                  data: GFG.MONTHS.map((m) => c[1].trades[m] ? c[1].trades[m].required_products : c[1].trades.default.required_products),
                                },
                              ];

                              chart.update();
                            }
                          }}>
                          <div className="card-header">
                            {
                              signed
                                ? (selected ? "✅ Signed (You can't sign more!)" : "✅ Signed")
                                : locked
                                  ? (selected ? "🔐 Credit not enough (You can't sign yet)" : "🔐 Credit not enough")
                                  : (selected ? "👉 Selected" : "Available")
                            }
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">Contract {name}</h5>
                            {
                              React.Children.map(
                                c[1].describe.map((line) => <p>{line}</p>),
                                (e) => e)
                            }
                            <p className="card-text">{c[1].description}</p>
                            <p className="card-text">
                              <small className="text-muted">Required credit: </small>
                              {c[1].required_credit}
                            </p>
                          </div>
                        </div>

                      </div>
                    )}),
                  (e) => e)
              }
            </div>

            <table className="table table-hover table-sm">
              <thead>
                <tr>
                  <th scope="col"></th>
                  {
                    React.Children.map(
                      GFG.MONTHS.map((m) =>
                        <th scope="col">{m.slice(0, 3)}</th>
                      ),
                      (e) => e)
                  }
                </tr>
              </thead>
              <tbody className="table">
                {
                  React.Children.map(
                    Object.entries(props.contractAll).map((c) =>
                      <tr className={c[0] == contract ? "table-primary" : context.signedContracts.includes(c[0]) ? "table-active" : ""}>
                        <th scope="col">{c[0]}</th>
                        {
                          React.Children.map(
                            GFG.MONTHS.map((m) =>
                              c[1].trades[m]
                                ? <td scope="col">
                                  <b>{c[1].trades[m].required_products}t<br/>{GFG.numberToCurrency(c[1].trades[m].sales)}</b>
                                </td>
                                : <td scope="col">
                                  {c[1].trades.default.required_products}t<br/>{GFG.numberToCurrency(c[1].trades.default.sales)}
                                </td>),
                            (e) => e)
                        }
                      </tr>),
                    (e) => e)
                }
              </tbody>
            </table>

            <canvas ref={chartRef} width="100%" height="50%"></canvas>
          </div>
          <div className="modal-footer">
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
          </div>
        </div>
      </div>
    </div>
  </>);
};

export default Hiring;
