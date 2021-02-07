import React, { Component } from "react";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";
import "../Styles/CategoryManagement.css";
import "../Styles/generic/GenericForm.css";
import "../Styles/generic/GenericScreen.css";
import "../Styles/generic/IconsStylization.css";

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

export default class ManageCategoryView extends Component {
  state = {
    loading: false,
    showModal: false,
    modalEditMode: false,

    categories: [],

    categoryId: 0, //ID de uma categoria a ser editada
    categoryIndex: 0, //Index de uma categoria sendo editada
    name: "",
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
    const { categories } = this.state;
    //Requisitar confirmação do usuário antes de deletar a categoria
    const confirmation = window.confirm(
      "Você tem certeza que quer deletar a categoria " +
        categories[index].name +
        " e todos os produtos colocados nela?"
    );

    if (confirmation) {
      const deletedCategory = categories[index];

      categories.splice(index, 1);
      this.setState({ categories });

      let returnData = await this.props.deleteCategory(id);

      //Caso tenha ocorrido um erro, colocar a categoria de volta em seu local na lista
      if (returnData.error) {
        categories.splice(index, 0, deletedCategory);
        this.setState({ categories });
      }
    }
  }

  async changeActiveStatusCategory(category, index) {
    const { categories } = this.state;
    let { id, active } = category;

    //Atualizar status de disponibilidade
    if (active === 1) {
      active = 0;
    } else {
      active = 1;
    }

    categories[index].active = active;
    this.setState({ categories });

    //Enviar requisição para realizar alteração
    const categoryData = { id, active };
    const update = await this.props.updateCategory(categoryData);

    //Caso tenha ocorrido um erro, retornar ao valor anterior
    if (update.error) {
      if (active === 1) {
        active = 0;
      } else {
        active = 1;
      }

      category[index].active = active;

      this.setState({ categories });
    }
  }

  //Método para submeter o formulário de alterar categoria
  async submit(e) {
    e.preventDefault();

    this.setState({ loading: true });
    const {
      modalEditMode,
      name,
      categoryId: id,
      categories,
      categoryIndex: index,
    } = this.state;

    // Verificar se a requisição realizada é para criar uma categoria nova ou editar uma categoria
    if (!modalEditMode) {
      //Passar dados informados no formulário para criar dados
      const newCategory = await this.props.createCategory({ name });

      //Parar processo se um erro tiver ocorrido
      if (newCategory.error) {
        return 0;
      }

      //Adicionar nova categoria criada a lista
      categories.push(newCategory);
    } else {

      //Obter informações da categoria a ser editada
      const categoryData = {
        id,
        name,
      };

      const update = await this.props.updateCategory(categoryData);

      //Caso não tenha ocorrido erro
      if (!update.error) {
        categories[index].name = name;
      }
    }

    this.hideModal();

    this.setState({ loading: false, categories });
  }

  //#region Métodos para modificar a exposição modal
  showModal() {
    this.setState({ showModal: true });
  }
  showEditModal(category, index) {
    this.setState({
      showModal: true,
      modalEditMode: true,
      categoryId: category.id,
      name: category.name,
      categoryIndex: index,
    });
  }
  hideModal() {
    this.setState({
      showModal: false,
      name: "",
      modalEditMode: false,
      categoryId: 0,
      categoryIndex: 0,
    });
  }
  //#endregion

  render() {
    const { loading, categories, showModal, modalEditMode } = this.state;

    //#region Componentes visuais do componente
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

    const categoryTable = (rows) => {
      return (
        <TableContainer component={Paper}>
          <Table /*className={classes.table}*/ aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Disponível</TableCell>
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
                        row.active === 1
                          ? "mui-checkBoxIcon mui-checkBoxIconActive"
                          : "mui-checkBoxIcon"
                      }
                      onClick={() =>
                        this.changeActiveStatusCategory(row, index)
                      }
                    />
                  </TableCell>

                  <TableCell align="left">
                    <Edit
                      className="mui-editIcon"
                      onClick={() => this.showEditModal(row, index)}
                    />
                    <Delete
                      className="mui-deleteIcon"
                      onClick={(e) => {
                        this.deleteCategory(row.id, index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
    };

    return (
      <div className="AppBackground paddedScreen">
        <button id="createCategoryButton" onClick={this.showModal}>
          Criar Categoria Nova
        </button>

        <Modal show={showModal} handleClose={this.hideModal}>
          {createCategoryModal()}
        </Modal>

        {loading ? (
          <LoadingIcon fullScreen={true} />
        ) : (
          categoryTable(categories)
        )}
      </div>
    );
  }
}

/**
 * //const editCategoryModal = () => {};
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

 */
