exports.getDate = function() {
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var today  = new Date();

return (today.toLocaleDateString("en-US", options));
};

exports.getDay = function() {
const today = new Date();

const options={
  weekday:"long"
};

return (today.toLocaleDateString("en-US", options));;
};
