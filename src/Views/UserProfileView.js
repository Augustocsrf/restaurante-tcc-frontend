import { Component } from "react";

import { Link } from "react-router-dom";
import { Edit, VpnKey } from "@material-ui/icons";

import {
  formatPhone,
  formatDate,
  formatDateTime,
  formatOnlyHours,
  formatPermission,
} from "../Services/FormatterFunctions";
import { DELIVERY_TYPES } from "../DataTypes/DeliveryTypes";
import { PAYMENT_TYPES } from "../DataTypes/PaymentTypes";

import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";

import "../Styles/UserProfile.css";
import UnconfirmedUserProfileView from "./sub-pages/UnconfirmedUserProfileView";

export default class UserProfileView extends Component {
  state = {
    loading: false,
    formLoading: false,

    showModal: false,
    editPasswordModal: false,

    openOrders: [],
    openReservations: [],

    email: this.props.user.email,
    name: this.props.user.name,
    lastName: this.props.user.lastName,
    phone: this.props.user.phone,

    password: "",
    passwordConfirm: "",

    codeConfirm: "",
  };

  constructor(props) {
    super(props);

    this.getClientsOpenOrdersAndReservations = this.getClientsOpenOrdersAndReservations.bind(
      this
    );
    this.cancelReservation = this.cancelReservation.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.submitUpdate = this.submitUpdate.bind(this);
    this.submitPasswordUpdate = this.submitPasswordUpdate.bind(this);
  }

  //Ao componente ser montado, obter as reservas e pedidos em aberto do usuário
  componentDidMount() {
    this.getClientsOpenOrdersAndReservations();
  }

  //#region Métodos para modificar a exposição modal
  showModal(editPasswordModal) {
    if (editPasswordModal === undefined) {
      editPasswordModal = false;
    }

    this.setState({ showModal: true, editPasswordModal });
  }
  hideModal() {
    this.setState({
      showModal: false,
    });
  }
  //#endregion

  //Método para obter pedidos e reservas em aberto no momento
  async getClientsOpenOrdersAndReservations() {
    this.setState({ loading: true });

    let {
      openOrders,
      openReservations,
    } = await this.props.getClientsOpenOrdersAndReservations();

    this.setState({ openOrders, openReservations, loading: false });
  }

