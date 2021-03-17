import { USER_PERMISSIONS } from "../DataTypes/User";
import api, { defaultError } from "../Services/api";

//Model da tela de registro
export default class LoginGateway {
  async performLogin(userData) {
    var returnUserData;

    await api
      .post("login", userData)
      .then((response) => {
        const {
          id,
          email,
          name,
          lastName,
          phone,
          api_token: apiToken,
          permission,
          email_verified_at,
        } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission,
          email_verified_at,
        };

        api.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    return returnUserData;
  }

  async performRegister(registerData) {
    var returnUserData;

    await api
      .post("register", registerData)
      .then((response) => {
        //Obter dados do usuário recebido e traduzir eles para os nomes esperados
        const { id, api_token: apiToken, email_verified_at } = response.data;

        const { email, name, lastName, phone } = registerData;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
          email_verified_at,
        };

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    return returnUserData;
  }

  async loginGoogle(googleData) {
    var returnUserData;

    await api
      .post("login/google", googleData)
      .then((response) => {
        const {
          id,
          email,
          name,
          lastName,
          phone,
          permission,
          email_verified_at,
          api_token: apiToken,
        } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission,
          email_verified_at,
        };

        api.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    return returnUserData;
  }

  // Método para requisitar um código para trocar senha
  async requestPasswordCode(email) {
    var returnUserData;

    await api
      .post("recover-code", { email })
      .then((response) => {
        returnUserData = response.data;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    return returnUserData;
  }

  // Método para requisitar um código para trocar senha
  async verifyPasswordCode(code) {
    var returnUserData;

    await api
      .post("verify-code", { code })
      .then((response) => {
        returnUserData = response.data;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    return returnUserData;
  }

  //Método para atualizar a senha do usuário
  async updatePassword(passwordData) {
    var returnData;

    await api
      .put("clients/" + passwordData.id + "/password", passwordData)
      .then((response) => {
        const { data } = response;
        data.error = false;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
        returnData = { error: true };
      });

    return returnData;
  }
}
