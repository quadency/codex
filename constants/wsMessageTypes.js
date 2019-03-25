const wsMessageTypes = {
    AUTH: 'auth',
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    BALANCE: 'balance',
    TRADE_PRIVATE: 'trade_private',
    TRADE: 'trade',
    TOKEN_AUTH_REQUEST: 'token_auth_request',
    TOKEN_AUTH: 'token_auth',
    ORDER_BOOK: 'order_book',
    API_TOKEN_AUTHORIZE_REQUESTED: 'api_token_authorize_requested',
    AUTHORIZED: 'authorized',
};

module.exports = wsMessageTypes;