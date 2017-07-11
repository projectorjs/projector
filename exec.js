const projector = require('./');

projector('./fixture', 'FAILURE_EXPORT', {}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});
