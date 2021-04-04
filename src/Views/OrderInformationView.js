import { Component } from "react";

import { Link } from "react-router-dom";

import { DELIVERY_TYPES } from "../DataTypes/DeliveryTypes";
import { PAYMENT_TYPES } from "../DataTypes/PaymentTypes";

import LoadingIcon from '../Components/LoadingIcon';

import "../Styles/OrderInformation.css";


export default class OrderInformationView extends Component {
  state = {
    loading: false,
    showModal: false,
    showCashInput: false,
    addressList: [],

    deliveryType: 0,
    paymentType: 0,

    deliveryAddress: { id: null },

    cashToPay: 0,
  };

  constructor(props) {
    super(props);

    this.getAddresses = this.getAddresses.bind(this);
    this.showDeliveryOptions = this.showDeliveryOptions.bind(this);
    this.hideDeliveryOptions = this.hideDeliveryOptions.bind(this);
    this.selectPayment = this.selectPayment.bind(this);
    this.selectDelivery = this.selectDelivery.bind(this);
    this.validateProceed = this.validateProceed.bind(this);
    this.proceed = this.proceed.bind(this);
  }

  componentDidMount() {
    this.getAddresses();
  }

  //Método para obter os endereços
  async getAddresses() {
    this.setState({ loading: true })
    let addressList = await this.props.getAddresses();
    this.setState({ addressList, loading: false });
  }

  //Método para mostrar as opções de endereço de entrega
  showDeliveryOptions() {
    this.setState({ showModal: true });
  }

  //Método para esconder as opções de endereço de entrega
  hideDeliveryOptions() {
    this.setState({ showModal: false, deliveryAddress: { id: null } });
  }

  //Método para atualizar o método de entrega do pedido
  selectDelivery(event) {
    const { value } = event.target;
    const deliveryType = Number(value);

    this.setState({ deliveryType });
  }

  //Método para atualizar o método de pagamento do pedido
  selectPayment(event) {
    const { value } = event.target;
    const paymentType = Number(value);

    this.setState({ paymentType });
  }

  //Método para validar se o usuário pode ou não prosseguir com o pedido
  validateProceed() {
    const {
      cashToPay,
      deliveryType,
      deliveryAddress,
      paymentType,
      showCashInput,
    } = this.state;

    const { cart } = this.props;

    //Caso tipo de entrega ou tipo de pagamento não tenham sido selecionados

    if (deliveryType === 0 || paymentType === 0) {
      return true;
    }

    //Caso o usuário tenha selecionado pagamento com dinheiro,
    // verificar se o valor de dinheiro informado seja válido (suficiente para pagar o pedido)
    // Impedir de prosseguir
    if (showCashInput && cashToPay < cart.totalCost()) {
      return true;
    }

    //Caso o usuário tenha selecionado entrega em algum local, perguntar se eles
    // Impedir de prosseguir
    if (
      deliveryType === DELIVERY_TYPES.DELIVERY &&
      deliveryAddress.id === null
    ) {
      return true;
    }

    return false;
  }

  //Método para prosseguir para a tela de confirmação.
  // O método também salva especificando as informações do pedido para o
  proceed() {
    const {
      deliveryType,
      paymentType,
      deliveryAddress,
      cashToPay,
    } = this.state;

    const orderSpecifications = {
      deliveryType,
      paymentType,
      deliveryAddress,
      cashToPay,
    };

    this.props.proceedToConfirmation(orderSpecifications);
  }

  render() {
    const { loading, addressList } = this.state;
    const { cart } = this.props;

    let deliveryOptions = () => {
      if(loading){
        return <LoadingIcon />
      }

      if(addressList.length === 0){
        return <p>Nenhum endereço cadastrado. Selecione para pegar no local ou adicione um novo endereço em seu <Link to='/perfil/enderecos'>perfil</Link>.</p>
      }

      return (
        <div className="addressSelection">
          {addressList.map((item, index) => {
            return (
              <p className="radioButtonParagraph" key={index}>
                <input
                  type="radio"
                  name="deliveryAddress"
                  onClick={() => {
                    const deliveryAddress = item;
                    this.setState({ deliveryAddress });
                  }}
                />
                {item.identification} (
                {item.district + ", " + item.street + ", " + item.number})
              </p>
            );
          })}
        </div>
      );
    };

    return (
      <div className="OrderInformationDiv AppBackground">
        <section className="cartData">
          <h3>Pedido</h3>
          <ul className="cartList">
            {cart.getCart().map((item, index) => {
              return (
                <li key={index} className="cartItems">
                  {item.quantity}x {item.name}
                </li>
              );
            })}
          </ul>

          <p className="totalPriceText">R${cart.totalCost().toFixed(2)}</p>
        </section>

        <main className="orderInformation">
          <h3>Entrega</h3>
          <div className="radioButtonGroup" onChange={this.selectDelivery}>
            <p className="radioButtonParagraph">
              <input
                type="radio"
                name="delivery"
                value={DELIVERY_TYPES.PICK_UP}
                onClick={this.hideDeliveryOptions}
              />
              Pegar no Local
            </p>

            <p className="radioButtonParagraph">
              <input
                type="radio"
                name="delivery"
                value={DELIVERY_TYPES.DELIVERY}
                onClick={this.showDeliveryOptions}
              />
              Entregar
            </p>
          </div>

          {this.state.showModal ? deliveryOptions() : null}

          <div className="divisionLine" />

          <h3>Método de Pagamento</h3>
          <div
            className="radioButtonGroup"
            id="radioButtonGroupPaymentType"
            onChange={this.selectPayment}
          >
            <p className="radioButtonParagraph">
              <input
                type="radio"
                name="payment"
                value={PAYMENT_TYPES.PAYMENT_CARD}
                onClick={() => this.setState({ showCashInput: false })}
              />
              Pagar com Cartão
            </p>

            <p className="radioButtonParagraph">
              <input
                type="radio"
                name="payment"
                value={PAYMENT_TYPES.PAYMENT_CASH}
                onClick={() => this.setState({ showCashInput: true })}
              />
              Pagar com Dinheiro
            </p>
          </div>

          <div className="cashToPayInput">
            {this.state.showCashInput ? (
              <p className="inputParagraph">
                R${" "}
                <input
                  type="number"
                  name="topay"
                  placeholder="Valor a pagar"
                  className="cashInput"
                  value={this.state.cashToPay}
                  onChange={(e) => {
                    const { value } = e.target;
                    const cashToPay = Number(value);
                    this.setState({ cashToPay });
                  }}
                />
              </p>
            ) : null}

            {this.state.showCashInput &&
            this.state.cashToPay < cart.totalCost() ? (
              <p className="toPayValueText">
                O valor não é suficiente para o pagamento
              </p>
            ) : null}
          </div>

          <button
            className="proceedPurchaseButton"
            onClick={this.proceed}
            disabled={this.validateProceed()}
          >
            Prosseguir com pedido
          </button>
        </main>
      </div>
    );
  }
}
