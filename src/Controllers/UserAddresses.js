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

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Endereços";

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
    if(addressData.zip){
      
    }

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

    //Verificar se o usuário está logado. Se não estiver, retornar para a página de login
    if (user.isUserGuest()) {
      alert("Você precisa estar logado para acessar essa página");
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
