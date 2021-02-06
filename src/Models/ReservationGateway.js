import api, { defaultError } from "../Services/api";

export default class ReservationGateway {
  async getReservations() {
    await api
      .get("/reservation/getOpenReservations.php")
      .then((response) => {})
      .catch((e) => {
        console.error(e);
      });
  }

  async makeReservation(reservationData) {
    var returnInformation;

    await api
      .post("reservations", reservationData)
      .then((response) => {
        console.log(response);
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
    var returnInformation;

    await api
      .get("reservations/occupation")
      .then((response) => {
        const { data } = response;
        returnInformation = data;
      })
      .catch((e) => {
        console.error(e);
        returnInformation = { message: "Houve um erro com a conexão do servidor, tente novamente mais tarde" };
      });

    return returnInformation;
  }
}
