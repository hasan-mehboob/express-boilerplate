const constants = {
  PUBLIC_ROUTES: [
    {
      methods: ["GET", "POST"],
      path: /^(.+)?\/public\/?(.+)?/,
    },
    {
      methods: ["GET"],
      path: /^(.+)?\/login\/?(.+)?/,
    },
    {
      methods: ["POST", "PATCH", "GET"],
      path: /^(.+)?\/auth\/?(.+)?/,
    },
  ],
  SIGNUP_STAGES: {
    VERIFY_CODE: "verifyCode",
    COMPLETE_PROFILE: "completeProfile",
    SUCCESS: "success",
  },
  USER_ROLE: {
    USER: "Users",
    ADMIN: "Admins",
  },
  GRAPHQL_PATH: "/graphql",
  PUBLIC_GRAPHQL_ROUTES: {
    Query: [],
    Mutation: ["login", "signup"],
  },
};
module.exports = constants;

global.constants = constants;
