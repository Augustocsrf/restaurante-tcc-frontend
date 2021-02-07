import React, { Component } from "react";
import { Link } from "react-router-dom";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";
import "../Styles/CategoryManagement.css";
import "../Styles/generic/GenericForm.css";

export default class ManageCategoryView extends Component {
  state = {
    loading: false,
    showModal: false,

    name: "",
    categories: [],
  };

  constructor(props) {
    super(props);

    this.getCategories = this.getCategories.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getCategories();
  }

  //Método para obter as categorias
  async getCategories() {
    this.setState({ loading: true });

    let categories = await this.props.getCategories();

    this.setState({ categories, loading: false });
  }

  //Método para deletar categorias
  async deleteCategory(id, index) {
    let { categories } = this.state;
    const deletedCategory = categories[index];

    categories.splice(index, 1);
    this.setState({ categories });

    let { success, message } = await this.props.deleteCategory(id);

    if (!success) {
      alert(message);
      categories.splice(index, 0, deletedCategory);
      this.setState({ categories });
    }
  }

  //Métodos para modificar a exposição modal
  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false, name: "" });
  }

  async submit(e) {
    this.setState({ loading: true });

    e.preventDefault();

    //Passar dados informados no formulário para criar dados
    await this.props.createCategory(
      {
        name: this.state.name,
      },
      () => {
        this.hideModal();
        this.getCategories();
      }
    );

    this.setState({ loading: false });
  }

  render() {
    const { loading, showModal } = this.state;
    const createCategoryModal = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um usuário */}
          <form onSubmit={this.submit} className="genericForm">
            <h3>Criar Categoria</h3>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Nome da Categoria"
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
              Criar
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
    //const editCategoryModal = () => {};
    const categoryList = () => {
      return (
        <ul className="categoryList">
          {this.state.categories.map((item, index) => {
            return (
              <div key={index}>
                <li>
                  {item.name}

                  <div className="iconOptions">
                    <Link to={`/funcionario/editar-categoria/${item.id}`}>
                      <i className="fas fa-edit editIcon"></i>
                    </Link>

                    <i
                      className="fas fa-trash deleteIcon"
                      onClick={() => this.deleteCategory(item.id, index)}
                    ></i>
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      );
    };

    return (
      <div className="App AppBackground">
        <button id="createCategoryButton" onClick={this.showModal}>
          Criar Categoria Nova
        </button>

        <Modal show={showModal} handleClose={this.hideModal}>
          {createCategoryModal()}
        </Modal>

        {loading ? <LoadingIcon fullScreen={true} /> : categoryList()}
      </div>
    );
  }
}
