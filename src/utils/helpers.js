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
  }
};

export default helpers;