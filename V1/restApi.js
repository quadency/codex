const _ = require('lodash');
let nanoTime = require('nano-time');
const querystring = require('querystring');
const nacl = require('tweetnacl');

const api2EndpointMap = {
    serverTime: {
        method: 'GET',
        route: '/users/timestamp'
    },
    cancelOrder: {
        method: 'DELETE',
        route: '/orders/'
    },
    cancelOrders: {
        method: 'POST',
        route: '/orders/cancel'
    },
    getTrades: {
        method: 'GET',
        route: '/trades_history/my'
    },
    getOrders: {
        method: 'GET',
        route: '/orders/active'
    },
    balance: {
        method: 'GET',
        route: '/balances'
    },
    ticker: {
        method: 'GET',
        route: '/tickers'
    },
    info: {
        method: 'GET',
        route: '/info'
    },
    markets: {
        method: 'GET',
        route: '/market'
    },
    currencies: {
        method: 'GET',
        route: '/currency'
    },
    withdrawAddress: {
        method: 'GET',
        route: '/api/deposit/{currency}/address'
    },
    withdraw: {
        method: 'POST',
        route: '/api/withdraw/'
    },
    withdrawCancel: {
        method: 'POST',
        route: '/api/withdraw/cancel/'
    },
    withdrawHistory: {
        method: 'GET',
        route: '/api/withdraw/'
    },
    placeOrders: {
        method: 'POST',
        route: '/orders'
    },
    rates: {
        method: 'GET',
        route: '/convert-rates'
    }
};

function createNaclSignature(payload, secret) {
    const secretKey = Buffer.from(secret, "hex");
    const keypair = nacl.sign.keyPair.fromSecretKey(secretKey);
    const signature = nacl.sign(Buffer.from(payload), keypair.secretKey);
    return new Buffer(signature).toString("hex");
}

function restApi() {

    const baseUrl = arguments[0];
    const baseUrlCoins = baseUrl + '/coins2';

    const getServerTimeRequest = () => {
        const requestOptions = api2EndpointMap.serverTime;
        return {
            method: requestOptions.method,
            url: baseUrl + requestOptions.route
        };
    };

    const getCancelOrdersRequest = (params) => {
        const requestOptions = api2EndpointMap.cancelOrders;
        const {tonce = nanoTime(), market, side, apiKeys} = params;

        const body = JSON.stringify({
            market, side
        });
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getCancelOrderRequest = (params) => {
        const {tonce = nanoTime(), id, apiKeys} = params;

        const requestOptions = {
            method: api2EndpointMap.cancelOrder.method,
            route: api2EndpointMap.cancelOrder.route + id
        };

        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getGetTradesRequest = (params) => {
        const requestOptions = api2EndpointMap.getTrades;
        const {tonce = nanoTime(), limit, from_time, to_time, page_token, market, side, apiKeys} = params;

        const body = querystring.stringify({
            limit, from_time, to_time, page_token, market, side
        });
        const payload = `${requestOptions.route}?${body}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}?${body}`
        };
    };

    const getGetOrdersRequest = (params) => {
        const requestOptions = api2EndpointMap.getOrders;
        const {tonce = nanoTime(), market, status, side, type, limit, from_time, to_time, from_uuid, order, apiKeys} = params;

        const body = querystring.stringify({
            market, status, side, type, limit, from_time, to_time, from_uuid, order
        });

        const payload = `${requestOptions.route}?${body}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}?${body}`
        };
    };

    const getBalancesRequest = (params) => {
        const {tonce = nanoTime(), apiKeys} = params;

        const requestOptions = api2EndpointMap.balance;
        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getTickerRequest = (params) => {
        const requestOptions = api2EndpointMap.ticker;

        return {
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getInfoRequest = (params) => {
        const requestOptions = api2EndpointMap.info;

        return {
            method: requestOptions.marketsethod,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getMarketsRequest = (params) => {
        const requestOptions = api2EndpointMap.markets;
        const {tonce = nanoTime(), apiKeys} = params;
        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrlCoins}${requestOptions.route}`
        };
    };

    const getCurrenciesRequest = (params) => {
        const requestOptions = api2EndpointMap.currencies;
        const {tonce = nanoTime(), apiKeys} = params;
        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrlCoins}${requestOptions.route}`
        };
    };

    const getRatesRequest = (params) => {
        const requestOptions = api2EndpointMap.rates;
        const {tonce = nanoTime(), apiKeys} = params;
        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    const getDepositAddressRequest = (params) => {
        const {tonce = nanoTime(), currency, apiKeys: account} = params;

        const requestOptions = {
            method: api2EndpointMap.withdrawAddress.method,
            route: _.replace(api2EndpointMap.withdrawAddress.route, '{currency}', _.toLower(currency))
        };

        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, account.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': account.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrlCoins}${requestOptions.route}`
        };
    };

    const getWithdrawRequest = (params) => {
        const {tonce = nanoTime(), currency_code, address, amount, expected_tag, account} = params;

        const requestOptions = {
            method: api2EndpointMap.withdraw.method,
            route: api2EndpointMap.withdraw.route + currency_code
        };

        const body = JSON.stringify({
            address, amount, expected_tag
        });
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, account.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': account.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrlCoins}${requestOptions.route}`
        };
    };

    const getWithdrawHistoryRequest = (params) => {
        const {tonce = nanoTime(), currency_code, apiKeys} = params;

        const requestOptions = {
            method: api2EndpointMap.withdrawHistory.method,
            route: api2EndpointMap.withdrawHistory.route + currency_code
        };

        const body = JSON.stringify({});
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiKeys.apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKeys.apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrlCoins}${requestOptions.route}`
        };
    };

    const getPlaceOrdersRequest = (params) => {
        const {tonce = nanoTime(), orders, apiKeys} = params;

        if (!_.isEmpty(apiKeys)) {
            apiKey = apiKeys.apiKey;
            apiSecret = apiKeys.apiSecret;
        }

        const requestOptions = api2EndpointMap.placeOrders;

        const body = JSON.stringify(orders);
        const payload = `${body}${requestOptions.route}${tonce}`;
        const signature = createNaclSignature(payload, apiSecret);

        return {
            headers: {
                'X-Tonce': tonce,
                'X-Signature': signature,
                'X-Public-Key': apiKey
            },
            json: false,
            body,
            method: requestOptions.method,
            url: `${baseUrl}${requestOptions.route}`
        };
    };

    return {
        getServerTimeRequest,
        getCancelOrderRequest,
        getCancelOrdersRequest,
        getGetTradesRequest,
        getGetOrdersRequest,
        getPlaceOrdersRequest,
        getWithdrawRequest,
        getWithdrawHistoryRequest,
        getBalancesRequest,
        getTickerRequest,
        getInfoRequest,
        getRatesRequest,
        getCurrenciesRequest,
        getMarketsRequest,
        getDepositAddressRequest,
        createNaclSignature
    };

}

module.exports = restApi;