  //#region Métodos para cancelar reserva e pedido
  async cancelReservation(reservation, index) {
    //Pedir confirmação do usuário para cancelar uma reserva
    const confirmation = window.confirm(
      "Você tem certeza que quer cancelar esta reserva?"
    );

    if (confirmation) {
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
  }

  async cancelOrder(order, index) {
    //Pedir confirmação do usuário para cancelar uma reserva
    const confirmation = window.confirm(
      "Você tem certeza que quer cancelar este pedido?"
    );

    if (confirmation) {
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
  }
  //#endregion

  //#region Métodos para enviar atualizações
  async submitUpdate(e) {
    e.preventDefault();

    this.setState({ formLoading: true });
    const { email, name, lastName, phone } = this.state;
    const userData = {
      email,
      name,
      lastName,
      phone,
    };

    await this.props.update(userData);

    this.setState({ formLoading: false, showModal: false });
  }

  //Método para enviar
  async submitPasswordUpdate(e) {
    e.preventDefault();

    this.setState({ formLoading: true });
    const { password, passwordConfirm } = this.state;
    const passwordData = {
      password,
      passwordConfirm,
    };

    await this.props.updatePassword(passwordData);

    this.setState({
      formLoading: false,
      showModal: false,
      password: "",
      passwordConfirm: "",
    });
  }
  //#endregion

  render() {
    const { user, logout, confirmEmail } = this.props;

    //Verificar se o usuário for confirmado. Se não, o usuário deve ter acesso limitado a informações,
    // e deve ser esperado informar o código enviado
    if (!user.isUserConfirmed()) {
      return (
        <UnconfirmedUserProfileView
          logout={logout}
          user={user}
          confirmEmail={confirmEmail}
        />
      );
    }

    const {
      openOrders,
      openReservations,
      loading,
      showModal,
      editPasswordModal,
      formLoading,
    } = this.state;

    //Método para listar os pedidos em aberto do usuário
    let orderList = () => {
      //Listagem de pedidos em aberto
      return openOrders.map((order, index) => {
        const {
          price,
          payment_method: paymentMethod,
          cash,
          delivery_method: deliveryMethod,
          order_status_id,
          status_name,
          items,
          address,
          address_id,
          created_at,
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
            <p className="orderId">
              {" "}
              Pedido feito em {formatDateTime(created_at)}{" "}
            </p>
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
        let dayFormat = formatDate(reservation.day);
        let hourFormat = formatOnlyHours(reservation.time);

        return (
          <div className="reservationItem" key={index}>
            <p className="reservationName">
              {reservation.name + " "}({reservation.guests} pessoa(s))
            </p>
            <p className="reservationInfoText">
              {dayFormat + ", " + hourFormat}
            </p>

            {Number(reservation.reservation_status) === 1 ? (
              <button
                className="cancelReservationBtn"
                onClick={() => this.cancelReservation(reservation, index)}
              >
                Cancelar
              </button>
            ) : null}
          </div>
        );
      });
    };

    //Formulátio para editar perfil
    const editProfileModal = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um usuário */}
          <form onSubmit={this.submitUpdate} className="genericForm">
            <h3>Editar Perfil</h3>
            <input
              type="text"
              name="email"
              placeholder="E-mail"
              required
              value={this.state.email}
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
            />

            <input
              type="text"
              name="name"
              placeholder="Nome"
              required
              value={this.state.name}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Sobrenome"
              required
              value={this.state.lastName}
              onChange={(e) => {
                this.setState({ lastName: e.target.value });
              }}
            />

            <input
              type="text"
              name="phone"
              placeholder="Telefone"
              required
              value={this.state.phone}
              onChange={(e) => {
                this.setState({ phone: e.target.value });
              }}
            />

            {formLoading ? <LoadingIcon /> : null}
            <button className="submit-btn" disabled={formLoading} type="submit">
              Atualizar
            </button>

            <button
              className="submit-btn cancel-btn"
              type="reset"
              onClick={this.hideModal}
            >
              Cancelar
            </button>
          </form>
        </div>
      );
    };

    //Formulátio para editar senha
    const editPasswordFormModal = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um usuário */}
          <form onSubmit={this.submitPasswordUpdate} className="genericForm">
            <h3>Editar Senha</h3>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
              value={this.state.password}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
            />

            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirmar senha"
              required
              value={this.state.passwordConfirm}
              onChange={(e) => {
                this.setState({ passwordConfirm: e.target.value });
              }}
            />

            {formLoading ? <LoadingIcon /> : null}
            <button className="submit-btn" disabled={formLoading} type="submit">
              Atualizar
            </button>

            <button
              className="submit-btn cancel-btn"
              type="reset"
              onClick={this.hideModal}
            >
              Cancelar
            </button>
          </form>
        </div>
      );
    };

    return (
      <div className="AppBackground">
        <Link id="linkToAddress" to="/perfil/enderecos">
          Endereços
        </Link>

        <div className="profileBox">
          <Modal show={showModal} handleClose={this.hideModal}>
            {editPasswordModal ? editPasswordFormModal() : editProfileModal()}
          </Modal>

          <h2>
            {user.name} {user.lastName}
          </h2>
          <p>{formatPermission(user.permission)}</p>
          <p>{user.email}</p>
          <p>{formatPhone(user.phone)}</p>

          <button
            className="editProfileButtons"
            onClick={() => this.showModal(false)}
          >
            <Edit
              style={{
                color: "black",
                fontSize: 18,
                verticalAlign: "auto",
                marginRight: 10,
              }}
            />
            Editar Perfil
          </button>

          <button
            className="editProfileButtons"
            onClick={() => this.showModal(true)}
          >
            <VpnKey
              style={{
                color: "black",
                fontSize: 18,
                verticalAlign: "auto",
                marginRight: 10,
              }}
            />{" "}
            Editar Senha
          </button>

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

          <button id="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    );
  }
}
