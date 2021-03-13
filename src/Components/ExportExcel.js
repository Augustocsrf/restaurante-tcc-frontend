import React from "react";
import ReactExport from "react-export-excel";
import PropTypes from "prop-types";

import "../Styles/component/ExportExcel.css";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class ExportExcel extends React.Component {
  render() {
    const { headers, data, sheetName } = this.props;

    var { element, title } = this.props;

    //Caso o titulo informado seja indefinido, deixar o valor do titulo como o padrão "Baixar relatório completo"
    if (title === undefined) {
      title = "Baixar relatório completo";
    }

    //Caso o elemento informado seja indefinido, criar um botão especifico para baixar o Excel
    if (element === undefined) {
      element = (
        <button id="downloadExcelButton">
          <i id="excelTableIcon" class="fas fa-table"></i>
          {title}
        </button>
      );
    }

    return (
      <ExcelFile filename={sheetName} element={element}>
        <ExcelSheet data={data} name={sheetName}>
          {headers.map((item, index) => {
            return (
              <ExcelColumn label={item.label} value={item.value} key={index} />
            );
          })}
        </ExcelSheet>
      </ExcelFile>
    );
  }
}

ExportExcel.propTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  sheetName: PropTypes.string.isRequired,
};
