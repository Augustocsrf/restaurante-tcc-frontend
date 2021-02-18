import { Component } from "react";
import { Redirect } from "react-router-dom";
import { Context } from "../Context/Context";
import RegisterStaffGateway from "../Models/RegisterStaffGateway";
import RegisterStaffView from "../Views/RegisterStaffView";

//Controller da tela de registro de novos funcionários
export default class RegisterStaff extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    //Mandar tela para o topo da página
    window.scrollTo(0, 0);
    
    //Bind funções criadas
    this.handleStaffRegister = this.handleStaffRegister.bind(this);
  }

  //Realizar registro do funcionário
  async handleStaffRegister(registerCredentials) {
    let validated = this.validateRegisterValues(registerCredentials);

    if (validated) {
      const gateway = new RegisterStaffGateway();
      let responseData = await gateway.handleStaffRegister(registerCredentials);

      if (responseData.success) {
        alert(responseData.message);
        this.props.history.goBack();
      } else {
        alert(responseData.message);
      }
    }
  }

  validateRegisterValues(registerCredentials) {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,12}$/;
    const { password, passwordConfirm } = registerCredentials;

    //Verificar se a senha é igual a senha de confirmação
    let passwordValidation = passwordConfirm === password;

    //Se a validação funcionar, prosseguir com a verificação, se não retornar erro
    if (passwordValidation) {
      if (regexPassword.test(password)) {
        return true;
      } else {
        alert("Senha deve ter pelo menos 7 digitos e 1 numero");
        return false;
      }
    } else {
      alert("Senha e a confirmação de senha devem ser iguais");
      return false;
    }
  }

  render() {
    const { user } = this.context;

    //Verificar se o usuário tem a permissão para entrar nessa página, se não, retornar ele para a tela de login de funcionário
    if (!user.isUserAdmin()) {
      return <Redirect to="/funcionario/login" />;
    }

    return <RegisterStaffView handleStaffRegister={this.handleStaffRegister} />;
  }
}
