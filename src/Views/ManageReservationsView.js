import React, { Component } from "react";

import LoadingIcon from "../Components/LoadingIcon";

import "../Styles/ManageReservations.css";

export default class ManageReservationsView extends Component {
  state = {
    loading: false,

    reservations: [],
    reservationStatuses: [],
  };

  constructor(props) {
    super(props);

    this.getReservations = this.getReservations.bind(this);
    this.getReservationStatuses = this.getReservationStatuses.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.getReservations();
    this.getReservationStatuses();

    this.setState({ loading: false });
  }

  async getReservations() {
    const reservations = await this.props.getReservations();

    this.setState({ reservations });
  }

  async getReservationStatuses() {
    const reservationStatuses = await this.props.getReservationStatuses();

    this.setState({ reservationStatuses });
  }

  async updateReservation(reservation, index) {
    //Remover item alterado da
    const { reservations } = this.state;
    reservations.splice(index, 1);

    this.setState({ reservations });

    let response = await this.props.updateReservation(reservation);

    if (response.error) {
      reservations.splice(index, 0, reservation);
      this.setState({ reservations });
    }
  }

  render() {
    const { reservations, reservationStatuses, loading } = this.state;

    //#region Métodos de formatação de data/hora
    //Métodos para formatar dia e hora
    let formatDay = (day) => {
      let dayArray = day.split("-");
      return dayArray[2] + "/" + dayArray[1] + "/" + dayArray[0];
    };

    let formatHour = (hour) => {
      let hourArray = hour.split(":");
      return hourArray[0] + ":" + hourArray[1];
    };
    //#endregion

    //Criar componente para seleção de status
    let selectStatus = (reservation, index) => {
      const { reservation_status } = reservation;

      return (
        <div className="selectionReservation">
          <select
            className="selectReservationStatus"
            value={reservation_status}
            onChange={(e) => {
              reservations[index].reservation_status = e.target.value;
              reservation.reservation_status = e.target.value;
              this.setState({ reservations });
            }}
          >
            {reservationStatuses.map((reservationStatus, index) => {
              return (
                <option value={reservationStatus.id} key={index}>
                  {reservationStatus.name}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => {
              this.updateReservation(reservation, index);
            }}
          >
            Confirmar Alterção
          </button>
        </div>
      );
    };

    //Métodos para listar as reservas em aberto do usuário
    let reservationList = () => {
      return reservations.map((reservation, index) => {
        let dayFormat = formatDay(reservation.day);
        let hourFormat = formatHour(reservation.time);

        return (
          <div
            className="reservationItem reservationItemManagerial"
            key={index}
          >
            <div>
              <p className="reservationName">
                {reservation.name + " " + reservation.lastName}(
                {reservation.guests} pessoa(s))
              </p>

              <p className="reservationInfoText">
                {dayFormat + ", " + hourFormat}
              </p>
            </div>

            {selectStatus(reservation, index)}
          </div>
        );
      });
    };

    return (
      <div id="manageReservationsView" className="AppBackground">
        <LoadingIcon loading={loading} />
        {reservationList()}
      </div>
    );
  }
}
