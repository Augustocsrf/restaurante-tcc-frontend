import api, { defaultError } from "../Services/api";

export default class ManageOrderStatusGateway {
  async getOrderStatus() {
    var returnData = [];

    await api
      .get("order-status")
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async updateOrderStatus(statusData) {
    var returnData = {
      error: true,
    };

    await api
      .put("order-status/" + statusData.id, statusData)
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async deleteOrderStatus(id) {
    var returnData = {
      error: true,
    };

    await api
      .delete("order-status/" + id)
      .then((response) => {
        const { data } = response;

        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async createOrderStatus(statusData) {
    const requestBody = JSON.stringify(statusData);
    var returnData = {
      error: true,
    };

    await api
      .post("order-status", requestBody)
      .then((response) => {
        const { data } = response;
        returnData = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}
