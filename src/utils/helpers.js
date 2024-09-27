const helpers = {
  if_gt: function(v1, v2, options) {
    if(v1 > v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  add: function(v1, v2) {
    return parseInt(v1) + parseInt(v2);
  },
  subtract: function(v1, v2) {
    return parseInt(v1) - parseInt(v2);
  },
  forPages: function(n, options) {
    let pages = '';
    for (let i = 1; i <= n; i++) {
      pages += `<option value="${i}" ${i === options.data.root.page ? 'selected' : ''}>${i} de ${n}</option>`;
    }
    return pages;
  },
  isSelected: function(value, currentPage) {
    return (value == currentPage) ? 'selected' : '';
  }
};

export default helpers;