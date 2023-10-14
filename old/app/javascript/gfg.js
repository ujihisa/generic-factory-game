import React from "react"

const GFG = {
  GameContext: React.createContext(),
  MONTHS: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ],

  currentMonth(month) {
    return this.MONTHS[month % 12]
  },

  numberToCurrency(n) {
    return `$${n}K`;
  },

  sum(xs) {
    return xs.reduce((a, b) => a + b, 0);
  }
};

export default GFG;
