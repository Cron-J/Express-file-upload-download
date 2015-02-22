// Load modules

var	UD = require('./controller/uploadDownload');

// API Server Endpoints
module.exports = function(app){

	app.get('/', UD.display_form);

	app.post('/uploadFile', UD.uploadFile);

	app.get('/getFile/:file', UD.getFile);

	app.get('/fileList', UD.fileList);

}