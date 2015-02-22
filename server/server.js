var express = require('express'),
    Routes = require('./routes'),
    config = require('./config/config');
    
var app = express();

// parse urlencoded request bodies into req.body
app.use(express.bodyParser())

require('./routes')(app);

var port = config.server.port;

app.listen(port);

console.log('Express app started on port ' + port);
