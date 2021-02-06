import React, { Component } from "react";
import { Context } from "../Context/Context";
import MenuGateway from "../Models/MenuGateway";
import ManageOrdersView from "../Views/ManageOrdersView";
import MenuView from "../Views/MenuView";

//Controller da página de cardápio
export default class Menu extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Bind funções criadas
    this.getOpenOrders = this.getOpenOrders.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
  }

  async getOrderStatus(){
  }
  async getOpenOrders() {
  }

  render() {
    //const { user, setShoppingCart } = this.context;
    const { getOrderStatus, getOpenOrders } = this;

    return <ManageOrdersView getOrderStatus={getOrderStatus} getOpenOrders={getOpenOrders} />;
  }
}
