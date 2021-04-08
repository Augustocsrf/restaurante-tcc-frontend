import api, { defaultError } from "../Services/api";

export default class UserAddressesGateway {
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

  async deleteAddress(addressData) {
    var returnData;

    await api
      .delete("addresses/" + addressData.id)
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

  async registerAddress(addressData) {
    var responseData;

    await api
      .post("addresses", addressData)
      .then((response) => {
        responseData = response.data;
      })
      .catch((e) => {
        defaultError(e);

        responseData = {
          error: true,
          message: "Algum erro ocorreu com a conexão ao servidor",
        };
      });

    return responseData;
  }

  async updateAddress(addressData) {
    var responseData;

    await api
      .put("addresses/" + addressData.id, addressData)
      .then((response) => {
        responseData = response.data;
      })
      .catch((e) => {
        defaultError(e);

        responseData = {
          error: true,
        };
      });

    return responseData;
  }
}
