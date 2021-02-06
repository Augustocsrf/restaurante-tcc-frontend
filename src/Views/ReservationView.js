import { Component } from "react";
import DatePicker from "react-datepicker";
import LoadingIcon from "../Components/LoadingIcon";
import "../Styles/Reservation.css";
import "react-datepicker/dist/react-datepicker.css";

export default class ReservationView extends Component {
  state = {
    date: undefined,
    name: this.props.user.name,
    lastName: this.props.user.lastName,
    number: 1,

    excludedDates: [],

    loading: false,
  };

  constructor(props) {
    super(props);

    this.makeReservation = this.makeReservation.bind(this);
    this.getBusyDates = this.getBusyDates.bind(this);
  }

  componentDidMount() {
    this.getBusyDates();

    /*
    //Fazer hora da data inicial 18:00
    let { date } = this.state;
    date.setHours(18);
    date.setMinutes(0);
    this.setState({ date });
    */
  }

  async makeReservation(e) {
    this.setState({ loading: true });

    e.preventDefault();

    const { date, name, lastName, number } = this.state;

    let reservationData = {
      day:
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      time: date.getHours() + ":" + date.getMinutes(),
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
    const busyDays = await this.props.getBusyDays();
    let excludedDates = [];

    //Para cada dia em que todas as 4 mesas do restaurante estão ocupadas,
    // Adicionar esse dia para a lista de dias excluidos
    busyDays.forEach((element) => {
      if (element.occupation >= 0) {
        let date = new Date(element.day);
        let dateAdjusted = new Date(
          date.valueOf() + date.getTimezoneOffset() * 200000
        );

        excludedDates.push(dateAdjusted);
      }
    });

    this.setState({ excludedDates });
  }

  render() {
    //Criar informações de datas para limitas as informações do cliente
    const currentDate = new Date();
    const maxTime = new Date().setHours(23);
    const minTime = new Date().setHours(17);
    const { loading, date, name, lastName, number } = this.state;

    //Método para verificar se o botão deve estar ahabilitado para prosseguir
    const isDisabled = () => {
      if (date === undefined) {
        return true;
      }

      if (name === '' || lastName === '' || number === undefined) {
        return true;
      }

      return false;
    };

    //Método para fazer com que apenas os dias de sexta, sábado e domingo estejam disponíveis
    const isDayAvailable = (date) => {
      const day = date.getDay();
      return day === 0 || day === 5 || day === 6;
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
              this.setState({ date });
            }}
            excludeDates={this.state.excludedDates}
            timeIntervals={60}
            minDate={currentDate}
            minTime={minTime}
            maxTime={maxTime}
            filterDate={isDayAvailable}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="P HH:mm"
            placeholderText="Data da reserva"
          />

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

          {loading ? (
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