import api, { defaultError } from "../Services/api";

export default class ManageOrdersGateway {
  async getOpenOrders() {
    var returnData = [];

    await api
      .get("orders/open-orders")
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async getOrderStatuses() {
    var returnData = [];

    await api
      .get("order-status")
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async updateOrder(orderData) {
    var returnData = { error: true };

    await api
      .put("orders/" + orderData.id, orderData)
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}
