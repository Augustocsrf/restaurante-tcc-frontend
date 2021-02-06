import React, { Component } from "react";
import "../Styles/footer.css";
import { Link } from "react-router-dom";
import Footer from "./Footer_2";
import { Context } from "../Context/Context";

export default class Footer extends Component{
    static contextType = Context;
}