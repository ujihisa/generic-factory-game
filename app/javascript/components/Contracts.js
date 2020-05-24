import React, { useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'

var chart;

function Contracts(props) {
  const context = useContext(GFG.GameContext);
  const [contract, setContract] = useState(null);
  const chartRef = React.createRef();

    const colours = [
      '#D0D0D0',
      '#C8C8C8',
      '#B8B8B8',
      '#B0B0B0',
      '#A8A8A8',
      '#A0A0A0',
      '#989898',
      '#909090',
      '#888888',
      '#787878',
      '#707070',
      '#696969',
      '#686868',
      '#606060',
      '#585858',
    ]
  const chartDefaultDatasets =
      Object.keys(context.signedContracts).map((name, i) => {
        const contract2 = props.contractDump[name];
        return {
          label: name,
          data: (Object.keys(context.signedContracts).includes(name)
            ? GFG.MONTHS.map((m) => contract2.trades[m].required_products)
            : []),
          backgroundColor: colours[i],
          borderColor: colours[i + 5],
          borderWidth: 1,
        };
      })

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: GFG.MONTHS.map((m) => m.slice(0, 3)),
        datasets: chartDefaultDatasets,
      },
      options: {
        scales: {
          xAxes: [{
            stacked: true,
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              callback: (v) => `${v}t`
            },
            id: 'required-products',
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel}t`,
          }
        }
      }
    });
  }, []);

  return (
    <React.Fragment>
      <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#contractsModal">
        📜 Contracts
      </button>
      <br/><br/>

      <div className="modal" id="contractsModal" tabIndex="-1" role="dialog" aria-labelledby="contractModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="contractModalLabel">📜 Contracts</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" style={{overflowX: "auto"}}>
              <ul>
                <li>Once you sign a contract, you must deliver certain amount of products, and you gain certain sales from it.</li>
                <li>You must pay 10 x sales for the month when you can't deliver the products they require.</li>
                <li>There's no way to cancel or terminate contracts, except for cooling off within the same month when you signed.</li>
                <li>As the table and descriptions below show, the required product volumes and sales changes depending on month of year.</li>
                <li>There's no randomness</li>
                <li>Some contracts require minimal credit. Once you sign, you don't always have to keep the credit.</li>
                <li><strong>Sales payments occur in 3 months. </strong> e.g. Sales payment for Nov 2020 occurs in Feb 2021.</li>
              </ul>
              <br/>
              
              <div className="row">
                {
                  Object.entries(props.contractDump).map(([name, c]) => {
                    const signed = Object.keys(context.signedContracts).includes(name);
                    const locked = context.credit < c.required_credit;
                    const selected = name == contract;
                    return (
                      <div key={name} className="col-sm-4">
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
                                  data: GFG.MONTHS.map((m) => c.trades[m].required_products),
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
                              c.describe.map((line) =>
                                <p key={line}>{line}</p>)
                            }
                            <p className="card-text">{c.description}</p>
                            <p className="card-text">
                              <small className="text-muted">Required credit: </small>
                              {c.required_credit}
                            </p>
                          </div>
                        </div>
                      </div>)})
                }
              </div>

              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    {
                      GFG.MONTHS.map((m) => <th key={m} scope="col">{m.slice(0, 3)}</th>)
                    }
                  </tr>
                </thead>
                <tbody className="table">
                  {
                    Object.entries(props.contractDump).map(([name, c]) =>
                      <tr key={name} className={name == contract ? "table-primary" : Object.keys(context.signedContracts).includes(name) ? "table-active" : ""}>
                        <th scope="col">{name}</th>
                        {
                          Object.entries(c.trades).map(([m, t]) =>
                            <td key={m} scope="col">
                              <span className={t.anomaly ? "mark" : ""}>{t.required_products}t<br/>{GFG.numberToCurrency(t.sales)}</span>
                            </td>)
                        }
                      </tr>)
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
                    : (context.credit < props.contractDump[contract].required_credit ||
                      Object.keys(context.signedContracts).includes(contract))
                        ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                        : <input type="submit" value={`Sign Contract ${contract}`} className="btn btn-primary" />
                }
              </form>
            </div>
            {
              Object.entries(context.signedContracts).some(([_, signedMonth]) => signedMonth == context.month) &&
                <div className="modal-footer">
                  <form action={props.cancelContractUrl} acceptCharset="UTF-8" data-remote="true" method="post">
                    <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                    <input type="submit" value={`Cancel this month's signed contracts ${Object.entries(context.signedContracts).filter(([_, m]) => m == context.month).map(([c, _]) => c).join(', ')} (Cooling off)`} className="btn btn-primary" />
                  </form>
                </div>
            }
          </div>
        </div>
      </div>
    </React.Fragment>);
}

Contracts.propTypes = {
  contractDump: PropTypes.object,
  createContractUrl: PropTypes.string,
  cancelContractUrl: PropTypes.string,
};
export default Contracts
