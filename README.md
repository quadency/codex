## JS library wrapper for the CODEX API

#### Installation
```
npm install -s codex-api-node
```

#### Getting started
```javascript
const Codex = require('codex-api-node');
const codex = new Codex(
    "<public key>",
    "<secret key>",
    "<baseUrl>", //optional
    "<logger>" //optional, console.log by default
);
//or pass arguments as object:
const codex = new Codex({
    apiKey: "<public key>",
    apiSecret: "<secret key>",
    baseUrl: "<baseUrl>", //optional
    logger: "<logger>" //optional, console.log by default
  }
);
```

#### Get exchange information
```javascript
codex.getInfo().then((information) => {
    console.log(information);
}).catch((error) => {
    console.error(error);
});
```

#### Get server time
```javascript
codex.getServerTime().then((serverTime) => {
    console.log(serverTime);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ timestamp: 1543567717 }
```
</details>

#### Cancel order by id
```javascript
codex.cancelOrder('f74b35c8-23a9-49b7-88b5-da7f1673f45a').then((canceledOrder) => {
    console.log(canceledOrder);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { uuid: 'f74b35c8-23a9-49b7-88b5-da7f1673f45a',
    side: 'ask',
    type: 'limit',
    status: 'active',
    created_at: 1543498906,
    amount_original: '1',
    amount_remaining: '1',
    amount_executed: '0',
    market: 'eosbtc',
    base_currency: 'EOS',
    quote_currency: 'BTC',
    trades_count: 0,
    price: '1',
    average_price: '0',
    stop_price: '',
    funds_used: '0',
    funds_received: '0' } ]
```
</details>

#### Cancel orders by market
```javascript
codex.cancelOrders('eosbtc').then((canceledOrders) => {
    console.log(canceledOrders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { uuid: 'f74b35c8-23a9-49b7-88b5-da7f1673f45a',
    side: 'ask',
    type: 'limit',
    status: 'active',
    created_at: 1543498906,
    amount_original: '1',
    amount_remaining: '1',
    amount_executed: '0',
    market: 'eosbtc',
    base_currency: 'EOS',
    quote_currency: 'BTC',
    trades_count: 0,
    price: '1',
    average_price: '0',
    stop_price: '',
    funds_used: '0',
    funds_received: '0' } ]
```
</details>

#### Cancel orders by market and side
```javascript
codex.cancelOrders('eosbtc', 'ask').then((canceledOrders) => {
    console.log(canceledOrders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { uuid: 'uuid',
    side: 'ask',
    type: 'limit',
    status: 'active',
    created_at: 1543498906,
    amount_original: '1',
    amount_remaining: '1',
    amount_executed: '0',
    market: 'eosbtc',
    base_currency: 'EOS',
    quote_currency: 'BTC',
    trades_count: 0,
    price: '1',
    average_price: '0',
    stop_price: '',
    funds_used: '0',
    funds_received: '0' } ]
```
</details>

#### Get trades with limit by timeframe
Limit of number of returned trades and timeranges are required parameters. 
```javascript
codex.getTrades(2, '1551477606', '1553086806').then((trades) => {
    console.log(trades);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ page_token: 'AAPQACAAAAAWTFW7HNYAGYTJMQIEPH3KH234IRSBQ73TMXTVFFFGX4D7777734D777772===',
  trades: 
   [ { uuid: 'ca64b6a8-a342-4039-a6f9-fd34d8274202',
       price: '3569.2',
       amount: '0.00995',
       funds: '35.51354',
       market: 'btcusdt',
       created_at: 1553014407,
       side: 'bid',
       base_currency: 'btc',
       quote_currency: 'usdt',
       trade_cost: '-35.51354',
       trade_result: '0.009949',
       fee: '0.000001',
       fee_currency: 'btc',
       order_uuid: '801bd239-f206-4750-8ba1-cde5c58c84c7' },
     { uuid: '479f6a3e-b7c4-4641-87f7-365e75294a6b',
       price: '135.55',
       amount: '0.003',
       funds: '0.40665',
       market: 'ethusdt',
       created_at: 1553014406,
       side: 'bid',
       base_currency: 'eth',
       quote_currency: 'usdt',
       trade_cost: '-0.40665',
       trade_result: '0.002997',
       fee: '0.000003',
       fee_currency: 'eth',
       order_uuid: '2cbb560d-e32d-4578-99b2-bf2d66e6170f' } ] }

```
</details>

