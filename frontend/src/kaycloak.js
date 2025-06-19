import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost/auth",
  realm: "esport",
  clientId: "frontend-client"
});

export default keycloak;
