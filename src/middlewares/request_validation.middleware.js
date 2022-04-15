exports.requestValidation = (model) => {
  return (req, res, next) => {
    req.body = _.omit(req.body, models[model].excludedAttributesFromRequest);
    next();
  };
};
