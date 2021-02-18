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

    if(responseData.error){
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

    if( cart.isEmpty() || !user.isUserClient() ){
      return <Redirect to='/cardapio' />
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
