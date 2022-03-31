exports.filter = {
  includeAttributes: (model) => {
    if (!model) return;
    const includedAttributes = Object.keys(model.tableAttributes).filter(
      (attr) => model.excludedAttributes.indexOf(attr) == -1
    );
    return includedAttributes;
  },
  excludeAttributes: (items, excludedAttributes, includedAttributes) => {
    if (!items) return items;
    if (!excludedAttributes || excludedAttributes.length <= 0) return items;
    excludedAttributes =
      typeof excludedAttributes === "string"
        ? Array(excludedAttributes)
        : excludedAttributes;

    includedAttributes =
      typeof includedAttributes === "string"
        ? Array(includedAttributes)
        : !includedAttributes
        ? []
        : includedAttributes;
    excludedAttributes = excludedAttributes.filter(
      (attr) => includedAttributes.indexOf(attr) == -1
    );
    Object.keys(items.dataValues).forEach((attr) => {
      const index = excludedAttributes.indexOf(attr);
      if (index >= 0) {
        delete items.dataValues[attr];
      }
    });
    return items;
  },
};
