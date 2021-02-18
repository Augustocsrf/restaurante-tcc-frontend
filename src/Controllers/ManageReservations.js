import { Component } from "react";
import ManageReservationsView from "../Views/ManageReservationsView";
import ManageReservationsGateway from "../Models/ManageReservationsGateway";
import { Context } from "../Context/Context";
import { Redirect } from "react-router-dom";

export default class ManageReservations extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

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

    //Se um usuário não for nem funcionário nem amdinistrador
    if (!user.isUserStaff() && !user.isUserAdmin()) {
      return <Redirect to="/login" />;
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
