import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import DataReportView from "../Views/DataReportView";
import DataReportGateway, { REPORTS } from "../Models/DataReportGateway";

export default class DataReport extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);

    this.getReport = this.getReport.bind(this);
  }

  async getReport(reportType) {
    const gateway = new DataReportGateway();
    const response = await gateway.getReport(reportType);

    return response;
  }

  render() {
    const { getReport } = this;
    const { user } = this.context;

    //Apenas permitir acesso a usuário administrador.
    // Se um usuário que não for administrador tentar entrar, redirecionar o usuário para outra página
    if (!user.isUserAdmin()) {
      alert("Você não tem permissão para acessar essa página");
      return <Redirect to="/" />;
    }

    return <DataReportView getReport={getReport} reports={REPORTS} />;
  }
}
