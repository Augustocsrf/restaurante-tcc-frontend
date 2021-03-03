import React from "react";

import "../Styles/App.css";
import "../Styles/Home.css";

export default class HomeView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="App AppBackground">
        <h1>Home Page</h1>

        <div className="rowInfo">
          <img
            src="https://img.huffingtonpost.com/asset/5d40b0c0260000b00f045df4.jpeg"
            alt="Girl in a jacket"
            width="300"
            height="300"
          ></img>

          <div className="rowText">
            <h3>Novo Corte de Carne!</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              in purus id tortor mattis vestibulum. Curabitur tellus odio,
              congue a nisi in, scelerisque fringilla quam. Nam vitae luctus mi,
              sit amet congue est. Suspendisse potenti. Pellentesque hendrerit
              mauris ac dignissim pulvinar. Praesent laoreet condimentum
              pulvinar. Maecenas rutrum enim dui, nec eleifend nisi tempor nec.
              Curabitur commodo dapibus diam, non pulvinar nunc varius et. Nulla
              eleifend ac nunc eget rutrum. Maecenas eu luctus augue. Integer
              ornare erat justo, in suscipit urna facilisis et. Duis eu elit a
              risus fermentum cursus.
            </p>
          </div>
        </div>

        <div className="rowInfo reverseRow">
          <img
            src="https://img.huffingtonpost.com/asset/5d40b0c0260000b00f045df4.jpeg"
            alt="Girl in a jacket"
            width="300"
            height="300"
          ></img>

          <div className="rowText">
            <h3>Novo Corte de Carne!</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              in purus id tortor mattis vestibulum. Curabitur tellus odio,
              congue a nisi in, scelerisque fringilla quam. Nam vitae luctus mi,
              sit amet congue est. Suspendisse potenti. Pellentesque hendrerit
              mauris ac dignissim pulvinar. Praesent laoreet condimentum
              pulvinar. Maecenas rutrum enim dui, nec eleifend nisi tempor nec.
              Curabitur commodo dapibus diam, non pulvinar nunc varius et. Nulla
              eleifend ac nunc eget rutrum. Maecenas eu luctus augue. Integer
              ornare erat justo, in suscipit urna facilisis et. Duis eu elit a
              risus fermentum cursus.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

/**
 *   test = async () => {
    await axios
      .post(
        "https://augustotcc.com.br/tc/main.php",
        JSON.stringify({ id: 3 }),
        {
          params: { a: "yay", b: "love" },
        }
      )
      .then((response) => {
        console.log(response);
        axios.defaults.headers.common["Authorization"] = response.data;
      });
  };

  test2 = async () => {
    await axios
      .post("https://augustotcc.com.br/tc/testToken.php")
      .then((response) => {
        console.log(response);
      });
  };

 */
