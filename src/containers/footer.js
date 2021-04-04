import React from "react";
import { Link } from "react-router-dom";

import Footer from "../Components/footer";
import { Context } from "../Context/Context";

import "../Components/footer/styles/footer.css";

export class FooterContainer extends React.Component {
  static contextType = Context;

  render() {
    const { user } = this.context;

    //Verificar se o usuário é cliente. Caso ele seja, mostrar a opção de logar como funcionário,
    // se não, mostrar as opçõesd e navegação de funcionário
    let staffColumn = (mobile) => {
      const isUserStaff = user.isUserStaff();
      const isUserAdmin = user.isUserAdmin();

      if (isUserStaff || isUserAdmin) {
        return (
          <Footer.Column
            id={mobile ? "mobileStaffFooterColumn" : "desktopStaffFooterColumn"}
          >
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
              isUserAdmin ? (
                <div>
                  <Link className="routeLink" to="/admin/produtos">
                    <Footer.Link>Produtos</Footer.Link>
                  </Link>

                  <Link className="routeLink" to="/admin/funcionarios">
                    <Footer.Link>Funcionários</Footer.Link>
                  </Link>

                  <Link className="routeLink" to="/admin/relatorios">
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
            {staffColumn(true)}
            <Footer.FirstColumn>
              <Footer.Title>Restaurante TCC</Footer.Title>
              <p>Rua A, num; Bairro. Cidade-Estado</p>
              <p>(99) 99999-9999</p>
              <p>Aberto para pedidos a qualquer momento!</p>
              <p>Aberto para reservas todas as noites, 18:00 a 00:00</p>
            </Footer.FirstColumn>

            <Footer.Column>
              <Footer.Title>Social</Footer.Title>
              <Footer.Link>
                <a
                  href="https://www.instagram.com/"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <i
                    className="fab fa-instagram"
                    style={{ marginRight: "2%" }}
                  ></i>
                  Instagram
                </a>
              </Footer.Link>

              <Footer.Link>
                <a
                  href="https://www.facebook.com/"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <i
                    className="fab fa-facebook"
                    style={{ marginRight: "2%" }}
                  ></i>
                  Instagram
                </a>
              </Footer.Link>

              <Footer.Link href="#">
                <a
                  href="https://www.twitter.com/"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <i
                    className="fab fa-twitter"
                    style={{ marginRight: "2%" }}
                  ></i>
                  Twitter
                </a>
              </Footer.Link>
            </Footer.Column>

            {staffColumn()}
          </Footer.Row>
        </Footer.Wrapper>
      </Footer>
    );
  }
}
