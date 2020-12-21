import React, { useState } from "react";
import { Link } from "react-router-dom";
const Register = ({ handleRegister }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setData({ ...data, [name]: value });
  };
  const resetForm = () => {
    setData("");
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!data.email || !data.password) {
      console.log("Некорректно заполнено одно из полей");
      return;
    }
    handleRegister(data);
    resetForm();
  };
  return (
    <>
      <div className="auth-section">
        <form onSubmit={handleSubmit} className="auth-section__form">
          <h3 className="auth-section__title">Регистрация</h3>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={data.email || ""}
            className="auth-section__input"
            minLength="2"
            maxLength="40"
            required
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Пароль"
            name="password"
            value={data.password || ""}
            className="auth-section__input"
            minLength="2"
            maxLength="32"
            required
            onChange={handleChange}
          />
          <button className="auth-section__button" type="submit">
            Зарегистрироваться
          </button>
          <p className="auth-section__text">
            Уже зарегистрированы?{" "}
            <Link className="auth-section__entry" to="/sign-in">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};
export default Register;
