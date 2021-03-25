import { Component } from "react";

import DatePicker from "react-datepicker";
import LoadingIcon from "../Components/LoadingIcon";
import { formatOnlyHours, minTwoDigits } from "../Services/FormatterFunctions";
import { Link } from "react-router-dom";

import "../Styles/Reservation.css";
import "react-datepicker/dist/react-datepicker.css";

export default class ReservationView extends Component {
  state = {
    date: undefined,
    time: undefined,
    name: this.props.user.name,
    lastName: this.props.user.lastName,
    number: 1,

    excludedDates: [],
    occupation: [],

    loading: false,
  };

  constructor(props) {
    super(props);

    this.makeReservation = this.makeReservation.bind(this);
    this.getBusyDates = this.getBusyDates.bind(this);
  }

  componentDidMount() {
    this.getBusyDates();
  }

  async makeReservation(e) {
    this.setState({ loading: true });

    e.preventDefault();

    const { date, time, name, lastName, number } = this.state;

    let reservationData = {
      day:
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      time,
      name,
      lastName,
      guests: number,
    };

    await this.props.makeReservation(reservationData);

    try {
      this.setState({ loading: false });
    } catch (e) {}
  }

  //Método para obter os dias ocupados do restaurante
  async getBusyDates() {
    const occupation = await this.props.getBusyDates();
    let excludedDates = [];

    //Para cada dia em que todas as 4 mesas do restaurante estão ocupadas,
    // Adicionar esse dia para a lista de dias excluidos
    occupation.forEach((element) => {
      if (element.occupation >= 0) {
        let date = new Date(element.day);
        let dateAdjusted = new Date(
          date.valueOf() + date.getTimezoneOffset() * 200000
        );

        excludedDates.push(dateAdjusted);
      }
    });

    this.setState({ excludedDates, occupation });
  }

  render() {
    //Criar informações de datas para limitas as informações do cliente
    const currentDate = new Date();

    const {
      loading,
      date,
      time,
      name,
      lastName,
      number,
      occupation,
    } = this.state;
    const { user } = this.props;

    //Método para verificar se o botão deve estar ahabilitado para prosseguir
    const isDisabled = () => {
      if (date === undefined) {
        return true;
      }

      if (name === "" || lastName === "" || number === undefined) {
        return true;
      }

      if (time === reservationTimes[0]) {
        return true;
      }

      return false;
    };

    //Método para fazer com que apenas os dias de sexta, sábado e domingo estejam disponíveis
    const isDayAvailable = (date) => {
      const day = date.getDay();
      return !(day === 1);
    };

    const selectTime = () => {
      if (date === undefined) {
        return null;
      }

      //Obter a lista de horários em que o restaurante está com ocupação máxima
      const occupiedTimesAtDate = checkAvailabilityOfDateTime(date, occupation);

      return (
        <div id="selectionTime">
          <select
            id="selectTime"
            value={time}
            required
            onChange={(e) => {
              this.setState({ time: e.target.value });
            }}
          >
            {reservationTimes.map((rTime, index) => {
              if (occupiedTimesAtDate.includes(rTime)) {
                return null;
              }

              return (
                <option value={rTime} key={index}>
                  {rTime}
                </option>
              );
            })}
          </select>
        </div>
      );
    };

    //Método para garantir que a data informada não
    return (
      <div className="App AppBackground">
        <form className="reservation-form" onSubmit={this.makeReservation}>
          <h3>Realizar Reserva</h3>

          {/* Input do horpario e data da reserva */}
          <DatePicker
            selected={this.state.date}
            onChange={(date) => {
              this.setState({ date, time: reservationTimes[0] });
            }}
            excludeDates={this.state.excludedDates}
            minDate={currentDate}
            filterDate={isDayAvailable}
            dateFormat="dd/MM/yyyy"
            placeholderText="Data da reserva"
          />

          {selectTime()}

          {/* Input do nome e sobrenome da pessoa com a reserva*/}
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

          <label htmlFor="number">Numero de convidados (Min: 1/Max: 4)</label>
          <input
            type="number"
            name="number"
            value={this.state.number}
            required
            min={1}
            max={4}
            onChange={(e) => {
              let { value: number } = e.target;

              if (number > 4) number = 4;
              if (number < 1) number = 1;

              this.setState({ number });
            }}
          />

          {user.isUserGuest() ? (
            <Link className="loginLink" to="/login">
              Usuário deve estar logado para prosseguir
            </Link>
          ) : loading ? (
            <LoadingIcon loading={true} size="small" color="green" />
          ) : (
            <button
              type="submit"
              className="submit-btn"
              disabled={isDisabled()}
            >
              Fazer Reserva
            </button>
          )}
        </form>
      </div>
    );
  }
}

const reservationTimes = [
  "Selecionar hora",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

function checkAvailabilityOfDateTime(date, occupation) {
  var occupiedTimes = [];
  var formatDate =
    date.getFullYear() +
    "-" +
    minTwoDigits(date.getMonth() + 1) +
    "-" +
    minTwoDigits(date.getDate());

  occupation.forEach((occupationDate, index) => {
    if (occupationDate.day === formatDate) {
      const formattedTime = formatOnlyHours(occupationDate.time);
      occupiedTimes.push(formattedTime);
    }
  });

  return occupiedTimes;
}
