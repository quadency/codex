const restApi = require ('./restApi');

function V1 (baseUrl) {
	return restApi(baseUrl);
}

module.exports = V1;