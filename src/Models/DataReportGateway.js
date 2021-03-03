import api, { defaultError } from "../Services/api";

export default class DataReportGateway {
  async getReport(report) {
    const reportUrl = "reports/" + report;
    var returnData = [];

    await api
      .get(reportUrl)
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}

export const REPORTS = {
  ORDERS: "orders",
  REVENUE: "revenue",
  ORDER_ITEMS: "items",
  RESERVATIONS: "reservations",
  CLIENTS: "clients",
  DELIVERIES: 'deliveries'
};
