import React, { useState, useContext, useEffect } from 'react';
import PropTypes from "prop-types"
import GFG from '../gfg'

let chart;

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
        const contract2 = context.contractDump[name];
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

    const labelF = (tooltipItem, data) => {
      const total = GFG.sum(
        data.datasets.map((dataset) => 
          dataset.data[tooltipItem.index]
        ));
      return `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.yLabel}t (total: ${total}t)`;
    };

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
            label: labelF,
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
                <li>Some contracts require minimal credit. Note that once you've signed one, you don't always have to keep the credit for that.</li>
                <li><strong>Sales payments occur in 3 months. </strong> e.g. Sales payment for Nov 2020 occurs in Feb 2021.</li>
              </ul>
              <br/>
              
              <div className="row">
                {
                  Object.entries(context.contractDump).map(([name, c]) => {
                    const signed = Object.keys(context.signedContracts).includes(name);
                    const locked = context.credit < c.required_credit;
                    const selected = name == contract;
                    return (
                      <div key={name} className="col-sm-4">
                        <div className={`card ${signed ? "border-light" : locked ? "text-white bg-dark" : selected ? "text-white bg-primary" : "border-info"} mb-3`}
                          onClick={(_) => {
                            setContract(selected ? null : name) 
                            /*if (!chart) {
                              // !?
                            } else*/ if (selected) {
                              chart.data.datasets = chartDefaultDatasets;

                              chart.update();
                            } else {
                              chart.data.datasets = [
                                ...chartDefaultDatasets,
                                {
                                  backgroundColor: '#007bff',
                                  borderColor: '#000000',
                                  label: c.name,
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
                            <h5 className="card-title">{c.name}</h5>
                            {
                              c.describe.map((line) =>
                                <p key={line}>{line}</p>)
                            }
                            <p className="card-text">{c.description}</p>
                            <p className="card-text">
                              <small className="text-muted">Required credit to sign: </small>
                              {c.required_credit}
                            </p>
                          </div>
                        </div>
                      </div>)})
                }
              </div>

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
                    : (context.credit < context.contractDump[contract].required_credit ||
                      Object.keys(context.signedContracts).includes(contract))
                        ? <input type="submit" value="Cancel" className="btn btn-secondary" data-dismiss="modal" />
                        : <input type="submit" value={`Sign Contract ${context.contractDump[contract].name}`} className="btn btn-primary" />
                }
              </form>
            </div>
            {
              Object.values(context.signedContracts).some((signedMonth) => signedMonth == context.month) &&
                <div className="modal-footer">
                  <form action={props.cancelContractUrl} acceptCharset="UTF-8" data-remote="true" method="post">
                    <input type="hidden" name="authenticity_token" value={context.formAuthenticityToken} />
                    <input type="submit" value={`Cancel this month's signed contracts ${Object.entries(context.signedContracts).filter(([_, m]) => m == context.month).map(([c, _]) => context.contractDump[c].name).join(', ')} (Cooling off)`} className="btn btn-primary" />
                  </form>
                </div>
            }
          </div>
        </div>
      </div>
    </React.Fragment>);
}

Contracts.propTypes = {
  createContractUrl: PropTypes.string,
  cancelContractUrl: PropTypes.string,
};
export default Contracts
