import { Component } from "react";
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
    let addresses = await this.props.getAddresses();

    this.setState({ addresses });
  }

  async deleteAddress(id, index) {
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

  showModal() {
    this.setState({ showModal: true });
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  async submit(e) {
    this.setState({ loading: true });

    e.preventDefault();

    const {
      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,
    } = this.state;

    const response = await this.props.registerAddress({
      zip,
      street,
      district,
      city,
      number,
      complement,
      reference,
      identification,
    });

    let { addresses } = this.state;

    if (!response.error) {
      addresses.push(response.address);
    }

    this.setState({
      loading: false,
      showModal: false,

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

  render() {
    const { addresses } = this.state;

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
              <i
                className="fas fa-trash deleteIcon"
                onClick={() => this.deleteAddress(item.id, index)}
              >
                {" "}
              </i>
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
                      const { value: zip } = e.target;

                      //Quando o usuário tiver digitado todos os 8 digitos do cep, obter as informações automáticamente
                      if (zip.length === 8) {
                      }
                      this.setState({ zip });
                    }}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="street"
                    placeholder="Rua"
                    required
                    value={this.state.street}
                    onChange={(e) => {
                      this.setState({ street: e.target.value });
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

              <div className="form-column">
                <div className="form-group">
                  <input
                    type="text"
                    name="number"
                    placeholder="Numero"
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
      <div className="listView AppBackground">
        <button id="createAddressButton" onClick={this.showModal}>
          Adicionar Novo
        </button>

        <Modal show={this.state.showModal}>{modal()}</Modal>

        {addressList()}
      </div>
    );
  }
}
