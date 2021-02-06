import React from "react";
import "../Styles/footer.css";
import { Link } from "react-router-dom";
import Footer from "../Components/footer";
import { Context } from "../Context/Context";

export function FooterContainer() {
  const { user } = React.useContext(Context);

  //Verificar se o usuário é cliente. Caso ele seja, mostrar a opção de logar como funcionário,
  // se não, mostrar as opçõesd e navegação de funcionário
  let staffColumn = () => {
    const isUserClient = user.isUserClient();
    const isUserGuest = user.isUserGuest();

    if (isUserClient || isUserGuest ) {
      return (
        <Footer.Column>
          <Footer.Title>Funcionário</Footer.Title>

          <Link className="routeLink" to="/funcionario/login">
            <Footer.Link href="#">Entrar </Footer.Link>
          </Link>
        </Footer.Column>
      );
    } else {
      return (
        <Footer.Column>
          <Footer.Title>Funcionário</Footer.Title>

          <Link className="routeLink" to="/funcionario/pedidos">
            <Footer.Link>Pedidos</Footer.Link>
          </Link>

          <Link className="routeLink" to="/funcionario/reservas">
            <Footer.Link>Reservas</Footer.Link>
          </Link>
          {
            //Adicionar opções exclusivas de administrador como editar cardápio e gerenciar funcionários
            // caso o usuário tenha permissão de administrador
            user.isUserAdmin() ? (
              <div>
                <Link className="routeLink" to="/funcionario/produtos">
                  <Footer.Link>Produtos</Footer.Link>
                </Link>

                <Link className="routeLink" to="/funcionario/relatorios">
                  <Footer.Link>Relatórios</Footer.Link>
                </Link>
              </div>
            ) : null
          }
        </Footer.Column>
      );
    }
  };

  return (
    <Footer>
      <Footer.Wrapper>
        <Footer.Row>
          <Footer.FirstColumn>
            <Footer.Title>Restaurante TCC</Footer.Title>
            <p>Rua A, num; Bairro. Cidade-Estado</p>
            <p>(99) 99999-9999</p>
            <p>Aberto Terça a Domingo, 18:00 a 00:00</p>
          </Footer.FirstColumn>

          <Footer.Column>
            <Footer.Title>Social</Footer.Title>
            <Footer.Link href="#">Instagram</Footer.Link>
            <Footer.Link href="#">Facebook</Footer.Link>
            <Footer.Link href="#">Twitter</Footer.Link>
          </Footer.Column>

          {staffColumn()}
        </Footer.Row>
      </Footer.Wrapper>
    </Footer>
  );
}
