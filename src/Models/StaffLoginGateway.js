import api, { defaultError } from "../Services/api";

export default class StaffLoginGateway {
  async performLogin(userData) {
    const requestBody = JSON.stringify(userData);
    var returnUserData;

    await api
      .post("login/staff", requestBody)
      .then((response) => {
        const { data } = response;
        console.log(response);

        //Obter dados do usuário recebido e traduzir eles para os nomes esperados
        const {
          id,
          email,
          name,
          lastName,
          permission,
          api_token: apiToken
        } = data;

        api.defaults.headers.common["Authorization"] = "Bearer " + apiToken;

        const user = {
          id,
          email,
          name,
          lastName,
          apiToken,
          permission: permission,
        };

        returnUserData = user;        
      })
      .catch((e) => {
        defaultError(e);

        returnUserData = {
          error: true
        };
      });

    return returnUserData;
  }
}
