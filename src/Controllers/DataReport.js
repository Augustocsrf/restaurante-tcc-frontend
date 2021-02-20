import React, { Component } from "react";
import DataReportView from "../Views/DataReportView";
import DataReportGateway, { REPORTS } from "../Models/DataReportGateway";

export default class DataReport extends Component {
  constructor(props) {
    super(props);

    this.getReport = this.getReport.bind(this);
  }

  async getReport(reportType) {
    const gateway = new DataReportGateway();
    const response = await gateway.getReport(reportType);

    return response
  }

  render() {
    const { getReport } = this;
    return <DataReportView getReport={getReport} reports={REPORTS} />;
  }
}

