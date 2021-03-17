import { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageReservationsView from "../Views/ManageReservationsView";
import ManageReservationsGateway from "../Models/ManageReservationsGateway";

export default class ManageReservations extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Gerenciar Reservas";

    this.getReservations = this.getReservations.bind(this);
    this.getReservationStatuses = this.getReservationStatuses.bind(this);
    this.updateReservation = this.updateReservation.bind(this);
  }

  async getReservations() {
    const gateway = new ManageReservationsGateway();
    const responseData = await gateway.getOpenReservations();

    return responseData;
  }

  async getReservationStatuses() {
    const gateway = new ManageReservationsGateway();
    const responseData = await gateway.getReservationStatuses();

    return responseData;
  }

  async updateReservation(reservation) {
    const gateway = new ManageReservationsGateway();
    const responseData = await gateway.updateReservationStatus(reservation);

    return responseData;
  }

  render() {
    const { user } = this.context;

    //Apenas permitir acesso a usuário administrador ou funcionário.
    // Se um usuário que não tiver obtido essa permissão tentar entrar, redirecionar o usuário para outra página
    if (!user.isUserStaff() && !user.isUserAdmin()) {
      alert("Você não tem permissão para acessar essa página");
      return <Redirect to="/" />;
    }

    return (
      <ManageReservationsView
        getReservations={this.getReservations}
        getReservationStatuses={this.getReservationStatuses}
        updateReservation={this.updateReservation}
      />
    );
  }
}
