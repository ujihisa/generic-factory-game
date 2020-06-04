'use strict';
import ReactDOM from 'react-dom'
import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

interface Game {
  id: number;
  month: number;
  cash: number;
  money: number;
  //
  updated_at: string;
  version: string;
  player: {
    name: string;
  };
}

interface Data {
  tutorials: Game[];
}

function Admin(props) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch('/admin.json')
      .then(
        (response) => {
          if (response.status !== 200) {
            alert(`Failed: ${response}`);
            return;
          }
          response.json().then((data) => {
            setData(data);
          })
        }
      ).catch((err) =>
        alert(err)
      )
  }, []);

  const Tutorials = function(props) {
    return (
      <table className="table table-hover table-lg">
        <tbody>
          <tr>
            <th scope="col"><strong>state</strong></th>
            <th scope="col"><strong>version</strong></th>
            <th scope="col"><strong>month</strong></th>
            <th scope="col"><strong>cash</strong></th>
            <th scope="col"><strong>debt</strong></th>
            <th scope="col"><strong>updated_at</strong></th>
            <th scope="col"><strong>player</strong></th>
          </tr>
          {
            data && data.tutorials.map((tutorial: Game, i) =>
              <tr key={i}>
                <td scope="col">
                  <a href={`/games/${tutorial.id}`}>
                    {
                      tutorial.cash < 0
                        ?  "Game over"
                        : 1000 <= tutorial.money
                          ? "Complete"
                          : "In progress"
                    }
                  </a>
                </td>
                <td scope="col">{tutorial.version}</td>
                <td scope="col">{tutorial.month}</td>
                <td scope="col">{tutorial.cash}</td>
                <td scope="col">{tutorial.cash - tutorial.money}</td>
                <td scope="col">{tutorial.updated_at}</td>
                <td scope="col">{tutorial.player.name}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    )
  }

  return <><Tutorials /></>;
}

window.onload = () => {
  const domContainer = document.querySelector('#admin-container');
  if (domContainer) {
    ReactDOM.render(React.createElement(Admin), domContainer);
  }
}
