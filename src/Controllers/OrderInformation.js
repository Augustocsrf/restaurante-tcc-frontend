import { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import OrderInformationGateway from "../Models/OrderInformationGateway";
import OrderInformationView from "../Views/OrderInformationView";

export default class OrderInformation extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.getAddresses = this.getAddresses.bind(this);
    this.proceedToConfirmation = this.proceedToConfirmation.bind(this);
  }

  async getAddresses() {
    const { user } = this.context;
    const gateway = new OrderInformationGateway();

    let responseData = await gateway.getAddresses({ id: user.id });

    if (responseData.error) {
      return [];
    }

    return responseData;
  }

  proceedToConfirmation(orderSpecifications) {
    const { cart } = this.context;
    cart.specifyOrder(orderSpecifications);

    this.props.history.push("/pedido/confirmar");
  }

  render() {
    const { cart, user } = this.context;

    //Verificar se o carrinho está vazio. Se estiver, retornar para a página de cardápio
    if (cart.isEmpty()) {
      alert("O seu carrinho está vazio. Adicione items para prosseguir.");
      return <Redirect to="/cardapio" />;
    }

    //Verificar se o usuário está logado. Se não estiver, retornar para a página de cardápio
    if (user.isUserGuest()) {
      alert("Você precisa estar logado para acessar essa página");
      return <Redirect to="/cardapio" />;
    }

    return (
      <OrderInformationView
        cart={cart}
        getAddresses={this.getAddresses}
        proceedToConfirmation={this.proceedToConfirmation}
      />
    );
  }
}
