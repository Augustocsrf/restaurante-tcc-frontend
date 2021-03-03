import api, { defaultError } from "../Services/api";

export default class OrderInformationGateway {
  async getAddresses(userData) {
    var returnData;

    await api
      .get("clients/" + userData.id + "/addresses")
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);

        returnData = {
          error: true,
          message: "Erro com a conexão ao servidor",
        };
      });

    return returnData;
  }
}
