const jwt = require("jsonwebtoken");
const axios = require("axios");

console.log("DOTARŁEM DO verifyToken.js");

let cachedKey = null;

async function getPublicKey(token) {
  const jwks = await axios.get('http://keycloak:8080/auth/realms/esport/protocol/openid-connect/certs');
  const decodedHeader = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
  const key = jwks.data.keys.find(k => k.kid === decodedHeader.kid);

  if (!key) throw new Error("Nie znaleziono pasującego klucza publicznego");

  return `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
}


const verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Brak tokena" });
  }

  const token = auth.split(" ")[1];

  try {
    console.log("\nWERYFIKACJA TOKENA 🔍");
    console.log("Auth header:", auth);

    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    console.log("Header JWT:", header);

    const jwks = await axios.get('http://keycloak:8080/auth/realms/esport/protocol/openid-connect/certs');
    const key = jwks.data.keys.find(k => k.kid === header.kid);
    if (!key) throw new Error("Nie znaleziono pasującego klucza publicznego");

    const publicKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
    console.log("Używany klucz publiczny:", publicKey);

    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
    console.log("JWT ZWERYFIKOWANY. Payload:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT NIEZWERYFIKOWANY:", err.message);
    return res.status(403).json({ message: "Nieprawidłowy token", error: err.message });
  }
};


module.exports = verifyToken;
