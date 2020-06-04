'use strict';
import ReactDOM from 'react-dom'
import React, { useState, useContext, useEffect } from 'react';
import GFG from '../gfg'

function Admin(props) {
  return <>ok</>;
}

window.onload = () => {
  const domContainer = document.querySelector('#admin-container');
  if (domContainer) {
    ReactDOM.render(React.createElement(Admin), domContainer);
  }
}
