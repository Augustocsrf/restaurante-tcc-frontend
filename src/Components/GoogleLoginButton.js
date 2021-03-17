import React from "react";

import Axios from "axios";
import { GoogleLogin } from "react-google-login";
// import { USER_PERMISSIONS } from "../DataTypes/User";
import api, { defaultError } from "../Services/api";

const clientId =
  "532232335193-lmbou9etbi0jfol8jknbh5f0tiklhl5s.apps.googleusercontent.com";

export default class GoogleLoginButton extends React.Component {
  constructor(props) {
    super(props);

    this.loginGoogle = this.loginGoogle.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  async loginGoogle(googleData) {
    console.log(googleData);

    const {
      email,
      givenName: name,
      familyName: lastName,
      googleId: password,
    } = googleData.profileObj;

    const sendData = {
      email,
      name,
      lastName,
      password,
      googleId: password,
    };
    var returnUserData;

    await api
      .post("login/google", sendData)
      .then((response) => {
        const {
          id,
          email,
          name,
          lastName,
          phone,
          api_token: apiToken,
          email_verified_at,
          permission,
        } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission,
          email_verified_at,
        };

        Axios.defaults.headers.common["Authorization"] = "Bearer " + apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    this.props.loginSuccessful(returnUserData);
    this.props.stopLoading();
    return returnUserData;
  }

  onSuccess(res) {
    if (this.props.onSuccess !== undefined) {
      this.props.onSuccess();
    }

    this.loginGoogle(res);
  }

  onFailure(res) {
    this.props.stopLoading();
  }

  render() {
    const { onSuccess, onFailure } = this;

    return (
      <div>
        <GoogleLogin
          clientId={clientId}
          buttonText="Entrar pelo Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          style={{ width: "100%" }}
          //isSignedIn={true}
        />
      </div>
    );
  }
}
