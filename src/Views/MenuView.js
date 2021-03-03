import { Component } from "react";
import { Link } from "react-router-dom";

import LoadingIcon from "../Components/LoadingIcon";
import Modal from "../Components/Modal";
import ShoppingCart from "../DataTypes/ShoppingCart";

import "../Styles/Menu.css";

//View da página de cardápio
export default class MenuView extends Component {
  state = {
    category: [
      /*
      {
        nome: "category A",
        items: [
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
        ],
      },
      {
        nome: "Category B",
        items: [
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
          { nome: "A", preco: "B", descricao: "C" },
        ],
      },*/
    ],

    cart: new ShoppingCart(),
    showModal: false,
    loading: false,

    //Campos para manipular o item pedido
    selectedItem: { nome: "", id: "" },
    quantityToOrder: 1,
    comment: "",
    totalPrice: 0,
  };

  componentDidMount() {
    this.getMenus = this.getMenus.bind(this);
    this.addItemToCart = this.addItemToCart.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.calculateFullCartCost = this.calculateFullCartCost.bind(this);

    this.getMenus();
  }

  //Método para obter os cardápios
  async getMenus() {
    this.setState({ loading: true });
    let category = await this.props.getMenu();

    this.setState({ category, loading: false });
  }

  //Método para adicionar um item ao carrinho de compras
  addItemToCart(e) {
    e.preventDefault();

    const { name, id, price } = this.state.selectedItem;
    const newItem = {
      quantity: Number(this.state.quantityToOrder),
      comment: this.state.comment,
      price: Number(this.state.quantityToOrder) * price,
      name,
      id,
    };

    let { cart } = this.state;

    cart.addItem(newItem);

    this.setState({
      cart,
      showModal: false,
      selectedItem: { name: "", id: "" },
      quantityToOrder: 1,
      comment: "",
    });

    this.calculateFullCartCost();
    this.props.setShoppingCart(cart);
  }

  removeItemFromCart(index) {
    let { cart } = this.state;

    cart.removeItem(index);
    this.calculateFullCartCost();
    this.setState({ cart });
    this.props.setShoppingCart(cart);
  }

  showModal(item) {
    this.setState({ showModal: true, selectedItem: item });
  }

  hideModal() {
    this.setState({
      showModal: false,
      selectedItem: {},
      quantityToOrder: 1,
      comment: "",
    });
  }

  calculateFullCartCost() {
    let { cart } = this.state;
    let totalPrice = cart.totalCost();

    this.setState({ totalPrice });
  }

  render() {
    const { loading, cart } = this.state;

    //Modal para fazer o pedido de item
    let modal = () => {
      const { selectedItem: item } = this.state;

      return (
        <form className="addItemModal" onSubmit={this.addItemToCart}>
          <h3>{item.nome}</h3>

          <input
            type="number"
            required
            placeholder="Quantidade"
            min={1}
            value={this.state.quantityToOrder}
            onChange={(e) => this.setState({ quantityToOrder: e.target.value })}
          />

          <textarea
            rows={4}
            placeholder="Comentários"
            value={this.state.comment}
            onChange={(e) => this.setState({ comment: e.target.value })}
          />

          <button className="submit-btn" type="submit">
            Adicionar ao carrinho
          </button>

          <button className="cancel-btn" type="reset" onClick={this.hideModal}>
            Cancelar
          </button>
        </form>
      );
    };

    //Seção para o carrinho mostrado no fim da tela
    let cartSection = () => {
      return (
        <div className="menuCart">
          <h3>
            {" "}
            <i className="fas fa-shopping-cart"></i> Carrinho de Compras{" "}
          </h3>

          <div className="cartItemList">
            {cart.getCart().map((item, index) => {
              return (
                <div key={index} className="cartItem">
                  <div className="cartItemRow">
                    <p className="cartItemText">
                      <i
                        className="removeItemIcon fas fa-minus"
                        onClick={() => this.removeItemFromCart(index)}
                      ></i>{" "}
                      {item.quantity}x {item.name}
                    </p>

                    <p className="cartItemPrice">R${item.price.toFixed(2)}</p>
                  </div>

                  {item.comment === "" ? null : (
                    <p className="cartItemComment">{item.comment}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <p className="totalPriceText">
              Total: R${this.state.totalPrice.toFixed(2)}
            </p>
            {
              //Verificar se o usuário está cadastrado ou não.
              // Se estiver, o usuário pode prosseguir, se não, ele deve ir para o login para ser autenticado
              this.props.user.id === 0 ? (
                <Link className="loginLink" to="/login">
                  Usuário deve estar logado para prosseguir
                </Link>
              ) : //Verificar se o carrinho está vazio. Enquanto o carrinho estiver vazio, não permitir que ele prossiga com o pedido
              this.state.cart.isEmpty() ? (
                <button className="disabledLink" onClick={() => {}} disabled>
                  Prosseguir com pedido
                </button>
              ) : (
                <Link className="proceedLink" to="/pedido/informacoes">
                  Prosseguir com pedido
                </Link>
              )
            }
          </div>
        </div>
      );
    };

    if (loading) {
      return <LoadingIcon loading={loading} fullScreen={true} />;
    }

    return (
      <div className="detailedList AppBackground">
        <dl>
          {this.state.category.map((category, index) => {
            if (category.items.length === 0) {
              return null;
            }

            let itemList = category.items.map((item, index) => {
              return (
                <div className="menuItem" key={index}>
                  <i
                    className="addIcon fas fa-plus"
                    onClick={() => this.showModal(item)}
                  ></i>

                  <div className="detailedListItem">
                    <dt>{item.name}</dt>
                    <dd className="price">R${item.price}</dd>
                    <dd className="ingredients">{item.description}</dd>
                  </div>
                </div>
              );
            });

            return (
              <div key={index}>
                <h1 className="categoryName">{category.name}</h1>
                {itemList}
              </div>
            );
          })}
        </dl>

        <Modal show={this.state.showModal}>{modal()}</Modal>

        {cartSection()}
      </div>
    );
  }
}
