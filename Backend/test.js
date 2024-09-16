// import authService from "./framework/services/auth.service.js";
// let io = authService();

// async function encrypt(payload) {
//   let ias = io.encryptPassword(payload);
//   console.log(ias);
// }
// async function compare(payload) {
//   let cer = io.compare(payload);
//   console.log(cer);
// }

// async function generateToken(payload) {
//   let cer = await io.generateToken(payload);
//   console.log(cer);
// }

// async function verifyToken(payload) {
//   let cer = await io.verify(payload);
//   console.log(cer);
// }
// let payload = {
//   password: "karthik",
//   salt: "cb557426cc2a5317453b4014d4c2e48b",
//   hash: "3340c4167a31ec1787ccfd59d6df34e30e05ce71efcc4a5a91f8a919508f425e",
//   token:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
// };
// encrypt("karthik");
// // compare(payload);
// // generateToken({
// //   data: payload,
// //   tokenCofig: {
// //     duration: 80,
// //   },
// // });

// /**
//  * Code ERR_JWT_EXPIRED - token expired.
//  * Code ERR_JWS_SIGNATURE_VERIFICATION_FAILED - Signature manipulated.
//  * Code ERR_JWS_INVALID - Header corrupt
//  */
// verifyToken(payload).catch((err) => console.log(err.code));
