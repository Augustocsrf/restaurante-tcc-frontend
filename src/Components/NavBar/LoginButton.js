import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from './MenuItems';
import "./LoginButton.css";

const STYLES = ["btn--primary", "btn--outline"];

const SIZES = ["btn--medium", "btn--large"];

export const LoginButton = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}) => {
  const loginUrlInfo = MenuItems[MenuItems.length - 1];
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <Link
      className={`btn ${checkButtonStyle} ${checkButtonSize}`}
      onClick={onClick}
      to={loginUrlInfo.url}
      type={type}
    >
      {" "}
      {children}{" "}
    </Link>
  );
};
