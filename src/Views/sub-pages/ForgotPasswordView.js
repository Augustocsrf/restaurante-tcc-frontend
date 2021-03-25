import React, { Component } from "react";
import LoadingIcon from "../../Components/LoadingIcon";

export default class ForgotPasswordView extends Component {
  state = {
    codeRecoveryStatus: 0, // Váriavel para marcar em que passo da recuperação o processo está

    users_id: undefined,
    email: "",
    code: "",
    password: "",
    passwordConfirm: "",
  };

  componentDidMount() {
    this.submitForCode = this.submitForCode.bind(this);
    this.submitForVerification = this.submitForVerification.bind(this);
    this.submitNewPassword = this.submitNewPassword.bind(this);
  }

  //Método para enviar o documento para requisitar código
  async submitForCode(e) {
    e.preventDefault();
    this.setState({ loading: true });

    const response = await this.props.requestPasswordCode(this.state.email);

    if (!response.error) {
      alert(response.message);

      this.setState({
        loading: false,
        codeRecoveryStatus: 1,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  //Método para enviar código para verificação
  async submitForVerification(e) {
    e.preventDefault();
    this.setState({ loading: true });

    const response = await this.props.verifyPasswordCode(this.state.code);

    if (!response.error) {
      alert(response.message);

      this.setState({
        users_id: response.recoverCode.users_id,
        loading: false,
        codeRecoveryStatus: 2,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  //Método para enviar nova senha
  async submitNewPassword(e) {
    e.preventDefault();

    this.setState({ loading: true });

    const { password, passwordConfirm } = this.state;

    const response = await this.props.updatePassword({
      id: this.state.users_id,
      password,
      passwordConfirm,
    });

    if (!response.error) {
      alert(response.message);

      this.setState({
        loading: false,
        codeRecoveryStatus: 3,
      });

      this.props.cancelRecoveryProccess();
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { submitForCode, submitForVerification, submitNewPassword } = this;
    const { code, email, password, passwordConfirm, loading } = this.state;

    //Formulário para informar o email e requisitar o código
    const codeRequisitionForm = () => {
      return (
        <form onSubmit={submitForCode}>
          <p>Informe o seu email</p>

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => {
              this.setState({ email: e.target.value });
            }}
          />

          {loading ? (
            <LoadingIcon />
          ) : (
            <button className="submit-btn" type="submit">
              Requisitar código
            </button>
          )}

          <button
            className="cancel-btn"
            type="reset"
            onClick={this.props.cancelRecoveryProccess}
          >
            Cancelar
          </button>
        </form>
      );
    };

    //Formulário para informar
    const codeVerificationForm = () => {
      return (
        <form onSubmit={submitForVerification}>
          <p>Informe o código recebido do seu email</p>

          <input
            type="text"
            name="code"
            placeholder="Código"
            required
            value={code}
            onChange={(e) => {
              this.setState({ code: e.target.value });
            }}
          />

          {loading ? (
            <LoadingIcon />
          ) : (
            <button className="submit-btn" type="submit">
              Enviar código
            </button>
          )}

          <button
            className="cancel-btn"
            type="reset"
            onClick={this.props.cancelRecoveryProccess}
          >
            Cancelar
          </button>
        </form>
      );
    };

    //Formulário para informar a nova senha
    const newPasswordForm = () => {
      return (
        <form onSubmit={submitNewPassword}>
          <p>Informe sua nova senha</p>

          <input
            type="text"
            name="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => {
              this.setState({ password: e.target.value });
            }}
          />

          <input
            type="text"
            name="password"
            placeholder="Confirmar Senha"
            required
            value={passwordConfirm}
            onChange={(e) => {
              this.setState({ passwordConfirm: e.target.value });
            }}
          />

          {loading ? (
            <LoadingIcon />
          ) : (
            <button className="submit-btn" type="submit">
              Atualizar Senha
            </button>
          )}

          <button
            className="cancel-btn"
            type="reset"
            onClick={this.props.cancelRecoveryProccess}
          >
            Cancelar
          </button>
        </form>
      );
    };

    //Método para selecionar qual formulário deverá ser disposto
    const selectCode = () => {
      const { codeRecoveryStatus } = this.state;

      switch (codeRecoveryStatus) {
        case 0:
          return codeRequisitionForm();

        case 1:
          return codeVerificationForm();

        case 2:
          return newPasswordForm();

        default:
          break;
      }
    };

    return (
      <div className="App AppBackground">
        <div className="row">{selectCode()}</div>
      </div>
    );
  }
}
