exports.get = {
  getProfile: async (req, res, next) => {
    const {
      params: { id },
      user,
    } = req;
    try {
      if (!id)
        return res.json({
          status: 200,
          message: messages.success,
          data: user,
        });
      else {
        const getUserById = await models.Users.findByPk(id);
        return res.json({
          status: 200,
          message: messages.success,
          data: getUserById,
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
