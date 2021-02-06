import { Component } from "react";
import { Link } from "react-router-dom";
import { DELIVERY_TYPES } from "../DataTypes/DeliveryTypes";
import { PAYMENT_TYPES } from "../DataTypes/PaymentTypes";
import "../Styles/UserProfile.css";
import LoadingIcon from "../Components/LoadingIcon";

export default class UserProfileView extends Component {
  state = {
    loading: false,
    openOrders: [],
    openReservations: [],
  };

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.getClientsOpenOrdersAndReservations = this.getClientsOpenOrdersAndReservations.bind(
      this
    );
    this.cancelReservation = this.cancelReservation.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }

  //Ao componente ser montado, obter as reservas e pedidos em aberto do usuário
  componentDidMount() {
    this.getClientsOpenOrdersAndReservations();
  }

  //Método para obter pedidos e reservas em aberto no momento
  async getClientsOpenOrdersAndReservations() {
    this.setState({ loading: true });

    let {
      openOrders,
      openReservations,
    } = await this.props.getClientsOpenOrdersAndReservations();

    console.log({
      openOrders,
      openReservations,
    });
    this.setState({ openOrders, openReservations, loading: false });
  }

  //Método para cancelar reserva
  async cancelReservation(reservation, index) {
    //Remover reserva cancelada da lista de reservas
    let { openReservations } = this.state;
    const canceledReservation = openReservations[index];
    openReservations.splice(index, 1);
    this.setState({ openReservations });

    let { error } = await this.props.cancelReservation(reservation);

    //Caso a reserva não tenha sido cancelada com sucesso
    // Por a reserva cancelada de volta na lista, na posição da qual foi removida
    if (error) {
      openReservations.splice(index, 0, canceledReservation);
      this.setState({ openReservations });
    } else {
      alert("Reserva cancelada com sucesso");
    }
  }

  async cancelOrder(order, index) {
    //Remover pedido cancelado da lista de pedidos
    let { openOrders } = this.state;
    const canceledOrder = openOrders[index];
    openOrders.splice(index, 1);
    this.setState({ openOrders });

    let { error } = await this.props.cancelOrder(order);

    //Caso o pedido não tenha sido cancelado com sucesso
    // Por o pedido cancelado de volta na lista, na posição da qual foi removido
    if (error) {
      openOrders.splice(index, 0, canceledOrder);
      this.setState({ openOrders });
    } else {
      alert("Pedido cancelado com sucesso");
    }
  }

  //Método para realizar logout
  logout() {
    this.props.logout();
  }

  render() {
    const { user } = this.props;
    const { openOrders, openReservations, loading } = this.state;

    //Métodos para formatar dia e hora
    let formatDay = (day) => {
      let dayArray = day.split("-");
      return dayArray[2] + "/" + dayArray[1] + "/" + dayArray[0];
    };

    let formatHour = (hour) => {
      console.log(hour);

      let hourArray = hour.split(":");
      return hourArray[0] + ":" + hourArray[1];
    };

    //Método para listar os pedidos em aberto do usuário
    let orderList = () => {
      //Listagem de pedidos em aberto
      return openOrders.map((order, index) => {
        const {
          id,
          price,
          payment_method: paymentMethod,
          cash,
          delivery_method: deliveryMethod,
          order_status_id,
          status_name,
          items,
          address,
          address_id,
        } = order;

        //Caso o endereço não esteja nulo, preparar o texto com a indicação do texto
        let addressText = "";

        if (address_id != null) {
          const { identification, number, street } = address;
          addressText = identification + " (" + street + ", " + number + ")";
        } else {
          addressText = "Endereço informado foi deletado";
        }

        //Definir texto para o método de entrega
        var deliveryMethodText = "";
        if (deliveryMethod === DELIVERY_TYPES.DELIVERY) {
          deliveryMethodText = "Delivery";
        } else {
          deliveryMethodText = "Pegar no local";
        }

        var paymentMethodText = "";
        if (paymentMethod === PAYMENT_TYPES.PAYMENT_CARD) {
          paymentMethodText = "Pagar no cartão";
        } else {
          paymentMethodText =
            "Pagar em dinheiro (R$ " + Number(cash).toFixed(2) + ")";
        }

        return (
          <div className="orderItem" key={index}>
            {/* Status do pedido */}
            <p className="orderId"> Pedido #{id} </p>
            <p className="orderInfoText statusInfoText">
              O seu pedido está: {status_name}
            </p>

            <div className="orderDivision" />
            <ul>
              {/* Items pedidos */}
              {items.map((item, index) => {
                return (
                  <li key={index} className="orderInfoText">
                    {item.quantity}x {item.name}
                  </li>
                );
              })}
            </ul>
            <div className="orderDivision" />

            {/* Informações de Entrega */}
            <p className="orderInfoText">{deliveryMethodText}</p>
            {addressText !== "" ? (
              <p className="deliveryAddressText">Entrega em: {addressText}</p>
            ) : null}
            <div className="orderDivision" />

            {/* Informações de Pagamento */}
            <p className="orderInfoText">Total: R${Number(price).toFixed(2)}</p>
            <p className="orderInfoText">{paymentMethodText}</p>

            {Number(order_status_id) === 1 ? (
              <button
                className="cancelOrderBtn"
                onClick={() => this.cancelOrder(order, index)}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        );
      });
    };

    //Métodos para listar as reservas em aberto do usuário
    let reservationList = () => {
      return openReservations.map((reservation, index) => {
        let dayFormat = formatDay(reservation.day);
        let hourFormat = formatHour(reservation.time);

        return (
          <div className="reservationItem" key={index}>
            <i
              className="removeReservationIcon fas fa-times"
              onClick={() => {
                this.cancelReservation(reservation, index);
              }}
            ></i>
            <p className="reservationName">
              {reservation.name + " "}({reservation.guests} pessoa(s))
            </p>
            <p className="reservationInfoText">
              {dayFormat + ", " + hourFormat}
            </p>
          </div>
        );
      });
    };

    return (
      <div className="AppBackground">
        <div className="profileBox">
          <h2>
            {user.name} {user.lastName}
          </h2>

          <Link to="/perfil/enderecos">Endereços</Link>

          <div>
            <h4>Pedidos em aberto</h4>
            <LoadingIcon loading={loading} />
            {orderList()}
          </div>

          <div className="userProfileSection" id="openReservationDiv">
            <h4>Reservas em aberto</h4>
            <LoadingIcon loading={loading} />
            {reservationList()}
          </div>

          <button id="logout-btn" onClick={this.logout}>
            Sair
          </button>
        </div>
      </div>
    );
  }
}