#### Get next page of trades with limit by timeframe
Used if number of trades by specified timeframe is larger than limit. Send page token returned by previos getTrades request. Page is last if page token is empty string.
```javascript
codex.getTrades(2, '1551477606', '1553086806', 'AAPQACAAAAAWTFW7HNYAGYTJMQIEPH3KH234IRSBQ73TMXTVFFFGX4D7777734D777772===').then((trades) => {
    console.log(trades);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ page_token: '',
  trades: 
   [ { uuid: 'ca64b6a8-a342-4039-a6f9-fd34d8274202',
       price: '3569.2',
       amount: '0.00995',
       funds: '35.51354',
       market: 'btcusdt',
       created_at: 1553014407,
       side: 'bid',
       base_currency: 'btc',
       quote_currency: 'usdt',
       trade_cost: '-35.51354',
       trade_result: '0.009949',
       fee: '0.000001',
       fee_currency: 'btc',
       order_uuid: '801bd239-f206-4750-8ba1-cde5c58c84c7' },
     { uuid: '479f6a3e-b7c4-4641-87f7-365e75294a6b',
       price: '135.55',
       amount: '0.003',
       funds: '0.40665',
       market: 'ethusdt',
       created_at: 1553014406,
       side: 'bid',
       base_currency: 'eth',
       quote_currency: 'usdt',
       trade_cost: '-0.40665',
       trade_result: '0.002997',
       fee: '0.000003',
       fee_currency: 'eth',
       order_uuid: '2cbb560d-e32d-4578-99b2-bf2d66e6170f' } ] }

```
</details>

#### Get trades by market and side without page token
```javascript
codex.getTrades(2, '1541477606', '1553086806', undefined, 'eosbtc', 'bid', 2).then((trades) => {
    console.log(trades);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ page_token: '',
  trades: 
   [ { uuid: 'ca64b6a8-a342-4039-a6f9-fd34d8274202',
       price: '3569.2',
       amount: '0.00995',
       funds: '35.51354',
       market: 'btcusdt',
       created_at: 1553014407,
       side: 'bid',
       base_currency: 'btc',
       quote_currency: 'usdt',
       trade_cost: '-35.51354',
       trade_result: '0.009949',
       fee: '0.000001',
       fee_currency: 'btc',
       order_uuid: '801bd239-f206-4750-8ba1-cde5c58c84c7' },
     { uuid: '479f6a3e-b7c4-4641-87f7-365e75294a6b',
       price: '135.55',
       amount: '0.003',
       funds: '0.40665',
       market: 'ethusdt',
       created_at: 1553014406,
       side: 'bid',
       base_currency: 'eth',
       quote_currency: 'usdt',
       trade_cost: '-0.40665',
       trade_result: '0.002997',
       fee: '0.000003',
       fee_currency: 'eth',
       order_uuid: '2cbb560d-e32d-4578-99b2-bf2d66e6170f' } ] }
```
</details>

#### Get orders by market
```javascript
codex.getOrders('ethusdt').then((orders) => {
    console.log(orders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ orders: 
   [ { uuid: 'db72c775-fe77-4fef-a9c8-f1d82ce27f4d',
       side: 'bid',
       type: 'limit',
       status: 'active',
       created_at: 1552985207,
       amount_original: '0.2',
       amount_remaining: '0.2',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '123.75',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' },
     { uuid: 'c1643ee6-e394-4e04-9cd7-59ac8436fb41',
       side: 'ask',
       type: 'limit',
       status: 'active',
       created_at: 1552985206,
       amount_original: '0.392',
       amount_remaining: '0.392',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '106.57',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' } ] }

```
</details>

