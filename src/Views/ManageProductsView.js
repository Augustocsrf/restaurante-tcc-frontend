import { Component } from "react";
import { Link } from "react-router-dom";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";
import "../Styles/ManageProducts.css";
import "../Styles/generic/IconsStylization.css";
import "../Styles/generic/GenericScreen.css";

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

export default class ManageProductsView extends Component {
  state = {
    items: [],
    categories: [],
    showModal: false,
    modalEditMode: false,

    page: 1,
    totalItems: 60,

    itemIndex: 0, //Index de um produto sendo editado
    itemId: "", //ID de um produto a ser editado
    name: "",
    price: 0,
    description: "",
    selectCategory: "",
  };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.getAllProductsAndCategories = this.getAllProductsAndCategories.bind(
      this
    );
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getAllProductsAndCategories();
  }

  async getAllProductsAndCategories() {
    this.setState({ loading: true });

    const items = await this.props.getAllProducts();
    const categories = await this.props.getAllCategories();

    console.log({ items, categories })

    //Definir um valor padrão como sendo o primeiro item encontrado nas categorias
    // Entretanto, caso as categorias estejam vazias, dar um valor padrão de zero
    var selectCategory;
    try {
      selectCategory = categories[0].id;
    } catch (e) {
      selectCategory = 0;
    }

    this.setState({ loading: false, items, categories, selectCategory });
  }

  //#region  Métodos para manipular items
  async deleteItem(id, index) {
    let { items } = this.state;

    //Requisitar confirmação do usuário antes de deletar a categoria
    const confirmation = window.confirm(
      "Você tem certeza que quer deletar " + items[index].name + "?"
    );

    if (confirmation) {
      const deletedItem = items[index];

      items.splice(index, 1);
      this.setState({ items });

      let { error, message } = await this.props.deleteItem(id);

      if (error) {
        alert(message);
        items.splice(index, 0, deletedItem);
        this.setState({ items });
      }
    }
  }

  //Método para alterar apenas o status de disponibilidade de um item
  async changeActiveStatusItem(item, index) {
    const { items } = this.state;
    const { id } = item;
    let { active } = item;

    //Definir o novo valor de ativo
    if (active === 1) {
      active = 0;
    } else {
      active = 1;
    }

    //Criar objeto item com o novo valor de atividade e id
    const itemData = {
      id,
      active,
    };

    //Atualizar a disponibilidade do item na tabela
    items[index].active = active;
    this.setState({ items });

    const editItem = await this.props.updateItem(itemData);

    //Caso tenha ocorrido um erro, retornar o item ao valor anterior
    if (editItem.error) {
      if (active === 1) {
        active = 0;
      } else {
        active = 1;
      }

      items[index].active = active;
      this.setState({ items });
    }
  }

  //Método para submeter os dados de criação ou atualização de items
  async submit(e) {
    //Previnir evento padrão
    e.preventDefault();

    const {
      items,
      itemIndex,
      modalEditMode,
      name,
      selectCategory: categoryId,
      description,
      price,
      itemId: id,
    } = this.state;

    const itemData = {
      name,
      categoryId: Number(categoryId),
      description,
      price: Number(price).toFixed(2),
      id,
    };

    //Verificar se o modal estava com modo de edição. Se não, utilizar função de criar item, se sim, utilizar função de editar item
    if (!modalEditMode) {
      this.setState({ loading: true });

      const newItem = await this.props.createItem(itemData);

      items.push(newItem);
    } else {
      const editItem = await this.props.updateItem(itemData);

      editItem.price = Number(editItem.price);
      //console.log(editItem);

      items[itemIndex] = editItem;
    }

    this.setState({
      loading: false,
      showModal: false,
      modalEditMode: false,
      items,

      itemIndex: 0,
      itemId: "",
      name: "",
      price: 0,
      description: "",
      selectCategory: this.state.categories[0].id,
    });
  }
  //#endregion

  //#region Métodos para abrir ou fechar modal

  showModal() {
    this.setState({ showModal: true });
  }
  hideModal() {
    this.setState({ showModal: false });
  }
  editItem(item, index) {
    this.setState({
      showModal: true,
      modalEditMode: true,

      itemIndex: index,
      itemId: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      selectCategory: item.category_id,
    });
  }
  //#endregion

  render() {
    const { items, categories, loading, showModal, modalEditMode } = this.state;

    //#region Métodos para exibir informações na tela
    const selectCategory = () => {
      return (
        <select
          className="selectCategoryStatus"
          value={this.state.selectCategory}
          onChange={(e) => {
            this.setState({ selectCategory: e.target.value });
          }}
        >
          {categories.map((category, index) => {
            return (
              <option value={category.id} key={index}>
                {category.name}
              </option>
            );
          })}
        </select>
      );
    };

    const createItemModal = () => {
      return (
        <div className="row">
          {/** Formulário para que o administrador cadastre um usuário */}
          <form onSubmit={this.submit} className="genericForm">
            <h3>Criar Categoria</h3>
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
                type="number"
                min="0.01"
                max="1000.00"
                step="any"
                name="price"
                placeholder="Preço"
                required
                value={this.state.price}
                onChange={(e) => {
                  this.setState({ price: e.target.value });
                }}
              />
            </div>

            <div className="form-group">
              <textarea
                rows={4}
                name="description"
                placeholder="Comentários"
                value={this.state.description}
                onChange={(e) => {
                  this.setState({ description: e.target.value });
                }}
              />
            </div>

            {selectCategory()}

            <button className="submit-btn" type="submit" disabled={loading}>
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

    const productTable = (rows) => {
      return (
        <TableContainer component={Paper}>
          <Table /*className={classes.table}*/ aria-label="simple table">
            <TableHead /*className={classes.tableHead}*/>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="left">Descrição</TableCell>
                <TableCell align="left">Categoria</TableCell>
                <TableCell align="right">Disponível</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">R${row.price.toFixed(2)}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.category_name}</TableCell>
                  <TableCell align="right">
                    {row.category_active === 1 ? (
                      <CheckBox
                        className={
                          row.active === 1
                            ? "mui-checkBoxIcon mui-checkBoxIconActive"
                            : "mui-checkBoxIcon"
                        }
                        onClick={() => this.changeActiveStatusItem(row, index)}
                      />
                    ) : (
                      "Categoria indisponível"
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Edit
                      className="mui-editIcon"
                      onClick={() => this.editItem(row, index)}
                    />
                    <Delete
                      className="mui-deleteIcon"
                      onClick={(e) => {
                        this.deleteItem(row.id, index);
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
    //#endregion

    return (
      <div className="AppBackground paddedScreen">
        <div className="buttonsDiv">
          <Link to={"/funcionario/categorias"} className="button">
            Gerenciar Categorias
          </Link>

          <button className="button lastButton" onClick={this.showModal}>
            Criar Produto
          </button>
        </div>

        <Modal show={showModal} handleClose={this.hideModal}>
          {createItemModal()}
        </Modal>

        {loading ? <LoadingIcon fullScreen={true} /> : productTable(items)}
      </div>
    );
  }
}
