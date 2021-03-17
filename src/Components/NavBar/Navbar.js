import { Component } from "react";
import { MenuItems, ProfileLink } from "./MenuItems";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";

import "./Navbar.css";

class Navbar extends Component {
  static contextType = Context;
  state = {
    clicked: false,
  };

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    const { user } = this.context;

    return (
      <nav className="NavbarItems">
        <Link to="/" className="navbar-text">
          <h1>Restaurante TCC</h1>
        </Link>

        <div className="menu-icon" onClick={this.handleClick}>
          <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}>
            {" "}
          </i>
        </div>

        <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => {
            //Se o usuário for um cliente e estiver logado, mostrar um link para o cliente ao invés de um link para a tela de login
            if (index === MenuItems.length - 1 && user.id !== 0) {
              return (
                <li key={index}>
                  <Link
                    // className={ProfileLink.cName}
                    className={
                      this.state.clicked
                        ? ProfileLink.cName
                        : ProfileLink.cName + " inactive"
                    }
                    to={ProfileLink.url}
                    onClick={this.handleClick}
                  >
                    {user.name}
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <Link
                    //className={item.cName}
                    className={
                      this.state.clicked ? item.cName : item.cName + " inactive"
                    }
                    to={item.url}
                    onClick={this.handleClick}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
