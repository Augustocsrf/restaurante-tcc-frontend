import React, { Component } from "react";

import ExportExcel from "../Components/ExportExcel";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";

import "../Styles/ManageCategories.css";
import "../Styles/ManageProducts.css";

//#region Imports de material-ui
import { Edit, Delete, CheckBox } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
//#endregion

export default class ManageOrderStatusView extends Component {
  state = {
    loading: false,
    showModal: false,
    modalEditMode: false,

    orderStatus: [],

    editId: 0, //ID de um status a ser editado
    editIndex: 0, //Index de um status sendo editado
    name: "",
  };

  constructor(props) {
    super(props);

    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.deleteOrderStatus = this.deleteOrderStatus.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getOrderStatus();
  }

  //Método para obter os status de pedidos
  async getOrderStatus() {
    this.setState({ loading: true });

    let orderStatus = await this.props.getOrderStatus();

    this.setState({ orderStatus, loading: false });
  }

  //Método para deletar status
  async deleteOrderStatus(id, index) {
    const { orderStatus } = this.state;

    //Requisitar confirmação do usuário antes de deletar o registro
    const confirmation = window.confirm(
      "Você tem certeza que quer deletar o status " +
        orderStatus[index].name +
        "? Todos os pedidos com esse status passarão para o status 'Entregue'."
    );

    if (confirmation) {
      const deletedStatus = orderStatus[index];

      orderStatus.splice(index, 1);
      this.setState({ orderStatus });

      let returnData = await this.props.deleteOrderStatus(id);

      //Caso tenha ocorrido um erro, colocar o status de volta em seu local na lista
      if (returnData.error) {
        orderStatus.splice(index, 0, deletedStatus);
        this.setState({ orderStatus });
      }
    }
  }

  async changeActiveStatusCategory(status, index) {
    const { orderStatus } = this.state;
    let { id, final } = status;

    //Se um dos estados originais for selecionado, não permitir alterações
    if (id < 7) {
      alert("Os estados básicos do sistema não podem ser alterados");
      return 0;
    }

    //Atualizar status de disponibilidade
    if (final === 1) {
      final = 0;
    } else {
      final = 1;
    }

    orderStatus[index].final = final;
    this.setState({ orderStatus });

    //Enviar requisição para realizar alteração
    const orderStatusData = { id, final };
    const update = await this.props.updateOrderStatus(orderStatusData);

    //Caso tenha ocorrido um erro, retornar ao valor anterior
    if (update.error) {
      if (final === 1) {
        final = 0;
      } else {
        final = 1;
      }

      status[index].final = final;

      this.setState({ orderStatus });
    }
  }

  //Método para submeter o formulário de alterar ou criar categoria
  async submit(e) {
    e.preventDefault();

    this.setState({ loading: true });
    const {
      modalEditMode,
      name,
      editId: id,
      orderStatus,
      editIndex: index,
    } = this.state;

    // Verificar se a requisição realizada é para criar uma categoria nova ou editar uma categoria
    if (!modalEditMode) {
      //Passar dados informados no formulário para criar dados
      const newStatus = await this.props.createOrderStatus({ name });

      //Caso não ter ocorrido erro, adicionar novo estado criado a lista.
      // Caso tenha, parar processo
      if (!newStatus.error) {
        orderStatus.push(newStatus);
      } else {
        this.setState({ loading: false });
        return 0;
      }
    } else {
      //Obter informações da categoria a ser editada
      const orderStatusData = {
        id,
        name,
      };

      const update = await this.props.updateOrderStatus(orderStatusData);

      //Caso um erro tenha ocorrido, parar o processo
      if (update.error) {
        this.setState({ loading: false });
        return 0;
      }

      //Atualizar lista de categorias
      orderStatus[index].name = name;
    }

    this.hideModal();

    this.setState({ loading: false, orderStatus });
  }

  //#region Métodos para modificar a exposição modal
  showModal() {
    this.setState({ showModal: true });
  }
  showEditModal(orderStatus, index) {
    this.setState({
      showModal: true,
      modalEditMode: true,
      editId: orderStatus.id,
      name: orderStatus.name,
      editIndex: index,
    });
  }
  hideModal() {
    this.setState({
      showModal: false,
      name: "",
      modalEditMode: false,
      editId: 0,
      editIndex: 0,
    });
  }
  //#endregion

  render() {
    const { loading, orderStatus, showModal, modalEditMode } = this.state;

    //#region Componentes visuais da página
    const createOrderStatusModal = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um pedido de Status */}
          <form onSubmit={this.submit} className="genericForm">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Nome do Estado"
                required
                value={this.state.name}
                onChange={(e) => {
                  this.setState({ name: e.target.value });
                }}
              />
            </div>

            <button
              className="submit-btn"
              type="submit"
              disabled={this.state.loading}
            >
              {modalEditMode ? "Atualizar" : "Criar"}
            </button>

            <button
              className="submit-btn cancel-btn"
              type="reset"
              onClick={this.hideModal}
            >
              Cancelar
            </button>
          </form>
        </div>
      );
    };

    const orderStatusTable = (rows) => {
      return (
        <TableContainer component={Paper}>
          <Table /*className={classes.table}*/ aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    <CheckBox
                      className={
                        row.final === 1
                          ? "mui-checkBoxIcon mui-checkBoxIconActive"
                          : "mui-checkBoxIcon"
                      }
                      onClick={() =>
                        this.changeActiveStatusCategory(row, index)
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    {row.id < 7 ? null : (
                      <div>
                        <Edit
                          className="mui-editIcon"
                          onClick={() => this.showEditModal(row, index)}
                        />
                        <Delete
                          className="mui-deleteIcon"
                          onClick={(e) => {
                            this.deleteOrderStatus(row.id, index);
                          }}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };
    //#endregion

    //Botão para baixar um planilha mostrando toda a tabela de categorias
    const excelDownloadButton = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Nome", value: "name" },
        { label: "Estado Final", value: "final" },
        { label: "Criado em", value: "created_at" },
        { label: "Atualizado em", value: "updated_at" },
      ];

      return (
        <ExportExcel
          headers={headers}
          data={orderStatus}
          sheetName={"Status de Pedido"}
          title="Baixar tabela de Estados"
        />
      );
    };

    return (
      <div className="AppBackground paddedScreen">
        <div className="buttonsDiv">
          <button className="button" onClick={this.showModal}>
            Criar Novo Estado
          </button>
        </div>

        <Modal show={showModal} handleClose={this.hideModal}>
          {createOrderStatusModal()}
        </Modal>

        {orderStatusTable(orderStatus)}
        {loading ? <LoadingIcon /> : excelDownloadButton()}
      </div>
    );
  }
}
