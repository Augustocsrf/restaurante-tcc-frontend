import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageOrderStatusGateway from "../Models/ManageOrderStatusGateway";
import ManageOrderStatusView from "../Views/ManageOrderStatusView";

//Controller da tela de gerência de estados de pedidos
export default class ManageOrderStatus extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Gerenciar Categorias";

    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.deleteOrderStatus = this.deleteOrderStatus.bind(this);
    this.createOrderStatus = this.createOrderStatus.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
  }

  //Método para obter os estados criados no momento
  async getOrderStatus() {
    const gateway = new ManageOrderStatusGateway();
    let orderStatus = await gateway.getOrderStatus();

    return orderStatus;
  }

  //Método para deletar estado de pedido
  async deleteOrderStatus(id) {
    const gateway = new ManageOrderStatusGateway();
    let response = await gateway.deleteOrderStatus(id);

    return response;
  }

  //Método para atualizar estado de pedido
  async updateOrderStatus(statusData) {
    const gateway = new ManageOrderStatusGateway();
    let response = await gateway.updateOrderStatus(statusData);

    return response;
  }

  //Método para criar um novo estado de pedido
  async createOrderStatus(statusData) {
    const gateway = new ManageOrderStatusGateway();
    let response = await gateway.createOrderStatus(statusData);

    return response;
  }

  render() {
    const { user } = this.context;

    //Apenas permitir acesso a usuário administrador.
    // Se um usuário que não for administrador tentar entrar, redirecionar o usuário para outra página
    if (!user.isUserAdmin()) {
      alert("Você não tem permissão para acessar essa página");
      return <Redirect to="/" />;
    }

    return (
      <ManageOrderStatusView
        getOrderStatus={this.getOrderStatus}
        updateOrderStatus={this.updateOrderStatus}
        deleteOrderStatus={this.deleteOrderStatus}
        createOrderStatus={this.createOrderStatus}
      />
    );
  }
}
