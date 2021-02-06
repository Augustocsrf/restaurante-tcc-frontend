import { Component } from "react";
import "../Styles/generic/GenericForm.css";

export default class EditCategoryView extends Component {
  state = {
    id: this.props.id,
    name: "",
  };

  constructor(props) {
    super(props);

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(e) {
    e.preventDefault();

    const { id, name } = this.state;

    this.props.updateCategory({
      id,
      name,
    });
  }

  render() {
    return (
      <div className='row AppBackground'>
        {/** Formulário para que o cliente realize login */}
        <form onSubmit={this.handleUpdate} className="login-form">
          <h3>Editar Categoria</h3>

          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="name"
              name="name"
              placeholder="Nome da Categoria"
              required
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />
          </div>

          <button className="submit-btn" type="submit">
            Entrar
          </button>
        </form>
      </div>
    );
  }
}
