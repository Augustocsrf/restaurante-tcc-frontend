import React, { Component } from "react";
import { Context } from "../Context/Context";
import StaffLoginForm from "../Views/StaffLoginForm";
import StaffLoginGateway from "../Models/StaffLoginGateway";
import { Redirect } from "react-router-dom";

//Controller da tela de login do funcionário
export default class StaffLogin extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      logged: false,
    };

    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin(loginCredentials) {
    const { setUser } = this.context;
    const gateway = new StaffLoginGateway();
    let userData = await gateway.performLogin(loginCredentials);

    if(!userData.error){
      setUser(userData);
    }
  }

  render() {
    const { user } = this.context;

    //Verificar se já há um usuário
    if(!user.isUserClient() && !user.isUserGuest()){
      return <Redirect to='/funcionario/pedidos'/>
    }

    return <StaffLoginForm handleLogin={this.handleLogin} />;
  }
}
