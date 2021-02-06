import React from "react";
import Axios from "axios";
import { GoogleLogin } from "react-google-login";
import { USER_PERMISSIONS } from "../DataTypes/User";
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
    };
    var returnUserData;

    await api
      .post("login/google", sendData)
      .then((response) => {
        console.log(response.data);

        const {
          id,
          email,
          name,
          lastName,
          phone,
          api_token: apiToken,
        } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
        };

        Axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true };
      });

    this.props.loginSuccessful(returnUserData)
    this.props.stopLoading()
    return returnUserData;
  }

  onSuccess(res) {
    console.log(res);

    if (this.props.onSuccess !== undefined) {
      this.props.onSuccess();
    }

    this.loginGoogle(res);

    //console.log('Login Success: currentUser:', res.profileObj);
    //alert(
    //`Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    //);
  }

  onFailure(res) {
    this.props.stopLoading()
    console.log(res);

    /*
        console.log('Login failed: res:', res);
        alert(
          `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
        );
        */
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

/*


function Login() {

  const 

  async loginGoogle(googleData){
    var returnUserData;

    await api
      .post("login/google", googleData)
      .then((response) => {
        console.log(response.data)
        const { id, email, name, lastName, phone, api_token: apiToken  } = response.data;

        const user = {
          id,
          email,
          name,
          lastName,
          phone,
          apiToken,
          permission: USER_PERMISSIONS.CLIENT,
        };

        Axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.apiToken;

        returnUserData = user;
      })
      .catch((e) => {
        defaultError(e);
        returnUserData = { error: true }
      });

    return returnUserData;
  }

  
}

export default Login;
*/
