import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageOrdersGateway from "../Models/ManageOrdersGateway";
import ManageOrdersView from "../Views/ManageOrdersView";

//Controller da página de cardápio
export default class Menu extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Gerenciar Pedidos";

    //Bind funções criadas
    this.updateOrder = this.updateOrder.bind(this);
    this.getOpenOrders = this.getOpenOrders.bind(this);
    this.getOrdersStatuses = this.getOrdersStatuses.bind(this);
  }

  async getOpenOrders() {
    const gateway = new ManageOrdersGateway();
    const orders = await gateway.getOpenOrders();

    return orders;
  }

  async getOrdersStatuses() {
    const gateway = new ManageOrdersGateway();
    const orderStatus = await gateway.getOrderStatuses();

    return orderStatus;
  }

  async updateOrder(orderData) {
    const gateway = new ManageOrdersGateway();
    const response = await gateway.updateOrder(orderData);

    return response;
  }

  render() {
    const { user } = this.context;
    const { updateOrder, getOrdersStatuses, getOpenOrders } = this;

    //Apenas permitir acesso a usuário administrador ou funcionário.
    // Se um usuário que não tiver obtido essa permissão tentar entrar, redirecionar o usuário para outra página
    if (!user.isUserStaff() && !user.isUserAdmin()) {
      alert("Você não tem permissão para acessar essa página");
      return <Redirect to="/" />;
    }

    return (
      <ManageOrdersView
        updateOrder={updateOrder}
        getOpenOrders={getOpenOrders}
        getOrdersStatuses={getOrdersStatuses}
      />
    );
  }
}
