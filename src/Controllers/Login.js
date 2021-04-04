import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { Context } from "../Context/Context";

import LoginView from "../Views/LoginView";
import LoginGateway from "../Models/LoginGateway";
import ForgotPasswordView from "../Views/sub-pages/ForgotPasswordView";

//Controller da tela de login e registro
export default class Login extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página e definir o titulo da página
    window.scrollTo(0, 0);
    document.title = "Entrar";

    //Bind funções criadas
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.googleLogin = this.googleLogin.bind(this);

    this.requestPasswordCode = this.requestPasswordCode.bind(this);
    this.verifyPasswordCode = this.verifyPasswordCode.bind(this);
    this.updatePassword = this.updatePassword.bind(this);

    this.state = {
      logged: false,
      recoverPasswordMode: false,
    };
  }

  //#region Métodos para o registro e login de usuários
  //Realizar login
  async handleLogin(loginCredentials) {
    const { setUser } = this.context;

    const gateway = new LoginGateway();
    let response = await gateway.performLogin(loginCredentials);

    if (response.error) {
      return false;
    }

    setUser(response);
    this.setState({ logged: true });

    return true;
  }

  async googleLogin(googleLoginResult) {
    const { setUser } = this.context;

    if (googleLoginResult.error) {
      return false;
    }

    setUser(googleLoginResult);
    this.setState({ logged: true });
    return true;
  }

  //Realizar registro
  async handleRegister(registerCredentials) {
    let validated = this.validateRegisterValues(registerCredentials);

    //Se os valores informados são válidos, prosseguir
    if (validated) {
      const { setUser } = this.context;

      const gateway = new LoginGateway();
      let userData = await gateway.performRegister(registerCredentials);

      //Caso haja um erro com o processo (o email já tenha sido cadastrado), retornar false e terminar o processo
      if (userData.error) {
        return false;
      }

      setUser(userData);

      this.setState({ logged: true });
    }
  }

  //Realizar validação da senha
  validateRegisterValues(registerCredentials) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
    const { password, passwordConfirm, phone } = registerCredentials;

    if (phone.length < 10) {
      alert("Telefone curto demais");
      return false;
    }

    //Fazer uma validação da senha informada para ter entre 8 e 12 valores com simbolos ou numeros
    if (regexPassword.test(password)) {
      //Verificar se a senha é igual a senha de confirmação
      let passwordValidation = passwordConfirm === password;

      //Se a validação funcionar, prosseguir com o cadastro, se não, retornar erro
      if (passwordValidation) {
        return true;
      } else {
        alert("Senha e a confirmação de senha devem ser iguais");
        return false;
      }
    } else {
      //Alertar o usuário que a senha informada não atende as especificações
      alert(
        "Senha deve ter pelo menos entre 8 e 12 dígitos, contendo 1 letra maíuscula, 1 letra minúscula, e 1 numero"
      );
    }

    return false;
  }
  //#endregion

  //#region Métodos para recuperação de senha
  async requestPasswordCode(email) {
    const gateway = new LoginGateway();
    const response = await gateway.requestPasswordCode(email);

    return response;
  }

  async verifyPasswordCode(code) {
    const gateway = new LoginGateway();
    const response = await gateway.verifyPasswordCode(code);

    return response;
  }

  async updatePassword(passwords) {
    const validPassword = this.validatePasswordValues(passwords);

    if (!validPassword) {
      return { error: true };
    }

    const gateway = new LoginGateway();
    const response = await gateway.updatePassword(passwords);

    return response;
  }

  //Realizar validação dos dados
  validatePasswordValues(passwords) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
    const { password, passwordConfirm } = passwords;

    //Fazer uma validação da senha informada para ter entre 8 e 12 valores com simbolos ou numeros
    if (regexPassword.test(password)) {
      //Verificar se a senha é igual a senha de confirmação
      let passwordValidation = passwordConfirm === password;

      //Se a validação funcionar, prosseguir com o cadastro, se não, retornar erro
      if (passwordValidation) {
        return true;
      } else {
        alert("Senha e a confirmação de senha devem ser iguais");
        return false;
      }
    } else {
      //Alertar o usuário que a senha informada não atende as especificações
      alert(
        "Senha deve ter pelo menos entre 8 e 12 dígitos, contendo 1 letra maíuscula, 1 letra minúscula, e 1 numero"
      );
    }

    return false;
  }
  //#endregion

  render() {
    const { recoverPasswordMode } = this.state;

    //Verificar se o usuário já está logado. Caso ele já tenha entrado no site, redirectionar o usuário para a página principal
    if (!this.state.logged) {
      if (recoverPasswordMode) {
        return (
          <ForgotPasswordView
            requestPasswordCode={this.requestPasswordCode}
            verifyPasswordCode={this.verifyPasswordCode}
            updatePassword={this.updatePassword}
            cancelRecoveryProccess={() =>
              this.setState({ recoverPasswordMode: false })
            }
          />
        );
      }

      return (
        <LoginView
          handleLogin={this.handleLogin}
          handleRegister={this.handleRegister}
          handleGoogleLogin={this.googleLogin}
          recoverPassword={() => this.setState({ recoverPasswordMode: true })}
        />
      );
    } else {
      return <Redirect to="/perfil" />;
    }
  }
}
