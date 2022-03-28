module.exports = async (payload) => {
  const userSocial = await models.UserSocialAccounts.create(payload);
  return userSocial;
};
