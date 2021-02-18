import React, { Component } from "react";
import { Context } from "../Context/Context";
import ManageOrdersGateway from "../Models/ManageOrdersGateway";
import ManageOrdersView from "../Views/ManageOrdersView";

//Controller da página de cardápio
export default class Menu extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

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
    //const { user, setShoppingCart } = this.context;
    const { updateOrder, getOrdersStatuses, getOpenOrders } = this;

    return (
      <ManageOrdersView
        updateOrder={updateOrder}
        getOpenOrders={getOpenOrders}
        getOrdersStatuses={getOrdersStatuses}
      />
    );
  }
}
