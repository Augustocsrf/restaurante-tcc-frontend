import { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import OrderConfirmGateway from "../Models/OrderConfirmGateway";
import OrderConfirmView from "../Views/OrderConfirmView";

export default class OrderConfirm extends Component {
  static contextType = Context;

  state = {
    orderFinished: false,
  };

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.makeOrder = this.makeOrder.bind(this);
  }

  async makeOrder(orderData) {
    const { user, emptyShoppingCart } = this.context;
    orderData.id = user.id;

    const gateway = new OrderConfirmGateway();
    let responseData = await gateway.makeOrder(orderData);

    if (!responseData.error) {
      this.setState({ orderFinished: true });
      alert("Pedido Feito com sucesso!");
      emptyShoppingCart();
      this.props.history.push("/cardapio");
    }
  }

  render() {
    const { cart, user } = this.context;
    const { orderFinished } = this.state;

    //Verificar se o carrinho está vazio antes da finalização do pedido. Se estiver, retornar para a página de cardápio
    if (cart.isEmpty() && !orderFinished) {
      alert("O seu carrinho está vazio. Adicione items para prosseguir.");
      return <Redirect to="/cardapio" />;
    }

    //Verificar se o usuário está logado. Se não estiver, retornar para a página de cardápio
    if (user.isUserGuest()) {
      alert("Você precisa estar logado para acessar essa página");
      return <Redirect to="/cardapio" />;
    }

    return <OrderConfirmView cart={cart} makeOrder={this.makeOrder} />;
  }
}
