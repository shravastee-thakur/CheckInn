export const sendAuthResponse = (res, tokens, user, message = "Success") => {
  return res
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message,
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.isVerified,
      },
    });
};