#### Get orders by market and status
Available values : active, wait
```javascript
codex.getOrders('ethusdt', 'active').then((orders) => {
    console.log(orders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ orders: 
   [ { uuid: 'db72c775-fe77-4fef-a9c8-f1d82ce27f4d',
       side: 'bid',
       type: 'limit',
       status: 'active',
       created_at: 1552985207,
       amount_original: '0.2',
       amount_remaining: '0.2',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '123.75',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' },
     { uuid: 'c1643ee6-e394-4e04-9cd7-59ac8436fb41',
       side: 'ask',
       type: 'limit',
       status: 'active',
       created_at: 1552985206,
       amount_original: '0.392',
       amount_remaining: '0.392',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '106.57',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' } ] }
```
</details>

#### Get orders by market, status and side
```javascript
codex.getOrders('ethusdt', 'active', 'bid').then((orders) => {
    console.log(orders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ orders: 
   [ { uuid: 'db72c775-fe77-4fef-a9c8-f1d82ce27f4d',
       side: 'bid',
       type: 'limit',
       status: 'active',
       created_at: 1552985207,
       amount_original: '0.2',
       amount_remaining: '0.2',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '123.75',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' } ] }
```
</details>

#### Get orders by market, status, side and type
Available values : market, limit, stop, stoplimit
```javascript
codex.getOrders('ethusdt', 'active', 'bid', 'limit').then((orders) => {
    console.log(orders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ orders: 
   [ { uuid: 'db72c775-fe77-4fef-a9c8-f1d82ce27f4d',
       side: 'bid',
       type: 'limit',
       status: 'active',
       created_at: 1552985207,
       amount_original: '0.2',
       amount_remaining: '0.2',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '123.75',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' } ] }
```
</details>

#### Get orders by market, status, side and type with limit and timeframe
```javascript
codex.getOrders('market', 'status', 'side', 'type', 2, '1541477606', '1553086806').then((orders) => {
    console.log(orders);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ orders: 
   [ { uuid: 'db72c775-fe77-4fef-a9c8-f1d82ce27f4d',
       side: 'bid',
       type: 'limit',
       status: 'active',
       created_at: 1552985207,
       amount_original: '0.2',
       amount_remaining: '0.2',
       amount_executed: '0',
       market: 'ethusdt',
       base_currency: 'ETH',
       quote_currency: 'USDT',
       trades_count: 0,
       price: '123.75',
       average_price: '0',
       stop_price: '',
       funds_used: '0',
       funds_received: '0' } ] }
```
</details>

#### Place orders
```javascript
const orders = [
  {
    "market": "btcusdt",
    "side": "ask",
    "amount": "0.1",
    "type": "market"
  },
  {
    "market": "btcusdt",
    "side": "ask",
    "amount": "0.1",
    "price": "3894",
    "type": "limit"
  },
  {
    "market": "btcusdt",
    "side": "ask",
    "amount": "0.1",
    "stop_price": "3894",
    "type": "market"
  },
  {
    "market": "btcusdt",
    "side": "ask",
    "amount": "0.1",
    "price": "3894",
    "stop_price": "3893",
    "type": "limit"
  }
]
codex.placeOrders(orders).then((order) => {
    console.log(order);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { uuid: '5dccb6df-142b-41c6-a003-5025194caa4e',
    side: 'ask',
    type: 'market',
    status: 'active',
    created_at: 1553080603,
    amount_original: '0.1',
    amount_remaining: '0.1',
    amount_executed: '0',
    market: 'btcusdt',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    trades_count: 0,
    price: '',
    average_price: '0',
    stop_price: '',
    funds_used: '0',
    funds_received: '0' },
  { uuid: 'c306d4a8-0b75-4fd8-83fd-67b4324de153',
    side: 'ask',
    type: 'limit',
    status: 'active',
    created_at: 1553080603,
    amount_original: '0.1',
    amount_remaining: '0.1',
    amount_executed: '0',
    market: 'btcusdt',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    trades_count: 0,
    price: '3894',
    average_price: '0',
    stop_price: '',
    funds_used: '0',
    funds_received: '0' },
  { uuid: '938d665f-d8e7-4d29-8309-de8ad7d64c1d',
    side: 'ask',
    type: 'stop',
    status: 'wait',
    created_at: 1553080603,
    amount_original: '0.1',
    amount_remaining: '0.1',
    amount_executed: '0',
    market: 'btcusdt',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    trades_count: 0,
    price: '',
    average_price: '0',
    stop_price: '3894',
    funds_used: '0',
    funds_received: '0' },
  { uuid: 'ed62b57a-8b83-408d-8e50-538a229bd8b5',
    side: 'ask',
    type: 'stoplimit',
    status: 'wait',
    created_at: 1553080603,
    amount_original: '0.1',
    amount_remaining: '0.1',
    amount_executed: '0',
    market: 'btcusdt',
    base_currency: 'BTC',
    quote_currency: 'USDT',
    trades_count: 0,
    price: '3894',
    average_price: '0',
    stop_price: '3893',
    funds_used: '0',
    funds_received: '0' } ]

```
</details>

