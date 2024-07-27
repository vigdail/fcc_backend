require('dotenv').config();
const app = require('./src/app');

var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
