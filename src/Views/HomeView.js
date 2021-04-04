import React from "react";

import { Link } from 'react-router-dom'

import "../Styles/App.css";
import "../Styles/Home.css";

export default class HomeView extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    document.title = "Restaurante TC";
  }

  render() {
    return (
      <div className="App AppBackground">
        <div className="rowInfo">
          <Link to='/cardapio'>
            <img
              src="https://img.huffingtonpost.com/asset/5d40b0c0260000b00f045df4.jpeg"
              alt="Carne"
              width="200"
              height="200"
            ></img>
          </Link>

          <div className="rowText">
            <h3>Novo Corte de Carne!</h3>
            <p>
              Venha provar o nosso novo prato de Churrasco de Picanha por R$
              50,00!
            </p>
          </div>
        </div>

        <div className="rowInfo reverseRow">
        <Link to='/reserva'>
          <img
            // src="https://img.huffingtonpost.com/asset/5d40b0c0260000b00f045df4.jpeg"
            src="https://s2.glbimg.com/ALYlmLC3Y4JiF10nvoWU575IdWZYystt0socr-vcW15Ioz-HdGixxa_8qOZvMp3w/e.glbimg.com/og/ed/f/original/2013/08/26/top_10_restaurante_industrial_03.jpg"
            alt="Restaurante"
            width="200"
            height="200"
          ></img>
        </Link>

          <div className="rowText">
            <h3>Faça a sua Reserva!</h3>
            <p>
              Estamos abertos das 18h à meia-noite. Faça a sua reserva e guarde
              seu lugar conosco de terça a domingo!
            </p>
          </div>
        </div>
      </div>
    );
  }
}
