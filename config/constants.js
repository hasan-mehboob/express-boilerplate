const constants = {
  PUBLIC_ROUTES: [
    {
      methods: ["GET", "POST"],
      path: /^.+\/public?.+/,
    },
    {
      methods: ["GET"],
      path: /^.+\/login?.+/,
    },
    {
      methods: ["POST", "PATCH"],
      path: /^.+\/auth?.+/,
    },
  ],
};
module.exports = constants;

global.constants = constants;
