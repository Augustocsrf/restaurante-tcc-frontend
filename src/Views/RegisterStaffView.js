import React, { Component } from "react";
import "../Styles/generic/GenericForm.css";

export default class RegisterStaffView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
      lastName: "",
    };
  }

  submit = (e) => {
    e.preventDefault();

    //Passar dados informados no formulário para realizar login
    this.props.handleStaffRegister({
      ...this.state,
    });
  };

  render() {
    return (
      <div className="row AppBackground">
        {/** Formulário para que o administrador cadastre um usuário */}
        <form onSubmit={this.submit} className="login-form">
          <h3>Cadastrar Funcionário</h3>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              required
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
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
            <label htmlFor="passwordConfirm">Confirmar Senha</label>
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

          {/* Input do nome para registro */}
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              required
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
            />
          </div>

          {/* Input do sobrenome para registro */}
          <div className="form-group">
            <label htmlFor="lastname">Sobrenome</label>
            <input
              type="text"
              name="lastname"
              placeholder="Sobrenome"
              required
              onChange={(e) => {
                this.setState({ lastName: e.target.value });
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
