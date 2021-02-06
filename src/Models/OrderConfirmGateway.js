import api, { defaultError } from "../Services/api";

export default class OrderConfirmGateway {
  async makeOrder(orderData) {
    var returnData;

    await api
      .post("orders", orderData)
      .then((response) => {
        const { data } = response;

        returnData = data;
      })
      .catch((e) => {
        defaultError(e)
        //console.error(e);
        returnData = { error: true };
      });

    return returnData;
  }
}
