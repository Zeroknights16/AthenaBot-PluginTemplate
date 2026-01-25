const routeManager = require('../../../web_api/src/route.js');

// The Web_api plugin must be up and running to use routes. If the web api fails to load or is disabled, this route will be ignored.
module.exports = class hello extends routeManager {
	constructor(heart) {
        // Registration path for the route: http(s)://<your-domain>/<path>, in this case http(s)://<your-domain>/api/hello.
        // Do not include http(s)://<your-domain>/ in the path.
        //
        // Available types are: get, post, put, delete.
        //
        // If IP is set to true, all incoming requests must be sent from a whitelisted ip.
        // If key is set o true, all incoming reuqests must include the auth key in their headers.
		super(heart, { name: 'hello', path: 'api/hello', type: 'get' }, { ip: false, key: false });
	}

	async execute(req, res) {
		res.status(200).send(this.generateSuccessResponse({ message: 'Hello world!' }));
	}
};