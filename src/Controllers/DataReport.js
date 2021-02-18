import React, { Component } from "react";
import DataReportView from "../Views/DataReportView";

export default class DataReport extends Component {
  constructor(props) {
    super(props);

    this.getReport = this.getReport.bind(this);
  }

  async getReport() {}

  render() {
    return <DataReportView getReport={this.getReport} />;
  }
}
