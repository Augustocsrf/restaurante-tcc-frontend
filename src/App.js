import { Component } from "react";
import { UserContext } from "./Context/Context";
import Navbar from "./Components/NavBar/Navbar";
import { FooterContainer } from "./containers/footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./Styles/App.css";

//Importação das telas
import HomeView from "./Views/HomeView";
import Login from "./Controllers/Login";
import Menu from "./Controllers/Menu";
import OrderInformation from "./Controllers/OrderInformation";
import UserProfile from "./Controllers/UserProfile";

import StaffLogin from "./Controllers/StaffLogin";
import EditCategory from "./Controllers/EditCategory";
import RegisterStaff from "./Controllers/RegisterStaff";
import UserAddresses from "./Controllers/UserAddresses";
import Reservation from "./Controllers/Reservation";
import OrderConfirm from "./Controllers/OrderConfirm";
import ManageCategories from "./Controllers/ManageCategories";
import ManageProducts from './Controllers/ManageProducts'
import ManageReservations from "./Controllers/ManageReservations";



export default class App extends Component {
  render() {
    return (
      <div className="appBase">
        <UserContext>
          <Router>
            <Navbar />

            <Switch>
              {/* Rotas do lado do Cliente */}
              <Route path="/" exact component={HomeView} />
              <Route path="/login" exact component={Login} />
              <Route path="/cardapio" exact component={Menu} />
              <Route
                path="/pedido/informacoes"
                exact
                component={OrderInformation}
              />
              <Route
                path="/pedido/confirmar"
                exact
                component={OrderConfirm}
              />
              
              <Route path="/perfil" exact component={UserProfile} />
              <Route path="/reserva" exact component={Reservation} />

              <Route path="/perfil/enderecos" exact component={UserAddresses} />

              {/* Rotas do lado do Funcionário/Administrador */}
              <Route path="/funcionario/login" exact component={StaffLogin} />
              <Route
                path="/funcionario/produtos"
                exact
                component={ManageProducts}
              />
              <Route
                path="/funcionario/reservas"
                exact
                component={ManageReservations}
              />
    
              <Route
                path="/funcionario/categorias"
                exact
                component={ManageCategories}
              />
              <Route
                path="/funcionario/editar-categoria/:id"
                exact
                component={EditCategory}
              />
              <Route
                path="/admin/cadastrar-funcionario"
                exact
                component={RegisterStaff}
              />
            </Switch>

            <div className="footer">
              <FooterContainer />
            </div>
          </Router>
        </UserContext>
      </div>
    );
  }
}
