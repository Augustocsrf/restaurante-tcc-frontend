import React, { Component } from "react";
import LoadingIcon from "../Components/LoadingIcon";
import "../Styles/generic/GenericForm.css";

export default class StaffLoginForm extends Component {
  state = {
    loading: false,

    email: "",
    password: "",
  };

  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  async submit(e) {
    e.preventDefault();
    this.setState({ loading: true });

    //Passar dados informados no formulário para realizar login
    await this.props.handleLogin({
      email: this.state.email,
      password: this.state.password,
    });

    this.setState({ loading: false })
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="row AppBackground">
        {/** Formulário para que o funcionário realize login */}
        <form onSubmit={this.submit} className="login-form">
          <h3>Entrar como Funcionário</h3>
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

          {loading ? (
            <LoadingIcon confirmButton={true} />
          ) : (
            <button className="submit-btn" type="submit">
              Entrar
            </button>
          )}
        </form>
      </div>
    );
  }
}
