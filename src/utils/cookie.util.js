exports.setCookies = ({ res, cookies }) => {
  cookies.forEach(({ cookieName, value, rememberMe }) => {
    res.cookie(cookieName, value, {
      ...(cookieName === "accessToken"
        ? {
            maxAge: parseInt(auth.accessToken.expiry) * 1000,
          }
        : {
            maxAge: rememberMe
              ? parseInt(auth.refreshToken.rememberMeExpiry) * 1000
              : parseInt(auth.refreshToken.expiry) * 1000,
          }),
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  });
};
