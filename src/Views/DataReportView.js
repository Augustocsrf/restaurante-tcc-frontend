import React, { Component } from "react";
import { Button} from '@material-ui/core';
import '../Styles/DataReport.css'

export default class DataReportView extends Component {
  constructor(props) {
    super(props);

    this.getReport = this.getReport.bind(this);
  }

  componentDidMount(){
    this.getReport();
  }

  async getReport() {}

  render() {
    return (
        <div className="App AppBackground paddedScreen">

        <div id="dataReportView">
        {/* Seleção de que tipo de relatório o usuário quer */}
        <section id="reportDataTypeSelection">
            <button>AAAAAAAA</button>
            <button>AAAAAAAA</button>
            <button>AAAAAAAA</button>
            <Button />
        </section>

        {/* Disposição do relatório pedido */}
        <main id="dataReportDisplay">

        </main>
        </div>
      </div>
    );
  }
}
