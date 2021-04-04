import React, { Component } from "react";

import { formatPhone, formatDate } from "../Services/FormatterFunctions";
import { USER_PERMISSIONS } from "../DataTypes/User";
import ExportExcel from "../Components/ExportExcel";
import Modal from "../Components/Modal";

import "../Styles/ManageProducts.css";
import "../Styles/generic/GenericForm.css";

//#region Imports de material-ui para fazer a Tabela
import { Delete } from "@material-ui/icons";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LoadingIcon from "../Components/LoadingIcon";
//#endregion

export default class ManageStaffView extends Component {
  state = {
    loading: false,
    loadingModal: false,
    showModal: false,
    staff: [],

    //Variáveis de formulário
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    lastName: "",
    phone: "",
  };

  constructor(props) {
    super(props);

    this.getStaff = this.getStaff.bind(this);
    this.demoteStaff = this.demoteStaff.bind(this);
    this.submit = this.submit.bind(this);

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.getStaff();
  }

  async getStaff() {
    this.setState({ loading: true });

    const staff = await this.props.getStaff();

    this.setState({ staff, loading: false });
  }

  //Método para remover permissões de funcionário
  async demoteStaff(staffer, index) {
    //Pedir confirmação do usuário para remover permissão de um funcionário
    const confirmation = window.confirm(
      "Você tem certeza que quer remover as permissões de funcionário de " +
        staffer.name +
        " " +
        staffer.lastName +
        "?"
    );

    if (confirmation) {
      const { staff } = this.state;

      //Remover funcionário da lista
      staff.splice(index, 1);

      staffer.permission = USER_PERMISSIONS.CLIENT;
      const result = await this.props.updateStaff(staffer);

      //Caso um erro tenha ocorrido, funcionário retorna ao seu local na tabela
      if (result.error) {
        staff.splice(index, 0, staffer);
      }

      //Atualizar lista de funcionários
      this.setState({ staff });
    }
  }

  //Método para submeter o formulário de criação do funcionário
  async submit(e) {
    //Previnir evento padrão
    e.preventDefault();

    this.setState({ loadingModal: true });

    const {
      staff,
      modalEditMode,

      email,
      password,
      confirmPassword,
      name,
      lastName,
      phone,
    } = this.state;

    const staffData = {
      email,
      password,
      confirmPassword,
      name,
      lastName,
      phone,
    };

    if (!modalEditMode) {
      const newStaff = await this.props.createStaff(staffData);

      //Caso tenha ocorrido, adicionar o novo funcionário a lista de funcionários
      if (!newStaff.error) {
        staff.push(newStaff);

        this.setState({ staff });

        this.setState({
          showModal: false,

          email: "",
          password: "",
          confirmPassword: "",
          name: "",
          lastName: "",
          phone: "",
        });
      }
    }

    this.setState({ loadingModal: false });
  }

  //#region Métodos para abrir ou fechar modal
  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({
      showModal: false,
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      phone: "",
    });
  }

  //#endregion

  render() {
    const { staff, loading, showModal } = this.state;

    //#region Métodos que
    const modalForm = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um usuário */}
          <form onSubmit={this.submit} className="genericForm">
            <h3>Criar Novo Funcionário</h3>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Email"
                required
                value={this.state.email}
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Senha"
                required
                onChange={(e) => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirmar Senha"
                required
                onChange={(e) => {
                  this.setState({ passwordConfirm: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
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
            </div>

            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Sobrenome"
                required
                value={this.state.lastName}
                onChange={(e) => {
                  this.setState({ lastName: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="name"
                minLength={10}
                maxLength={12}
                placeholder="(DD) Telefone"
                required
                value={this.state.phone}
                onChange={(e) => {
                  const phone = e.target.value.replace(
                    /[a-zA-Z`~!@#$%^&*() _|+\-=?;:'",.<>{}[\]\\/]/gi,
                    ""
                  );
                  this.setState({ phone });
                }}
              />
            </div>

            {this.state.loadingModal ? (
              <LoadingIcon />
            ) : (
              <button className="submit-btn" type="submit" disabled={loading}>
                Criar
              </button>
            )}

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

    const staffTable = (rows) => {
      return (
        <TableContainer component={Paper}>
          <Table /*className={classes.table}*/ aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="left">E-mail</TableCell>
                <TableCell align="left">Telefone</TableCell>
                <TableCell align="left">Registrado em:</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    style={
                      index % 2
                        ? { background: "#d1d1d1" }
                        : { background: "white" }
                    }
                  >
                    <TableCell component="th" scope="row">
                      {row.name + " " + row.lastName}
                    </TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{formatPhone(row.phone)}</TableCell>
                    <TableCell align="left">
                      {formatDate(row.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <Delete
                        className="mui-deleteIcon"
                        onClick={(e) => {
                          this.demoteStaff(row, index);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };
    //#endregion

    //Botão para baixar um planilha mostrando toda a tabela de funcionários
    const excelDownloadButton = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "Nome", value: "name" },
        { label: "Sobrenome", value: "lastName" },
        { label: "E-mail", value: "email" },
        { label: "Telefone", value: "phone" },
        { label: "Criado em", value: "created_at" },
        { label: "Atualizado em", value: "updated_at" },
      ];

      return (
        <ExportExcel
          headers={headers}
          data={staff}
          sheetName={"Funcionários"}
          title="Baixar tabela de Funcionários"
        />
      );
    };

    return (
      <div className="AppBackground paddedScreen">
        <div className="buttonsDiv">
          <button className="button" onClick={this.showModal}>
            Criar Funcionário
          </button>
        </div>

        <Modal show={showModal} handleClose={this.hideModal}>
          {modalForm()}
        </Modal>

        {staffTable(staff)}

        {loading ? <LoadingIcon /> : excelDownloadButton()}
      </div>
    );
  }
}
