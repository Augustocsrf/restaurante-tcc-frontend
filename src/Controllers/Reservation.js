import { Component } from "react";

import { Context } from "../Context/Context";

import ReservationGateway from "../Models/ReservationGateway";
import ReservationView from "../Views/ReservationView";

export default class Reservation extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.makeReservation = this.makeReservation.bind(this);
    this.getBusyDays = this.getBusyDays.bind(this);
  }

  async makeReservation(reservationData) {
    const { user } = this.context;

    //Caso o usuário seja um cliente, usar o seu id
    // Caso o usuário não seja um cliente, usar um id 0, não conectando a id com o cliente
    if (user.isUserClient()) {
      reservationData.clientId = user.id;
    } else {
      reservationData.clientId = null;
    }

    const gateway = new ReservationGateway();
    let { message, error } = await gateway.makeReservation(reservationData);

    if (!error) {
      alert(message);
      this.props.history.push("/");
    }
  }

  async getBusyDays() {
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
        getBusyDays={this.getBusyDays}
      />
    );
  }
}
