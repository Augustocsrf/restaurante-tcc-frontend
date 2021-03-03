import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import ManageStaffView from "../Views/ManageStaffView";
import ManageStaffGateway from "../Models/ManageStaffGateway";

export default class ManageStaff extends Component {
  static contextType = Context;
  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.getStaff = this.getStaff.bind(this);
    this.updateStaff = this.updateStaff.bind(this);
  }

  async getStaff() {
    const gateway = new ManageStaffGateway();
    const staff = await gateway.getStaff();

    return staff;
  }

  async updateStaff(staffData) {
    const gateway = new ManageStaffGateway();
    const response = await gateway.updateStaff(staffData);

    return response;
  }

  async deleteStaff(id) {
    const gateway = new ManageStaffGateway();
    const returnData = await gateway.deleteStaff(id);

    return returnData;
  }

  async createStaff(staffData) {
    const gateway = new ManageStaffGateway();
    var response = await gateway.createStaff(staffData);

    if (response.requestConfirmation) {
      //Pedir confirmação do usuário para adicionar permissão de funcionário para um usuário que já existe
      const confirmation = window.confirm(response.message);

      //Se o usuário administrador confirmar que quer atualizar o
      if (confirmation) {
        staffData.allowUpdate = true;

        response = await gateway.createStaff(staffData);
      } else {
        response.error = true;
      }
    }

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
      <ManageStaffView
        getStaff={this.getStaff}
        deleteStaff={this.deleteStaff}
        updateStaff={this.updateStaff}
        createStaff={this.createStaff}
      />
    );
  }
}
