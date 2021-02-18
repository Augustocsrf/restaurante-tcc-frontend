import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context/Context";
import UserAddressesGateway from "../Models/UserAddressesGateway";
import UserAddressesView from "../Views/UserAddressesView";

//Controller da tela de login do funcionário
export default class UserAddresses extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.getAddresses = this.getAddresses.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.registerAddress = this.registerAddress.bind(this);
  }

  async getAddresses() {
    const { user } = this.context;

    const gateway = new UserAddressesGateway();
    let address = await gateway.getAddresses({ id: user.id });

    if (!address.error) {
      return address;
    } else {
      return [];
    }
  }

  async deleteAddress(id) {
    const gateway = new UserAddressesGateway();

    let responseData = await gateway.deleteAddress({ id });

    return responseData;
  }

  async registerAddress(addressData) {
    //Adicionar id do usuário para as informações a serem enviadas
    const { user } = this.context;
    addressData.id = user.id;

    const gateway = new UserAddressesGateway();
    let responseData = await gateway.registerAddress(addressData);

    if (responseData.error) {
      alert(responseData.message);
    }

    return responseData;
  }

  render() {
    const { user } = this.context;

    //Caso o usuário não tenha nenhum id (o que quer que o usuário não está logado)
    // Ou se o usuário estiver logado, mas não for um cliente, mandar o usuário para a tela de login ao invés desta
    if (user.id === 0 || (user.id !== 0 && !user.isUserClient())) {
      return <Redirect to="/login" />;
    }

    return (
      <UserAddressesView
        user={user}
        getAddresses={this.getAddresses}
        deleteAddress={this.deleteAddress}
        registerAddress={this.registerAddress}
      />
    );
  }
}
