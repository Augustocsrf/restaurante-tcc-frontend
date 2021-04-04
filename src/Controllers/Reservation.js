import { Component } from "react";

import { Context } from "../Context/Context";

import ReservationGateway from "../Models/ReservationGateway";
import ReservationView from "../Views/ReservationView";

export default class Reservation extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Reserva";

    this.makeReservation = this.makeReservation.bind(this);
    this.getBusyDates = this.getBusyDates.bind(this);
  }

  async makeReservation(reservationData) {
    const { user } = this.context;

    reservationData.clientId = user.id;

    const gateway = new ReservationGateway();
    let { message, error } = await gateway.makeReservation(reservationData);

    if (!error) {
      alert(message);
      this.props.history.push("/");
    }
  }

  async getBusyDates() {
    const gateway = new ReservationGateway();
    const response = await gateway.getBusyDates();

    return response;
  }

  render() {
    const { user } = this.context;

    return (
      <ReservationView
        user={user}
        makeReservation={this.makeReservation}
        getBusyDates={this.getBusyDates}
      />
    );
  }
}
