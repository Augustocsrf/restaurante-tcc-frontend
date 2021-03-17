import api, { defaultError } from "../Services/api";

export default class ReservationGateway {
  async makeReservation(reservationData) {
    var returnInformation;

    await api
      .post("reservations", reservationData)
      .then((response) => {
        const { data } = response;
        data.error = false;
        returnInformation = data;
      })
      .catch((e) => {
        defaultError(e);
        returnInformation = {
          error: true,
          message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
        };
      });

    return returnInformation;
  }

  async getBusyDates() {
    var returnInformation = [];

    await api
      .get("reservations/occupation")
      .then((response) => {
        const { data } = response;
        returnInformation = data;
      })
      .catch((e) => {
        defaultError(e);
      });

    return returnInformation;
  }
}
