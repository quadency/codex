const restApiModule = require('./V1/V1');
const _ = require('lodash');
const url = require('url');
const WebSocket = require('ws');
const orderType = require('./constants/orderType');
const wsMessageTypes = require('./constants/wsMessageTypes');

const rp = require('request-promise');

const DEFAULT_METHOD = 'POST';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_OPTIONS = {
  timeout: DEFAULT_TIMEOUT,
  method: DEFAULT_METHOD,
  json: true
};
const WS_PING_INTERVAL = 30000;
const WS_RECONNECT_INTERVAL = 5000;



const commonCurrencies = {
  BCHABC: 'BCH',
  BCHSV: 'BSV',
}

function Codex(...params) {
  if (!(this instanceof Codex)) {
    return new Codex(...params)
  }
  ;
  Codex.subscriptions = [];
  Codex.socketHeartbeatInterval = null;

  let wss = false;
  let wsClient = null;
  let connection;
  let _channels = [];
  let wsUrl;

  let restApi;

  const apiKeys = {
    apiKey: '',
    apiSecret: '',
  };

  const {apiKey, apiSecret, baseUrl = 'https://api.codex.one', logger = console.log} = params.length === 1
    ? params[0]
    : {apiKey: params[0], apiSecret: params[1], baseUrl: params[2], logger: params[3]};


  apiKeys.apiKey = apiKey;
  apiKeys.apiSecret = apiSecret;

  function setApiKeys(apiKey, apiSecret) {
    apiKeys.apiKey = apiKey;
    apiKeys.apiSecret = apiSecret;
  }

  restApi = restApiModule(baseUrl);
  wsUrl = 'wss://' + url.parse(baseUrl).host + '/ws';

  async function executeCall(options) {
    const requestOptions = _.extend({}, DEFAULT_OPTIONS, options);
    try {
      if (logger)
        logger(`Sending HTTP request with options: ${JSON.stringify(requestOptions)}`);
      return await rp(requestOptions);
    } catch (err) {
      if (logger)
        logger(`Error while executing http call using options [${JSON.stringify(requestOptions)}]`, err.message);
      throw err.message;
    }
  }

  const getServerTime = async () => {
    const request = restApi.getServerTimeRequest();
    return await executeCall(request);
  };

  /**
   * Executes cancel of all orders by market and side if any provided.
   *
   * @param market - market to cancel order by, optional
   * @param side - side to cancel order by, optional
   * @returns {Promise<*>}
   */
  const cancelOrders = async (market = undefined, side = undefined) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {market, side, apiKeys};
    const request = restApi.getCancelOrdersRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const cancelOrder = async (id) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {id, apiKeys};
    const request = restApi.getCancelOrderRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const getTrades = async (limit, from_time, to_time, market, page_token = undefined) => {
    const requestParams = {limit, from_time, to_time, page_token, market};
    const request = restApi.getGetTradesRequest(requestParams);
    return executeCall(request);
  };

  const getMyTrades = async (limit, from_time, to_time, page_token = undefined, market = undefined, side = undefined) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {limit, from_time, to_time, page_token, market, side, apiKeys};
    const request = restApi.getGetMyTradesRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const getOrders = async (market = undefined, status = undefined, side = undefined, type = undefined, limit = 500, from_time = undefined, to_time = undefined, from_uuid = undefined, order = undefined) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {market, status, side, type, limit, from_time, to_time, from_uuid, order, apiKeys};
    const request = restApi.getGetOrdersRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const getClosedOrders = async (market = undefined, status = undefined, side = undefined, type = undefined, limit = 500, from_time = undefined, to_time = undefined, page_token = undefined) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {market, status, side, type, limit, from_time, to_time, page_token, apiKeys};
    const request = restApi.getGetCloseOrdersRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  }

  const getBalances = async () => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {apiKeys};
    const request = restApi.getBalancesRequest(requestParams);
    const response = await executeCall(request);
    const balances = JSON.parse(response);

    return balances.map(assetBalance=>({
      asset: commonCurrencies[assetBalance.currency] ? commonCurrencies[assetBalance.currency] : assetBalance.currency,
      free: assetBalance.balance,
      used: assetBalance.locked,
      total: (parseFloat(assetBalance.balance) - parseFloat(assetBalance.locked)).toString(),
    }));
  };

  const getTicker = async () => {
    const request = restApi.getTickerRequest();
    return await executeCall(request);
  };

  const getInfo = async () => {
    const request = restApi.getInfoRequest();
    return await executeCall(request);
  };

  const getMarkets = async () => {
    const requestParams = {apiKeys};
    const request = restApi.getMarketsRequest(requestParams);
    const rawResponse = await executeCall(request);

    return rawResponse.reduce((acc, cur) => {
      const base = cur.base_currency.code;
      const quote = cur.quote_currency.code;
      const pair = `${commonCurrencies[base] ? commonCurrencies[base] : base}/${commonCurrencies[quote] ? commonCurrencies[quote] : quote}`;
      acc[pair] = {
        id: cur.id,
        symbol: cur.title,
        quote,
        base,
        info: cur,
        precision: {
          amount: cur.base_precision,
          price: cur.quote_precision,
        },
        cost: {
          min: 0.00000001
        },
        limits: {
          price: {
            min: 0.00000001,
            max: 10000000
          }
        },
      };
      return acc;
    }, {});
  };

  const getCurrencies = async () => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {apiKeys};
    const request = restApi.getCurrenciesRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const getRates = async () => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {apiKeys};
    const request = restApi.getRatesRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const getDepositAddress = async (currency) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    if (_.isEmpty(currency))
      throw new Error(`currency is required`);
    const requestParams = {currency, apiKeys};
    const request = restApi.getDepositAddressRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const withdraw = async (currency_code, address, amount, expected_tag = null, account = null) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    if (_.isEmpty(currency_code) || _.isEmpty(address))
      throw new Error(`currency_code, address and amount are required`);
    if (account == null)
      account = _.assign(account, apiKeys);
    const requestParams = {currency_code, address, amount, account, expected_tag};
    const request = restApi.getWithdrawRequest(requestParams);
    return await executeCall(request);
  };

  const withdrawHistory = async (currency_code) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    if (_.isEmpty(currency_code))
      throw new Error(`currency_code is required`);
    const requestParams = {currency_code, apiKeys};
    const request = restApi.getWithdrawHistoryRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const placeOrders = async (orders, account = null) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {orders, apiKeys};
    const request = restApi.getPlaceOrdersRequest(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  };

  const bindAffiliate = async (referenceUUID) => {
    if (_.isEmpty(apiKeys.apiKey) || _.isEmpty(apiKeys.apiSecret))
      throw new Error(`api keys are empty. Please call setApiKeys(apiKey, apiSecret)`);
    const requestParams = {referenceUUID, apiKeys};
    const request = restApi.bindAffiliateLink(requestParams);
    const response = await executeCall(request);
    return JSON.parse(response);
  }

  const sendSignature = (payload) => {
    if (logger)
      logger('Cryptagio WS send signature..');
    const signature = restApi.createNaclSignature(payload, apiKeys.apiSecret);
    send({
      type: wsMessageTypes.TOKEN_AUTH,
      payload: {signature}
    });
    if (logger)
      logger('Cryptagio WS authentication was successful');
  };

  const startGetOrderBook = async (market) => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.SUBSCRIBE,
      payload: {channels: [`order_book-${market.toLowerCase()}`]}
    };
    send(subscribeData);
    Codex.subscriptions.push(`order_book-${market.toLowerCase()}`);
  };

  const stopGetOrderBook = async (market) => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.UNSUBSCRIBE,
      payload: {channels: [`order_book-${market.toLowerCase()}`]}
    };
    send(subscribeData);
    _.remove(Codex.subscriptions, sub => {
      return sub === `order_book-${market.toLowerCase()}`
    });
  };

  const startGetTrades = async (market) => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.SUBSCRIBE,
      payload: {channels: [`trade-${market.toLowerCase()}`]}
    };
    send(subscribeData);
    Codex.subscriptions.push(`trade-${market.toLowerCase()}`);
  };

  const stopGetTrades = async (market) => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.UNSUBSCRIBE,
      payload: {channels: [`trade-${market.toLowerCase()}`]}
    };
    send(subscribeData);
    _.remove(Codex.subscriptions, sub => {
      return sub === `trade-${market.toLowerCase()}`
    });
  };

  const startGetTickers = async () => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.SUBSCRIBE,
      payload: {channels: [`tickers`]}
    };
    send(subscribeData);
    Codex.subscriptions.push(`tickers`);
  };

  const stopGetTickers = async () => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    const subscribeData = {
      type: wsMessageTypes.UNSUBSCRIBE,
      payload: {channels: [`tickers`]}
    };
    send(subscribeData);
    _.remove(Codex.subscriptions, sub => {
      return sub === `tickers`
    });
  };

  const authProcessor = (connection) => {
    if (logger)
      logger('Cryptagio WS authentication..');
    const authMsg = {
      type: wsMessageTypes.TOKEN_AUTH_REQUEST,
      payload: {public_key: apiKeys.apiKey}
    };
    send(authMsg);
  };

  const connect = (callback) => {
    const connectionUrl = url.parse(wsUrl);
    const address = connectionUrl.href;

    wsClient = new WebSocket(address, {
      headers: {
        host: connectionUrl.host
      }
    });

    wsClient.on('open', () => {
      if (logger)
        logger('WS client is connected to', address);
      Codex.socketHeartbeatInterval = setInterval(() => {
        if(wsClient && wsClient.readyState === wsClient.OPEN){
          wsClient.ping();
        } else {
          clearInterval(Codex.socketHeartbeatInterval);
        }
      }, WS_PING_INTERVAL);
      authProcessor(wsClient);
      send({
        type: wsMessageTypes.SUBSCRIBE,
        payload: {channels: Codex.subscriptions}
      })
    });

    wsClient.on('error', (err) => {
      if (logger)
        logger('WS error', err);
    });

    wsClient.on('pong', () => {
      if (logger)
        logger('received pong message');
    });

    wsClient.on('close', (code, reason) => {
      wsClient = null;
      if (logger)
        logger('WS connection was closed', code, reason);
      if (Codex.socketHeartbeatInterval) clearInterval(Codex.socketHeartbeatInterval);
      if (code !== 4000) {
        setTimeout(() => {
          connect(callback);
        }, WS_RECONNECT_INTERVAL);
      }
    });
    wsClient.on('message', function (data) {
      try {
        data = JSON.parse(data);
        if (data.data.msg === wsMessageTypes.API_TOKEN_AUTHORIZE_REQUESTED) {
          if (logger)
            logger(data);
          return sendSignature(data.data.description);
        }
        callback(data);
      } catch (error) {
        if (logger)
          logger('Parse error: ' + error.message);
      }
    });
    return wsClient;
  };

  function send(data) {
    try {
      wsClient.send(JSON.stringify(data));
    } catch (err) {
      if (logger)
        logger('error sending data via WS', err);
      throw err;
    }
  }

  const disconnect = () => {
    if (!wsClient) {
      if (logger)
        logger(`Connection not open. Please call connect function`);
      return false;
    }
    try {
      if (logger)
        logger('WS Client is disconnecting');
      wsClient.close(4000);
      if (logger)
        logger('WS Client is disconnected');
    } catch (err) {
      if (logger)
        logger('error closing ws connection', err);
    }
  };


  return {
    setApiKeys,
    getServerTime,
    cancelOrder,
    cancelOrders,
    getTrades,
    getMyTrades,
    getOrders,
    getClosedOrders,
    getInfo,
    placeOrders,
    getBalances,
    getTicker,
    getRates,
    getCurrencies,
    getMarkets,
    getDepositAddress,
    withdraw,
    withdrawHistory,
    bindAffiliate,
    websocket: {
      connect,
      disconnect,
      startGetOrderBook,
      stopGetOrderBook,
      startGetTickers,
      stopGetTickers,
      startGetTrades,
      stopGetTrades,
    }
  }
}

module.exports = Codex;
