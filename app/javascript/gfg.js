const GFG = {
  currentMonth(month) {
    return [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month % 12]
  },

  numberToCurrency(n) {
    return `$${n}K`;
  }
};

export default GFG;
