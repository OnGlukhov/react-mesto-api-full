import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import * as api from '../utils/api';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";
import Union from "../images/Union.png";
import Rectangle from "../images/Rectangle.png";

function App() {
  // Переменные внутреннего состояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );

  const [isCardSelected, setIsCardSelected] = React.useState(false);
  const [dataImage, setDataImage] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState("");
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [forInfoTool, setForInfoTool] = React.useState({
    title: "",
    icon: "",
  });

  const [token, setToken] = React.useState('');
  // Удаление карточки
  function handleCardDelete(card) {
    api
      .removeCard(card._id, token)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Лайк
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в api и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        // Обновляем стейт
        setCards(newCards);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Открытие попапов
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick() {
    setIsCardSelected(true);
  }
  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }
  // Закрытие попапов
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardSelected(false);
    setDataImage({});
    setIsInfoTooltipOpen(false);
  }

  // Попап изображения
  const setImage = (card) => {
    setDataImage(card);
    handleCardClick();
  };

  // Изменение данных пользователя
  function handleUpdateUser(user) {

    api
      .patchProfileInfo(user, token)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Изменение аватара пользователя
  function handleUpdateAvatar(avatar) {
    api
      .setUserAvatar(avatar, token)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Добавление новой карточки
  function handleAddPlaceSubmit(newCard) {
    api
      .newCardAdd(newCard, token)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // Запрос начальных карточек, профиля
  React.useEffect(() => {
    Promise.all([api.getUserInfo(token), api.getInitialCards(token)])

      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const history = useHistory();

  function tokenCheck() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setToken(jwt);
      auth
        .getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserData(res.email);
            history.push("/");
          } else {
            setForInfoTool({
              title: "Что-то пошло не так! Попробуйте ещё раз.",
              icon: Rectangle,
            });
            handleInfoTooltipOpen();
          }
        })
        .catch((err) => console.log(err));
    }
  }
  function signOut() {
    setLoggedIn(false);
    setUserData("");
    localStorage.removeItem("jwt");
    history.push("/sign-in");
  }

  React.useEffect(() => {
    tokenCheck();
  }, []);

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        history.push("/sign-in");
        setForInfoTool({
          title: "Вы успешно зарегистрировались!",
          icon: Union,
        });
        handleInfoTooltipOpen();
      })
      .catch((err) => {
        console.error(err);
        setForInfoTool({
          title: "Что-то пошло не так! Попробуйте ещё раз.",
          icon: Rectangle,
        });
        handleInfoTooltipOpen();
      });
  }

  function handleLogin(email, password) {
    auth.login(email, password)
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem('jwt', data.token);
          setToken(data.token);
        auth.getContent(data.token)
          .then((res) => {
            setUserData(res.email);
          })
          .catch((err) => {
            setForInfoTool({
              title: "Что-то пошло не так! Попробуйте ещё раз.",
              icon: Rectangle,
            });
            console.error(err);
            handleInfoTooltipOpen();
          });
        localStorage.setItem("jwt", data.token);
        setLoggedIn(true);
        history.push("/");
        }
      })
      .catch((err) => {
        setForInfoTool({
          title: "Что-то пошло не так! Попробуйте ещё раз.",
          icon: Rectangle,
        });
        console.error(err);
        handleInfoTooltipOpen();
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <Header headerEmail={userData} signOut={signOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            loggedIn={loggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            clickImages={setImage}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route path="/sign-up">
            <Register handleRegister={handleRegister} />
          </Route>
          <Route path="/sign-in">
            <Login handleLogin={handleLogin} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        {/* <PopupWithForm name='delete' title="Вы уверенны?" isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}>
        <button className="popup__button popup__button_type_delete" type="submit">Да</button>
      </PopupWithForm> */}
        <ImagePopup
          isOpen={isCardSelected}
          onClose={closeAllPopups}
          image={dataImage}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={forInfoTool.title}
          icon={forInfoTool.icon}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