#### Get balances
```javascript
codex.getBalances().then((balances) => {
    console.log(balances);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { 
    currency: 'USDT',
    balance: '20.5987005686645001',
    locked: '2.4715734518289996' 
  },
  { currency: 'ETH',
    balance: '0.467863833653562446',
    locked: '0.21660512999999998' 
  } ]
```
</details>

#### Get tickers
```javascript
codex.getTicker().then((tickers) => {
    console.log(tickers);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ data:
    {
      btcusdt: {
          at: 1543573965,
          base_unit: 'BTC',
          high: '4385.7',
          last: '4105.2',
          low: '260.1',
          name: 'BTC/USDT',
          open: '3595.5',
          quote_unit: 'USDT',
          quote_volume: '75831.883544',
          volume: '18.02884' 
      },
      eosbtc:{
          at: 1543573966,
          base_unit: 'EOS',
          high: '0.0007255',
          last: '0.0006975',
          low: '0.0006817',
          name: 'EOS/BTC',
          open: '0.0007206',
          quote_unit: 'BTC',
          quote_volume: '0.564080932',
          volume: '805.44' 
      } 
    }
}
```
</details>

#### Get rates
```javascript
codex.getRates().then((rates) => {
    console.log(rates);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{
  bch: { btc: '0', usdt: '0' },
  btc: { btc: '1', usdt: '4110.6' },
  cdx: { btc: '0', usdt: '0' },
  cpg: { btc: '0.00001216367440276359', usdt: '0.05' },
  eos: { btc: '0.0006969', usdt: '2.8632' },
  eosdac: { btc: '0.00000192', usdt: '0.00028632' },
  eth: { btc: '0.028043', usdt: '115.24' },
  hot: { btc: '0.00000013', usdt: '0.000534378' },
  icx: { btc: '0', usdt: '0' },
  ltc: { btc: '0.00785286819442417165', usdt: '32.28' },
  ncash: { btc: '0.00000058', usdt: '0.002384148' },
  omg: { btc: '0.0003668', usdt: '1.51068116' },
  snt: { btc: '0.00000464', usdt: '0.0190768296' },
  trx: { btc: '0', usdt: '0' },
  usdt: { btc: '0.00024327348805527174', usdt: '1' },
  ven: { btc: '0', usdt: '0' },
  xtz: { btc: '0.00013128', usdt: '0.539639568' },
  zrx: { btc: '0.00009499', usdt: '0.390465894' } 
}
```
</details>

#### Get currencies
```javascript
codex.getCurrencies().then((currencies) => {
    console.log(currencies);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { id: 3,
    code: 'ETH',
    title: 'Ethereum',
    confirms: 12,
    precision: 18,
    trade_precision: 18,
    state: 'active',
    is_deposits_enabled: true,
    is_withdraws_enabled: true,
    is_fiat: false,
    platform: 
     { id: 3,
       title: 'Ethereum',
       explorer_link: 'https://etherscan.io/tx/',
       base_currency: [Object] } },
  { id: 1,
    code: 'BTC',
    title: 'Bitcoin',
    confirms: 3,
    precision: 8,
    trade_precision: 8,
    state: 'active',
    is_deposits_enabled: true,
    is_withdraws_enabled: true,
    is_fiat: false,
    platform: 
     { id: 1,
       title: 'Bitcoin',
       explorer_link: 'https://www.blockchain.com/btc/tx/',
       base_currency: [Object] } } ]
```
</details>

