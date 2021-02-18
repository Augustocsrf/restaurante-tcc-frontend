import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context/Context";
import UserProfileView from "../Views/UserProfileView";
import UserProfileGateway from "../Models/UserProfileGateway";
import { removeCredentials } from "../Services/authentication";

//Controller da tela de login do funcionário
export default class UserProfile extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.logout = this.logout.bind(this);
    this.getClientsOpenOrdersAndReservations = this.getClientsOpenOrdersAndReservations.bind(
      this
    );
    this.cancelReservation = this.cancelReservation.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  async getClientsOpenOrdersAndReservations() {
    const { user } = this.context;
    const { id } = user;
    const gateway = new UserProfileGateway();

    //Obter informações dos pedidos em aberto do usuário
    const openOrders = await gateway.getOpenOrdersOfClient(id);

    //Obter informações das reservas em aberto do usuário
    const openReservations = await gateway.getOpenReservationsOfClient(id);

    return {
      openOrders,
      openReservations,
    };
  }

  async cancelReservation(reservationData) {
    const gateway = new UserProfileGateway();
    const returnData = await gateway.cancelReservation({
      id: reservationData.id,
    });

    return returnData;
  }

  async cancelOrder(orderData) {
    const gateway = new UserProfileGateway();
    const returnData = await gateway.cancelOrder({ id: orderData.id });

    return returnData;
  }

  logout() {
    const { setUser } = this.context;
    setUser();
    removeCredentials();
    this.props.history.push("/");
  }

  render() {
    const { user } = this.context;

    //Caso o usuário não tenha nenhum id (o que quer que o usuário não está logado)
    // Ou se o usuário estiver logado, mas não for um cliente, mandar o usuário para a tela de login ao invés desta
    if (user.id === 0) {
      return <Redirect to="/login" />;
    }

    return (
      <UserProfileView
        user={user}
        logout={this.logout}
        getClientsOpenOrdersAndReservations={
          this.getClientsOpenOrdersAndReservations
        }
        cancelReservation={this.cancelReservation}
        cancelOrder={this.cancelOrder}
      />
    );
  }
}
