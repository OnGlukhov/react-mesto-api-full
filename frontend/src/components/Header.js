import React from "react";
import { Route, Link } from "react-router-dom";
import logo from "../images/logo.svg";
const Header = ({ signOut, headerEmail }) => {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Места России" />
      <Route exact path="/">
        <div className="header__info">
          <p className="header__email">{headerEmail}</p>
          <Link className="header__link" to="/sign-in" onClick={signOut}>
            Выйти
          </Link>
        </div>
      </Route>
      <Route path="/sign-in">
        <div className="header__info">
          <Link className="header__link" to="/sign-up">
            Регистрация
          </Link>
        </div>
      </Route>
      <Route path="/sign-up">
        <div className="header__info">
          <Link className="header__link" to="/sign-in">
            Войти
          </Link>
        </div>
      </Route>
    </header>
  );
};

export default Header;