#### Get markets
```javascript
codex.getMarkets().then((markets) => {
    console.log(markets);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { id: 1,
    title: 'ethbtc',
    base_currency: 
     { id: 3,
       code: 'ETH',
       title: 'Ethereum',
       confirms: 0,
       precision: 0,
       trade_precision: 0,
       state: 'active',
       is_deposits_enabled: false,
       is_withdraws_enabled: false,
       is_fiat: false },
    quote_currency: 
     { id: 1,
       code: 'BTC',
       title: 'Bitcoin',
       confirms: 0,
       precision: 0,
       trade_precision: 0,
       state: 'active',
       is_deposits_enabled: false,
       is_withdraws_enabled: false,
       is_fiat: false },
    base_precision: 4,
    quote_precision: 6,
    maker_fee: '0.01',
    taker_fee: '0.01',
    is_enabled: true,
    is_trade_mineable: true,
    min_order_amount: '0.000100000000000000' },
  { id: 2,
    title: 'eosbtc',
    base_currency: 
     { id: 9,
       code: 'EOS',
       title: 'Eos-Network',
       confirms: 0,
       precision: 0,
       trade_precision: 0,
       state: 'active',
       is_deposits_enabled: false,
       is_withdraws_enabled: false,
       is_fiat: false },
    quote_currency: 
     { id: 1,
       code: 'BTC',
       title: 'Bitcoin',
       confirms: 0,
       precision: 0,
       trade_precision: 0,
       state: 'active',
       is_deposits_enabled: false,
       is_withdraws_enabled: false,
       is_fiat: false },
    base_precision: 2,
    quote_precision: 7,
    maker_fee: '0.001',
    taker_fee: '0.001',
    is_enabled: true,
    is_trade_mineable: false,
    min_order_amount: '0.000000000000000000' } ]
```
</details>

#### Get deposit address
```javascript
codex.getDepositAddress('eos').then((address) => {
    console.log(address);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
{ address: 'codexdeposit',
  currency_code: 'EOS',
  expected_tag: '0736ee99-2bef-5e71-b789-f822359667e9' }

```
</details>

#### Withdraw
```javascript
codex.withdraw('eos', 'binancecleos', 50, '106518724').then((withdraw) => {
    console.log(withdraw);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js

{"id":970,"uuid":"77febdde-a4bd-4128-9926-c7c7c105d520","usr_uuid":"22eh7379-8885-431d-8f65-c12452ec04d6","currency_code":"EOS","status":"created","amount":"50","tx_hash":"","confirmations":0,"source":"transfer","created_at":1553082968}
```
</details>

#### Get withdraw history
```javascript
codex.withdrawHistory('btc').then((withdrawHistory) => {
    console.log(withdrawHistory);
}).catch((error) => {
    console.error(error);
});
```
<details>
 <summary>View Response</summary>
 
```js
[ { id: 217,
    uuid: 'ae1820ac-a3d5-4ab6-a125-2d9e0935c930',
    usr_uuid: '22ac7379-8885-431d-8f65-c12992ec04d6',
    currency_code: 'BTC',
    status: 'done',
    amount: '8',
    tx_hash: '5e5f8f0b6b3fd8726b297ac377064dfe733f541bca1f57ad97b6ab079305cf53',
    confirmations: 0,
    source: 'blockchain',
    created_at: 1542115899 } ]

```
</details>

## WebSocket API

#### Connection
```javascript
codex.websocket.connect(callback);
```

#### Disconnection
```javascript
codex.websocket.disconnect();
```

#### Start get order book for market
```javascript
codex.websocket.startGetOrderBook('cdxbtc');
```

#### Stop get order book for market
```javascript
codex.websocket.stopGetOrderBook('cdxbtc');
```

#### Start get tickers
```javascript
codex.websocket.startGetTickers();
```

#### Stop get tickers
```javascript
codex.websocket.stopGetTickers();
```

#### Start get trades for market
```javascript
codex.websocket.startGetTrades('cdxbtc');
```

#### Stop get trades for market
```javascript
codex.websocket.stopGetTrades('cdxbtc');
```
