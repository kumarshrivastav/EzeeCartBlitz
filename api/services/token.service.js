import jwt from "jsonwebtoken";
class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, "mysecretkey", { expiresIn: "7d" });
    const refreshToken = jwt.sign(payload, "mysecretkey", { expiresIn: "21d" });
    return { accessToken, refreshToken };
  }
  verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, "mysecretkey");
  }
  verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, "mysecretkey");
  }
}

export default new TokenService();
