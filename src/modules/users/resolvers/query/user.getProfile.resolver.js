module.exports = async (root, args, context, info) => {
  const {
    req: { user },
  } = context;
  if (args.id) {
    return await models.Users.findByPk(args.id);
  }
  return user;
};
