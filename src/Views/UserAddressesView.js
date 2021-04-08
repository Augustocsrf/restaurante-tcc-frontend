import { Edit } from "@material-ui/icons";
import { Component } from "react";

import ExportExcel from "../Components/ExportExcel";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";

import "../Styles/UserAddresses.css";

export default class UserAddressesView extends Component {
  state = {
    zip: "",
    street: "",
    district: "",
    city: "",
    number: "",
    complement: "",
    reference: "",
    identification: "",

    showModal: false,
    loading: false,
    editModal: false,
    editId: "",
    editIndex: "",

    addresses: [],
  };

  constructor(props) {
    super(props);

    this.getAddresses = this.getAddresses.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getAddresses();
  }

  async getAddresses() {
    this.setState({ loading: true });

    let addresses = await this.props.getAddresses();

    this.setState({ addresses, loading: false });
  }

  async deleteAddress(id, index) {
    //Pedir confirmação do usuário para remover permissão de um funcionário
    const confirmation = window.confirm(
      "Você tem certeza que quer deletar esse endereço?"
    );

    if (confirmation) {
      let { addresses } = this.state;
      let deletedAddress = addresses[index];
      addresses.splice(index, 1);

      this.setState({ addresses });

      let response = await this.props.deleteAddress(id);

      //Caso haja um erro, colocar o endereço deletado de volta no lugar
      if (response.error) {
        addresses.splice(index, 0, deletedAddress);
        this.setState({ addresses });
      }
    }
  }

  //#region Métodos para abrir e fechar o modal
  showModal() {
    this.setState({ showModal: true });
  }

  showEditModal(address, index) {
    const {
      id: editId,
      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,
    } = address;

    this.setState({
      showModal: true,
      editModal: true,

      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,
      editId,
      editIndex: index,
    });
  }

  hideModal() {
    this.setState({
      showModal: false,
      editModal: false,
      editId: "",
      editIndex: "",
      zip: "",
      street: "",
      district: "",
      city: "",
      number: "",
      complement: "",
      reference: "",
      identification: "",
    });
  }
  //#endregion

  async submit(e) {
    e.preventDefault();

    this.setState({ loading: true });

    const {
      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,

      editId,
      editIndex,
      editModal,

      addresses,
    } = this.state;

    const addressData = {
      id: editId,
      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,
    };

    //Verificar se o formulário está em modo de criação ou de edição, e realizar as operações de acordo
    if (editModal) {
      const response = await this.props.updateAddress(addressData);

      //Não prosseguir o processo se tiver ocorrido um erro
      if (response.error) {
        return 0;
      }

      addresses[editIndex] = addressData;

      this.setState({ addresses, loading: false });

      this.hideModal();
    } else {
      const response = await this.props.registerAddress(addressData);

      if (!response.error) {
        addresses.push(response.address);
      }

      this.setState({
        loading: false,
        showModal: false,

        editId: "",
        editIndex: "",
        zip: "",
        street: "",
        district: "",
        city: "",
        number: "",
        complement: "",
        reference: "",
        identification: "",
      });
    }
  }

  render() {
    const { addresses, loading } = this.state;

    //Botão para baixar um planilha mostrando toda a tabela de endereços
    const excelDownloadButton = () => {
      //Colunas que estarão na planilha do excel
      const headers = [
        { label: "CEP", value: "zip" },
        { label: "Rua", value: "street" },
        { label: "Bairro", value: "district" },
        { label: "Number", value: "number" },
        { label: "Cidade", value: "city" },
        { label: "Complemento", value: "complement" },
        { label: "Referência", value: "reference" },
        { label: "Identificação", value: "identification" },

        { label: "Criado em", value: "created_at" },
        { label: "Atualizado em", value: "updated_at" },
      ];

      return (
        <ExportExcel
          headers={headers}
          data={addresses}
          sheetName={"Endereços"}
          title="Baixar Tabela de Endereços"
        />
      );
    };

    let addressList = () => {
      return addresses.map((item, index) => {
        let addressText =
          item.city +
          ", " +
          item.district +
          ", " +
          item.street +
          ", " +
          item.number;

        if (item.complement != null) {
          addressText += ", " + item.complement;
        }

        return (
          <div className="addressBox" key={index}>
            <div className="addressBox-titleLine">
              <p className="identification">{item.identification}</p>

              <div style={{ marginLeft: "auto" }}>
                <Edit
                  className="mui-editIcon"
                  onClick={() => this.showEditModal(item, index)}
                />
                <i
                  className="fas fa-trash deleteIcon"
                  onClick={() => this.deleteAddress(item.id, index)}
                >
                  {" "}
                </i>
              </div>
            </div>

            <p>{addressText}</p>
            <p>{item.reference}</p>
          </div>
        );
      });
    };

    let modal = () => {
      return (
        <div className="row">
          {/**Formulário para cadastrar mais  */}
          <form onSubmit={this.submit} className="login-form">
            <h3>Registrar Endereço</h3>

            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <input
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    required
                    minLength={8}
                    maxLength={8}
                    value={this.state.zip}
                    onChange={(e) => {
                      const zip = e.target.value.replace(
                        /[a-zA-Z`~!@#$%^&*() _|+\-=?;:'",.<>{}[\]\\/]/gi,
                        ""
                      );
                      this.setState({ zip });
                    }}
                  />
                </div>

                <div className="form-group" id="input-street-num">
                  <input
                    id="input-street"
                    type="text"
                    name="street"
                    placeholder="Rua"
                    required
                    value={this.state.street}
                    onChange={(e) => {
                      this.setState({ street: e.target.value });
                    }}
                  />

                  <input
                    id="input-num"
                    type="text"
                    name="number"
                    placeholder="Nº"
                    required
                    value={this.state.number}
                    onChange={(e) => {
                      this.setState({ number: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="district"
                    placeholder="Bairro"
                    required
                    value={this.state.district}
                    onChange={(e) => {
                      this.setState({ district: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    required
                    value={this.state.city}
                    onChange={(e) => {
                      this.setState({ city: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="form-space" />

              <div className="form-column">
                <div className="form-group">
                  <input
                    type="text"
                    name="complement"
                    placeholder="Complemento (opcional)"
                    value={this.state.complement}
                    onChange={(e) => {
                      this.setState({ complement: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="reference"
                    placeholder="Referência (opcional)"
                    value={this.state.reference}
                    onChange={(e) => {
                      this.setState({ reference: e.target.value });
                    }}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="identification"
                    placeholder="Identificação (ex: Minha Casa, Trabalho)"
                    required
                    value={this.state.identification}
                    onChange={(e) => {
                      this.setState({ identification: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              className="submit-btn submit-btn-RegisterAddress"
              type="submit"
            >
              Registrar
            </button>

            <button
              className="submit-btn submit-btn-RegisterAddress cancel-btn"
              type="reset"
              onClick={this.hideModal}
            >
              Cancelar
            </button>
          </form>
        </div>
      );
    };

    return (
      <div className="AppBackground paddedScreen">
        <button id="createAddressButton" onClick={this.showModal}>
          Adicionar Novo
        </button>

        <Modal show={this.state.showModal}>{modal()}</Modal>

        <LoadingIcon loading={loading} />

        {addresses.length === 0 && !loading ? (
          <p style={{ margin: "auto" }}>Nenhum endereço cadastrado ainda</p>
        ) : (
          addressList()
        )}
        {addresses.length === 0 || loading ? null : excelDownloadButton()}
      </div>
    );
  }
}
