const { COIN_MARKET_CAP_URL } = process.env;
module.exports = async (req, res, next) => {
  try {
    var options = {
      method: "GET",
      url: COIN_MARKET_CAP_URL,
    };
    const data = await axios(options);
    return data;
  } catch (error) {
    next(error);
  }
};
