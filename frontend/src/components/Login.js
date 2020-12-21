import React from "react";
const Login = ({ handleLogin }) => {
  const [data, setData] = React.useState({
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
      console.log("Одно из полей не заполнено!");
      return;
    }

    setData({
      ...data,
      password: "",
    });
    handleLogin(data);
    resetForm();
  };

  return (
    <>
      <div className="auth-section">
        <form onSubmit={handleSubmit} className="auth-section__form">
          <h3 className="auth-section__title">Вход</h3>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="auth-section__input"
            minLength="2"
            maxLength="40"
            required
            id="email"
            onChange={handleChange}
            value={data.email || ""}
          />
          <span id="auth-section-email-error" className="error"></span>
          <input
            type="password"
            placeholder="Пароль"
            name="password"
            value={data.password || ""}
            className="auth-section__input"
            minLength="2"
            maxLength="32"
            required
            id="password"
            onChange={handleChange}
          />
          <span id="auth-section-password-error" className="error"></span>
          <button className="auth-section__button" type="submit">
            Войти
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
