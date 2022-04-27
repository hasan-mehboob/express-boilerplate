exports.setCookies = ({ res, cookies }) => {
  cookies.forEach(({ cookieName, value }) => {
    res.cookie(cookieName, value, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  });
};
