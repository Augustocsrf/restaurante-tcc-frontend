import { PAYMENT_TYPES } from "./PaymentTypes";
import { DELIVERY_TYPES } from "./DeliveryTypes";

export default class ShoppingCart {
  //Carrinho
  cart = [];

  //Especificações para pagamento e entrega
  deliveryType = 0;
  paymentType = 0;
  deliveryAddress = {};
  cashToPay = 0;

  constructor() {
    this.totalCost = this.totalCost.bind(this);
    this.isEmpty = this.isEmpty.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);

    this.getPaymentData = this.getPaymentData.bind(this);
    this.getDeliveryData = this.getDeliveryData.bind(this);
  }

  //Calcular custo total do carrinho
  totalCost() {
    let totalPrice = 0;

    this.cart.forEach((item) => {
      totalPrice += item.price;
    });

    return totalPrice;
  }

  //Obter carrinho
  getCart() {
    return this.cart;
  }

  //Adicionar item ao carrinho
  addItem(item) {
    this.cart.push(item);
  }

  //Remover item do carrinho utilizando index
  removeItem(index) {
    this.cart.splice(index, 1);
  }

  //Verificar se o carrinho etá vazio
  isEmpty() {
    return this.cart.length === 0;
  }

  //Método para informar especificações do pedido
  specifyOrder(orderSpecifications) {
    this.deliveryType = orderSpecifications.deliveryType;
    this.paymentType = orderSpecifications.paymentType;
    this.deliveryAddress = orderSpecifications.deliveryAddress;
    this.cashToPay = orderSpecifications.cashToPay;
  }

  //Método para receber um objeto com informações sobre o pagamento do pedido:
  // Tipo de pagamento, dinheiro a pagar, e se é um pagamento por cartão
  getPaymentData() {
    const { paymentType, cashToPay } = this;
    const isCardPayment = paymentType === PAYMENT_TYPES.PAYMENT_CARD;
    const change = cashToPay - this.totalCost();

    return { paymentType, cashToPay, change, isCardPayment };
  }

  //Método para receber um objeto com informações sobre o pagamento do pedido:
  // Tipo de entrega, endereço de entrega, e se é uma entrega
  getDeliveryData() {
    const { deliveryType, deliveryAddress } = this;
    const isDelivery = deliveryType === DELIVERY_TYPES.DELIVERY;
    let deliveryAddressText = "";

    if (deliveryAddress.identification !== undefined) {
      deliveryAddressText = deliveryAddress.identification + " (" + deliveryAddress.street + ", " + deliveryAddress.number + ")";
    }

    return { deliveryType, deliveryAddress, isDelivery, deliveryAddressText };
  }
}
