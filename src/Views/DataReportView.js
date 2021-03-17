import React, { Component } from "react";
import LoadingIcon from "../Components/LoadingIcon";
import ExportExcel from "../Components/ExportExcel";

import { Button } from "@material-ui/core";
import Chart from "react-google-charts";

import "../Styles/DataReport.css";

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
        this.setState({ deliveries: response, loading: false });
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
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Mês do Ano", value: "month" },
        { label: "Pedidos Realizados", value: "data" },
        { label: "Pedidos Cancelados", value: "cancelled" },
      ];

      //Cabeçalho do gráfico
      var data = [["Mês", "Pedidos", "Pedidos Cancelados"]];

      //Adicionar
      orderQuantity.map((item, index) => {
        //Adicionar aos dados a serem dispostos apenas o último ano. Os valores totais estarão na planilha do excel
        if (index < 12) {
          data.push([item.month, item.data, item.cancelled]);
        }
        return null;
      });

      return (
        <div>
          <Chart
            width={"100%"}
            height={"300px"}
            chartType="BarChart"
            loader={<div>Carregando Gráfico</div>}
            data={data}
            options={{
              title: "Pedidos realizados por mês (Últimos 12 meses)",
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

          <ExportExcel
            center={true}
            headers={headers}
            data={orderQuantity}
            sheetName={"Pedidos Realizados"}
          />
        </div>
      );
    };

    //Gráfico com a quantidade de faturamento por mês
    const revenueReport = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Mês do Ano", value: "month" },
        { label: "Faturamento total (R$)", value: "totalPrice" },
        { label: "Valor de Pedidos Cancelados (R$)", value: "totalCancelled" },
      ];

      //Cabeçalho do gráfico
      var data = [
        ["Mês", "Faturamento em pedidos", "Valor de Pedidos Cancelados"],
      ];

      revenue.map((item, index) => {
        //Adicionar aos dados a serem dispostos apenas o último ano. Os valores totais estarão na planilha do excel
        if (index < 12) {
          data.push([item.month, item.totalPrice, item.totalCancelled]);
        }
        return null;
      });

      return (
        <div>
          <Chart
            width={"100%"}
            height={"300px"}
            chartType="BarChart"
            loader={<div>Carregando Gráfico</div>}
            data={data}
            options={{
              title: "Faturamento por mês (Últimos 12 meses)",
              chartArea: { width: "60%" },
              hAxis: {
                title: "Valor (R$)",
                minValue: 0,
                maxValue: 100,
              },
              vAxis: {
                title: "Mês",
              },
            }}
            // For tests
            rootProps={{ "data-testid": "1" }}
          />

          <ExportExcel
            center={true}
            headers={headers}
            data={revenue}
            sheetName={"Faturamento"}
          />
        </div>
      );
    };

    //Gráfico com a quantidade de reservas por mês
    const reservationReport = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Mês do Ano", value: "month" },
        { label: "Reservas", value: "data" },
        { label: "Reservas Canceladas", value: "cancelled" },
        { label: "Reservas Atrasadas", value: "delays" },
      ];

      var data = [
        ["Mês", "Reservas", "Reservas Cancelados", "Reservas Atrasadas"],
      ];

      reservationAmount.map((item, index) => {
        //Adicionar aos dados a serem dispostos apenas o último ano. Os valores totais estarão na planilha do excel
        if (index < 12) {
          data.push([item.month, item.data, item.cancelled, item.delays]);
        }
        return null;
      });

      return (
        <div>
          <Chart
            width={"100%"}
            height={"300px"}
            chartType="BarChart"
            loader={<div>Carregando Gráfico</div>}
            data={data}
            options={{
              title: "Reservas por mês (Últimos 12 meses)",
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

          <ExportExcel
            center={true}
            headers={headers}
            data={reservationAmount}
            sheetName={"Reservas"}
          />
        </div>
      );
    };

    //Gráfico com a quantidade de novos clientes em cada mês
    const clientsReport = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Mês do Ano", value: "month" },
        { label: "Novos Clientes", value: "clients" },
      ];

      var data = [["Mês", "Novos Clientes"]];

      newClients.map((item, index) => {
        //Adicionar aos dados a serem dispostos apenas o último ano. Os valores totais estarão na planilha do excel
        if (index < 12) {
          data.push([item.month, item.clients]);
        }
        return null;
      });

      return (
        <div>
          <Chart
            width={"100%"}
            height={"300px"}
            chartType="BarChart"
            loader={<div>Carregando Gráfico</div>}
            data={data}
            options={{
              title: "Novos clientes por mês (Últimos 12 meses)",
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
          <ExportExcel
            center={true}
            headers={headers}
            data={newClients}
            sheetName={"Reservas"}
          />
        </div>
      );
    };

    //Gráfico com a proporção de entregas/pickUps em cada mês
    const deliveryReport = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Mês do Ano", value: "month" },
        { label: "Entregas (%)", value: "delivery" },
        { label: "Pegos no local (%)", value: "pickUps" },
      ];

      var data = [["Mês", "Entregas", "Pego no local"]];

      deliveries.map((item, index) => {
        //Adicionar aos dados a serem dispostos apenas o último ano. Os valores totais estarão na planilha do excel
        if (index < 12) {
          data.push([item.month, Number(item.delivery), Number(item.pickUps)]);
        }
        return null;
      });

      return (
        <div>
          <Chart
            width={"100%"}
            height={"300px"}
            chartType="BarChart"
            loader={<div>Carregando Gráfico</div>}
            data={data}
            options={{
              title:
                "Proporção de Pedidos Entregue/Pego no Local por mês (%) (Últimos 12 meses)",
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
          <ExportExcel
            center={true}
            headers={headers}
            data={deliveries}
            sheetName={"Reservas"}
          />
        </div>
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
              className={reportType === REPORTS.ORDERS ? "selectedReport" : ""}
              onClick={() => {
                this.setState({ reportType: REPORTS.ORDERS });
                this.getReport(REPORTS.ORDERS);
              }}
            >
              Pedidos
            </Button>
            <Button
              className={reportType === REPORTS.REVENUE ? "selectedReport" : ""}
              onClick={() => {
                this.setState({ reportType: REPORTS.REVENUE });
                this.getReport(REPORTS.REVENUE);
              }}
            >
              Faturamento
            </Button>
            <Button
              className={
                reportType === REPORTS.DELIVERIES ? "selectedReport" : ""
              }
              onClick={() => {
                this.setState({ reportType: REPORTS.DELIVERIES });
                this.getReport(REPORTS.DELIVERIES);
              }}
            >
              Entregas
            </Button>

            <Button
              className={
                reportType === REPORTS.RESERVATIONS ? "selectedReport" : ""
              }
              onClick={() => {
                this.setState({ reportType: REPORTS.RESERVATIONS });
                this.getReport(REPORTS.RESERVATIONS);
              }}
            >
              Reservas
            </Button>

            <Button
              className={reportType === REPORTS.CLIENTS ? "selectedReport" : ""}
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
