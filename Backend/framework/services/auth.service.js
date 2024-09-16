import bcrypt from "bcryptjs";
import * as jose from "jose";
import xconf from "#xconf";
const secret = new TextEncoder().encode(xconf.jwtSecret);

export default function authService() {
  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const compare = (password, hashedPassword) =>
    bcrypt.compareSync(password, hashedPassword);

  const verify = (token) => jose.jwtVerify(token, secret);

  const generateToken = (data) => {
    return new jose.SignJWT(data)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);
  };

  return {
    encryptPassword,
    compare,
    verify,
    generateToken,
  };
}
