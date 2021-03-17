import { Component } from "react";
import {
  formatPermission,
  formatPhone,
} from "../../Services/FormatterFunctions";

export default class UnconfirmedUserProfileView extends Component {
  state = {
    code: "",
  };

  componentDidMount() {
    this.verifyCode = this.verifyCode.bind(this);
  }

  async verifyCode(e) {
    e.preventDefault();

    const { code } = this.state;

    try {
      await this.props.confirmEmail(code);
    } catch (e) {
      // console.log(e);
    }
  }

  render() {
    const { user, logout } = this.props;
    const { code } = this.state;

    return (
      <div className="AppBackground">
        <div className="profileBox">
          <h2>
            {user.name} {user.lastName}
          </h2>
          <p>{formatPermission(user.permission)}</p>
          <p>{user.email}</p>
          <p>{formatPhone(user.phone)}</p>

          <div className="row">
            <form onSubmit={this.verifyCode} className="genericForm">
              <h3>Código para Confirmar Email</h3>
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

              <button className="submit-btn" type="submit">
                Confirmar
              </button>
            </form>
          </div>
          <button
            id="logout-btn"
            style={{ marginLeft: "auto", marginRight: "auto" }}
            onClick={() => logout()}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }
}
