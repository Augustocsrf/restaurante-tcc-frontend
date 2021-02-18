import { Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context/Context";
import OrderConfirmGateway from "../Models/OrderConfirmGateway";
import OrderConfirmView from "../Views/OrderConfirmView";

export default class OrderConfirm extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.makeOrder = this.makeOrder.bind(this);
  }

  async makeOrder(orderData){
    const { user, emptyShoppingCart } = this.context
    orderData.id = user.id;

    const gateway = new OrderConfirmGateway();
    let responseData = await gateway.makeOrder(orderData);

    if(!responseData.error){
      alert("Pedido Feito com sucesso!")
      emptyShoppingCart();
      this.props.history.push('/cardapio')
    }
  }

  render() {
    const { cart, user } = this.context;

    if( cart.isEmpty() || !user.isUserClient() ){
      return <Redirect to='/cardapio' />
    }

    return <OrderConfirmView cart={cart} makeOrder={this.makeOrder} />;
  }
}
