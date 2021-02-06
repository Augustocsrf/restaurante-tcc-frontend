import api, { defaultError } from "../Services/api";

export default class ManageReservationsGateway {
  async getOpenReservations() {
    var returnData = [];

    await api
      .get("reservations/open")
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async getReservationStatuses() {
    var returnData = [];

    await api
      .get("reservations-statuses")
      .then((response) => {
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }

  async updateReservationStatus(reservation) {
    var requestBody = { status: reservation.reservation_status };
    var returnData = { error: true };

    await api
      .put("reservations/" + reservation.id, requestBody)
      .then((response) => {
        console.log(response);
        returnData = response.data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnData;
  }
}
