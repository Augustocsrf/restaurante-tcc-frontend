import React, { Component } from "react";
import { Button } from "@material-ui/core";
import "../Styles/DataReport.css";
import Chart from "react-google-charts";
import LoadingIcon from "../Components/LoadingIcon";

export default class DataReportView extends Component {
  constructor(props) {
    super(props);

    this.getReport = this.getReport.bind(this);
    this.REPORTS = this.props.reports;
  }

  state = {
    loading: false,
    reportType: this.props.reports.ORDERS,

    orderQuantity: [],
    revenue: [],
    itemOrdered: [],
    reservationAmount: [],
    newClients: [],
    deliveries: [],
  };

  componentDidMount() {
    this.getReport(this.state.reportType);
  }

  async getReport(reportType) {
    this.setState({ loading: true });

    const { REPORTS } = this;

    const response = await this.props.getReport(reportType);

    console.log(response);

    switch (reportType) {
      case REPORTS.ORDERS:
        this.setState({ orderQuantity: response, loading: false });
        break;

      case REPORTS.ORDER_ITEMS:
        this.setState({ itemOrdered: response, loading: false });
        break;

      case REPORTS.REVENUE:
        this.setState({ revenue: response, loading: false });
        break;

      case REPORTS.RESERVATIONS:
        this.setState({ reservationAmount: response, loading: false });
        break;

      case REPORTS.CLIENTS:
        this.setState({ newClients: response, loading: false });
        break;

      case REPORTS.DELIVERIES:
        this.setState({ deliveries: response, loading: false })
        break;

      default:
        break;
    }
  }

  render() {
    const {
      loading,
      reportType,

      orderQuantity,
      revenue,
      reservationAmount,
      newClients,
      deliveries,
    } = this.state;
    const { REPORTS } = this;

    //Gráfico com a quantidade de pedidos por mês
    const orderQuantityReport = () => {
      var data = [["Mês", "Pedidos", "Pedidos Cancelados"]];

      orderQuantity.map((item, index) => {
        data.push([item.year + "/" + item.month, item.data, item.cancelled]);
        return null;
      });

      return (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            title: "Pedidos realizados por mês",
            chartArea: { width: "60%" },
            hAxis: {
              title: "Pedidos",
              minValue: 0,
            },
            vAxis: {
              title: "Mês",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      );
    };

    //Gráfico com a quantidade de faturamento por mês
    const revenueReport = () => {
      var data = [
        ["Mês", "Faturamento em pedidos", "Valor de Pedidos Cancelados"],
      ];

      revenue.map((item, index) => {
        data.push([
          item.year + "/" + item.month,
          item.totalPrice,
          item.totalCancelled,
        ]);
        return null;
      });

      return (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            title: "Faturamento por mês",
            chartArea: { width: "60%" },
            hAxis: {
              title: "Valor (R$)",
              minValue: 0,
              maxValue: 100
            },
            vAxis: {
              
              title: "Mês",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      );
    };

    //Gráfico com a quantidade de reservas por mês
    const reservationReport = () => {
      var data = [["Mês", "Reservas", "Reservas Cancelados"]];

      reservationAmount.map((item, index) => {
        data.push([item.year + "/" + item.month, item.data, item.cancelled]);
        return null;
      });

      return (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            title: "Reservas por mês",
            chartArea: { width: "60%" },
            hAxis: {
              title: "Reservas",
              minValue: 0,
            },
            vAxis: {
              title: "Mês",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      );
    };

    //Gráfico com a quantidade de novos clientes em cada mês
    const clientsReport = () => {
      var data = [["Mês", "Novos Clientes"]];

      console.log(newClients);

      newClients.map((item, index) => {
        data.push([item.year + "/" + item.month, item.clients]);
        return null;
      });

      return (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            title: "Reservas por mês",
            chartArea: { width: "60%" },
            hAxis: {
              title: "Novos clientes",
              minValue: 0,
            },
            vAxis: {
              title: "Mês",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      );
    };

    //Gráfico com a proporção de entregas/pickUps em cada mês
    const deliveryReport = () => {
      var data = [["Mês", "Entregas", "Pego no local"]];

      console.log(deliveries);

      deliveries.map((item, index) => {
        data.push([item.year + "/" + item.month, Number(item.delivery), Number(item.pickUps)]);
        return null;
      });

      return (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            title: "Proporção de Pedidos Entregue/Pego no Local por mês (%)",
            chartArea: { width: "60%" },
            hAxis: {
              title: "Pedidos (%)",
              minValue: 0,
            },
            vAxis: {
              title: "Mês",
            },
          }}
          // For tests
          rootProps={{ "data-testid": "1" }}
        />
      );
    };

    //Método que define qual relatório será exposto no main
    const report = () => {
      switch (reportType) {
        case REPORTS.ORDERS:
          return orderQuantityReport();

        case REPORTS.REVENUE:
          return revenueReport();

        case REPORTS.RESERVATIONS:
          return reservationReport();

        case REPORTS.CLIENTS:
          return clientsReport();

        case REPORTS.DELIVERIES:
          return deliveryReport();

        default:
          break;
      }
    };

    return (
      <div className="App AppBackground paddedScreen">
        <div id="dataReportView">
          {/* Seleção de que tipo de relatório o usuário quer */}
          <section id="reportDataTypeSelection">
            <Button
              onClick={() => {
                this.setState({ reportType: REPORTS.ORDERS });
                this.getReport(REPORTS.ORDERS);
              }}
            >
              Pedidos
            </Button>
            <Button
              onClick={() => {
                this.setState({ reportType: REPORTS.REVENUE });
                this.getReport(REPORTS.REVENUE);
              }}
            >
              Faturamento
            </Button>
            <Button
              onClick={() => {
                this.setState({ reportType: REPORTS.DELIVERIES });
                this.getReport(REPORTS.DELIVERIES);
              }}
            >
              Entregas
            </Button>

            <Button
              onClick={() => {
                this.setState({ reportType: REPORTS.RESERVATIONS });
                this.getReport(REPORTS.RESERVATIONS);
              }}
            >
              Reservas
            </Button>

            <Button
              onClick={() => {
                this.setState({ reportType: REPORTS.CLIENTS });
                this.getReport(REPORTS.CLIENTS);
              }}
            >
              Clientes
            </Button>
          </section>

          {/* Disposição do relatório pedido */}
          <main id="dataReportDisplay">
            {loading ? <LoadingIcon /> : report()}
          </main>
        </div>
      </div>
    );
  }
}
