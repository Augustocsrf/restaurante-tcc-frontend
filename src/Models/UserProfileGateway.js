import api, { defaultError } from "../Services/api";

export default class UserProfileGateway {
  //Obter endereços do usuário
  async getAddresses(userData) {
    var returnData = [];

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

  //Método para pegar os pedidos abertos do cliente
  async getOpenOrdersOfClient(id) {
    var returnData = [];

    await api
      .get("clients/" + id + "/open-orders")
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  //Método para pegar as reservas abertas do cliente
  async getOpenReservationsOfClient(id) {
    var returnData = [];

    await api
      .get("clients/" + id + "/open-reservations")
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  //Método para cancelar reservas
  async cancelReservation(reservationData) {
    const requestBody = { status: 5 };
    var returnData;

    await api
      .put("reservations/" + reservationData.id, requestBody)
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

  //Método para cancelar pedido
  async cancelOrder(orderData) {
    const requestBody = { status: 5 };
    var returnData;

    await api
      .put("orders/" + orderData.id, requestBody)
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

  //Método para atualizar o cliente
  async updateUser(userData){
    var returnData;

    await api
      .put("clients/" + userData.id, userData)
      .then((response) => {
        const { client } = response.data;
        
        client.apiToken = client.api_token;

        returnData = client;
      })
      .catch((e) => {
        defaultError(e);
        returnData = { error: true };
      });

    return returnData;
  }

  //Método para atualizar a senha do usuário
  async updatePassword(passwordData){
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
