import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";
import { removeCredentials } from "../Services/authentication";

import UserProfileView from "../Views/UserProfileView";
import UserProfileGateway from "../Models/UserProfileGateway";

//Controller da tela de login do funcionário
export default class UserProfile extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Perfil";

    this.logout = this.logout.bind(this);
    this.getClientsOpenOrdersAndReservations = this.getClientsOpenOrdersAndReservations.bind(
      this
    );
    this.cancelReservation = this.cancelReservation.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);

    this.update = this.update.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.confirmEmail = this.confirmEmail.bind(this);
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

  async update(updateData) {
    const { user, setUser } = this.context;
    updateData.id = user.id;

    const gateway = new UserProfileGateway();
    const response = await gateway.updateUser(updateData);

    // Caso a atualização tenha ocorrido com sucesso, atualizar os valores do usuário localmente com os valores recebidos
    if (!response.error) {
      setUser(response);
    }

    return response;
  }

  async updatePassword(updateData) {
    const validated = this.validatePassword(updateData);

    if (validated) {
      const { user } = this.context;
      updateData.id = user.id;

      const gateway = new UserProfileGateway();
      const response = await gateway.updatePassword(updateData);

      return response;
    }
  }

  async confirmEmail(code) {
    const { user, setUser } = this.context;

    const gateway = new UserProfileGateway();
    const response = await gateway.confirmEmail(code);

    // Caso a atualização tenha ocorrido com sucesso, atualizar os valores do usuário localmente com os valores recebidos
    if (!response.error) {
      setUser({ ...user, email_verified_at: response.email_verified_at });
    }

    return response;
  }

  logout() {
    const { setUser } = this.context;
    setUser();
    removeCredentials();
    this.props.history.push("/");
  }

  //Realizar validação dos dados
  validatePassword(passwordData) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
    const { password, passwordConfirm } = passwordData;

    //Fazer uma validação da senha informada para ter entre 8 e 12 valores com simbolos ou numeros
    if (regexPassword.test(password)) {
      //Verificar se a senha é igual a senha de confirmação
      let passwordValidation = passwordConfirm === password;

      //Se a validação funcionar, prosseguir com o cadastro, se não, retornar erro
      if (passwordValidation) {
        return true;
      } else {
        alert("Senha e a confirmação de senha devem ser iguais");
        return false;
      }
    } else {
      //Alertar o usuário que a senha informada não atende as especificações
      alert("Senha deve ter pelo menos 7 digitos e 1 numero");
    }

    return false;
  }

  render() {
    const { user } = this.context;

    //Verificar se o usuário está logado. Se não estiver, retornar para a página de login
    if (user.isUserGuest()) {
      alert("Você precisa estar logado para acessar essa página");
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
        updatePassword={this.updatePassword}
        update={this.update}
        confirmEmail={this.confirmEmail}
      />
    );
  }
}
