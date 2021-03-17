import React, { Component } from "react";

import { Context } from "../Context/Context";
import LoadingIcon from "../Components/LoadingIcon";
import GoogleLoginButton from "../Components/GoogleLoginButton";

import "../Styles/Login.css";

export default class LoginView extends Component {
  static contextType = Context;

  state = {
    loading: false,
    //Valores para login
    email: "",
    password: "",

    //Valores para registro
    emailRegister: "",
    passwordRegister: "",
    passwordConfirm: "",
    phone: "",
    name: "",
    lastName: "",
  };

  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  //#region Métodos para login e registro
  async handleLogin(e) {
    e.preventDefault();

    this.setState({ loading: true });

    await this.props.handleLogin({
      email: this.state.email,
      password: this.state.password,
    });

    this.setState({ loading: false });
  }

  async handleRegister(e) {
    e.preventDefault();
    this.setState({ loading: true });

    const {
      emailRegister: email,
      passwordRegister,
      passwordConfirm,
      phone,
      name,
      lastName,
    } = this.state;

    await this.props.handleRegister({
      email,
      password: passwordRegister,
      passwordConfirm,
      phone,
      name,
      lastName,
      permission: 1,
    });

    this.setState({ loading: false });
  }
  //#endregion

  render() {
    const { loading } = this.state;

    const startLoading = () => {
      this.setState({ loading: true });
    };

    const stopLoading = () => {
      this.setState({ loading: false });
    };

    return (
      <div className="App AppBackground">
        <div className="row">
          {/** Formulário para que o cliente realize login */}
          <form onSubmit={this.handleLogin} className="login-form">
            <h3>Entrar</h3>
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

            <p onClick={this.props.recoverPassword} id="forgotPasswordText">
              Esqueci minha senha
            </p>

            {loading ? (
              <LoadingIcon loading={loading} color="green" size="small" />
            ) : (
              <button className="submit-btn" type="submit">
                Entrar
              </button>
            )}

            <GoogleLoginButton
              onSuccess={startLoading}
              stopLoading={stopLoading}
              loginSuccessful={this.props.handleGoogleLogin}
            />
          </form>

          {/** Formulário para cliente se registrar no site */}
          <form onSubmit={this.handleRegister}>
            {/* Input do email para registro */}
            <h3>Cadastre-se</h3>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                required
                onChange={(e) => {
                  this.setState({ emailRegister: e.target.value });
                }}
              />
            </div>

            {/* Input da senha para registro */}
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                required
                onChange={(e) => {
                  this.setState({ passwordRegister: e.target.value });
                }}
              />
            </div>

            {/* Input da confirmação de senha para registro */}
            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirmação de Senha</label>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirmação de Senha"
                onChange={(e) => {
                  this.setState({ passwordConfirm: e.target.value });
                }}
              />
            </div>

            {/* Input do telefone para registro */}
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="Telefone"
                onChange={(e) => {
                  this.setState({ phone: e.target.value });
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
              <label htmlFor="lastName">Nome</label>
              <input
                type="text"
                name="lastName"
                placeholder="Sobrenome"
                required
                onChange={(e) => {
                  this.setState({ lastName: e.target.value });
                }}
              />
            </div>

            {loading ? (
              <LoadingIcon loading={loading} color="green" size="small" />
            ) : (
              <button className="submit-btn" type="submit">
                Registrar
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}
