const { COIN_MARKET_CAP_URL } = process.env;
module.exports = async (req, res, next) => {
  try {
    var options = {
      method: "GET",
      url: COIN_MARKET_CAP_URL,
    };
    const data = await axios(options);
    return res.json({
      status: 200,
      message: messages.success,
      data: data.data,
    });
  } catch (error) {
    next(error);
  }
};
