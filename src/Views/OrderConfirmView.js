import { Component } from "react";
import LoadingIcon from "../Components/LoadingIcon";
import "../Styles/OrderConfirm.css";

export default class OrderConfirmView extends Component {
  state = {
    loading: false,
  };

  constructor(props) {
    super(props);

    this.confirmPurchase = this.confirmPurchase.bind(this);
  }

  async confirmPurchase() {
    const { cart } = this.props;
    const paymentData = cart.getPaymentData();
    const deliveryData = cart.getDeliveryData();

    const items = cart.getCart();
    const totalCost = cart.totalCost();
    const { paymentType, cashToPay } = paymentData;
    const { deliveryType, deliveryAddress } = deliveryData;
    const { id: deliveryAddressId } = deliveryAddress;

    const orderData = {
      //Items que serão pedidos
      items,
      totalCost,

      //Informações do pagamento do usuário
      paymentMethod: paymentType,
      cash: cashToPay,

      //Informações da entrega do pedido
      deliveryMethod: deliveryType,
      deliveryAddressId,
    };

    this.setState({ loading: true });

    await this.props.makeOrder(orderData);

    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;
    const { cart } = this.props;
    const paymentData = cart.getPaymentData();
    const deliveryData = cart.getDeliveryData();

    return (
      <div className="AppBackground">
        <main className="orderInformation">
          <h2>Confirmar pedido</h2>
          {/* Lista de items a serem pedidos */}
          <div className="itemsOrderedInformation">
            <h3>Pedido</h3>
            <ul className="cartList">
              {cart.getCart().map((item, index) => {
                return (
                  <li key={index} className="cartItems">
                    <p>
                      {item.quantity}x {item.name}
                    </p>
                    <p className="itemComment">{item.comment}</p>
                  </li>
                );
              })}
            </ul>

            <p className="totalPriceText">
              Total: R$ {cart.totalCost().toFixed(2)}
            </p>
          </div>
          <div className="divisionLine" />

          {/* Especificações de pagamento e entrega */}
          <div className="orderSpecificationInformation">
            <h4>Informações de Pagamento</h4>
            {paymentData.isCardPayment ? (
              <p>Pagamento por cartão</p>
            ) : (
              <div>
                <p>Pagamento em dinheiro</p>
                <p>Pagamento: R$ {paymentData.cashToPay.toFixed(2)}</p>
                <p>Troco: R$ {paymentData.change.toFixed(2)}</p>
              </div>
            )}

            <h4>Informações de Entrega</h4>
            {deliveryData.isDelivery ? (
              <p>Entrega em: {deliveryData.deliveryAddressText} </p>
            ) : (
              <p>
                Obter no local <br /> (Pedido deve estar pronto em 30 minutos)
              </p>
            )}
          </div>

          <div className="divisionLine" />

          {/* Botão para a confirmação do pedido */}
          {loading ? (
            <LoadingIcon confirmButton={true} />
          ) : (
            <button
              className="proceedPurchaseButton"
              onClick={this.confirmPurchase}
            >
              Confirmar Compra
            </button>
          )}
        </main>
      </div>
    );
  }
}
