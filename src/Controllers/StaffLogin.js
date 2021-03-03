import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import StaffLoginForm from "../Views/StaffLoginForm";
import StaffLoginGateway from "../Models/StaffLoginGateway";

//Controller da tela de login do funcionário
export default class StaffLogin extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.state = {
      logged: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin(loginCredentials) {
    const { setUser } = this.context;
    const gateway = new StaffLoginGateway();
    let userData = await gateway.performLogin(loginCredentials);

    if (!userData.error) {
      setUser(userData);
    }
  }

  render() {
    const { user } = this.context;

    //Apenas permitir acesso a usuários que ainda não estão logados.
    // Se um usuário já está logado, mandar ele automaticamente para a tela de pedidos
    if (!user.isUserClient() && !user.isUserGuest()) {
      return <Redirect to="/funcionario/pedidos" />;
    }

    return <StaffLoginForm handleLogin={this.handleLogin} />;
  }
}
