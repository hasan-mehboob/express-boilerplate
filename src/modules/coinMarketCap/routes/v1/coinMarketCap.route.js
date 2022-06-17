router.get("/public/coinMarketCap", actions.coinMarketCap.get.getCoinMarketCap);
module.exports = { prefix: "coinMarketCap", router };
