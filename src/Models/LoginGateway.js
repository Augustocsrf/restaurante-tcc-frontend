
import { USER_PERMISSIONS } from "../DataTypes/User";
import api, { defaultError } from "../Services/api";

//Model da tela de registro
export default class LoginGateway {
  async performLogin(userData) {
    var returnUserData;

    await api
      .post("login/client", userData)
      .then((response) => {
        console.log(response.data)
        const { id, email, name, lastName, phone, api_token: apiToken  } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
        };

        api.defaults.headers.common["Authorization"] = "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true }
      });

    return returnUserData;
  }

  async performRegister(registerData) {
    var returnUserData;

    await api
      .post("register", registerData)
      .then((response) => {
        console.log(response)
        //Obter dados do usuário recebido e traduzir eles para os nomes esperados
        const { id, api_token: apiToken } = response.data;

        const { email, name, lastName, phone } = registerData;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
        };

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true }
      });

    return returnUserData;
  }

  async loginGoogle(googleData){
    var returnUserData;

    await api
      .post("login/google", googleData)
      .then((response) => {
        console.log(response.data)
        const { id, email, name, lastName, phone, api_token: apiToken  } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
        };

        api.defaults.headers.common["Authorization"] = "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true }
      });

    return returnUserData;
  }
}
