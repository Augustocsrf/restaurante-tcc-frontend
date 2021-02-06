import { Component } from "react";
import { Link } from "react-router-dom";
import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";
import "../Styles/ManageProducts.css";

export default class ManageProductsView extends Component {
  state = {
    items: [],
    categories: [],
    showModal: false,
    modalEditMode: false,

    page: 1,
    totalItems: 60,

    itemIndex: 0,
    itemId: "",
    name: "",
    price: undefined,
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

    const items = await this.props.getProductPage(this.state.page);

    const categories = await this.props.getAllCategories();

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

  async getItemPages(){
    this.setState({ loading: true });

    const items = await this.props.getProductPage(this.state.page);

    this.setState({ loading: false, items });
  }

  //#region  Métodos para manipular items
  async deleteItem(id, index) {
    let { items } = this.state;
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

  async submit(e) {
    //Previnir evento padrão
    e.preventDefault();

    this.setState({ loading: true });

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
      categoryId,
      description,
      price: Number(price).toFixed(2),
      id
    };

    //Verificar se o modal estava com modo de edição. Se não, utilizar função de criar item, se sim, utilizar função de editar item
    if (!modalEditMode) {
      const newItem = await this.props.createItem(itemData);
      items.push(newItem);
    } else {
      const editItem = await this.props.updateItem(itemData);

      editItem.price = Number(editItem.price)
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
      price: undefined,
      description: "",
      selectCategory: "",
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
  editItem(item, index){
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

    const productList = () => {
      return items.map((item, index) => {
        return (
          <div key={index} className="productItem">
            <div>
              <h3>{item.name}</h3>
              <p>{item.category_name}</p>
              <p>R${item.price.toFixed(2)}</p>
              <p>{item.description}</p>
            </div>

            <div className="iconDiv">
              <i
                className="fas fa-edit editIcon"
                onClick={() => this.editItem(item, index)}
              ></i>

              <i
                className="fas fa-trash deleteIcon"
                onClick={() => this.deleteItem(item.id, index)}
              ></i>
            </div>
          </div>
        );
      });
    };

    const pageList = () => {
      const pages = this.state.totalItems / 10;

      return (
        <div className="pagination">
          <a href="#">&laquo;</a>
          <a href="#">1</a>
          <a className="active" href="#">2</a>
          <a href="#">3</a>
          <a href="#">4</a>
          <a href="#">5</a>
          <a href="#">6</a>
          <a href="#">&raquo;</a>
        </div>
      );
    }
    //#endregion

    return (
      <div className="AppBackground ManageProductsView">
        <div className="buttonsDiv">
          <Link to={"/funcionario/caegorias"} className="button">
            Gerenciar Categorias
          </Link>

          <button className="button lastButton" onClick={this.showModal}>
            Criar Produto
          </button>
        </div>

        <Modal show={showModal} handleClose={this.hideModal}>
          {createItemModal()}
        </Modal>

        {pageList()}

        {loading ? <LoadingIcon fullScreen={true} /> : productList()}

      </div>
    );
  }
}
