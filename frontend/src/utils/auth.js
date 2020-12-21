import { BASE_URL } from './utils';

const checkResponse = (response) =>
  response.ok ? response.json() : Promise.reject(`Ошибка: ${response.status}`);

  const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
};

const login = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then(checkResponse);
};

const getContent = (token) => {
  if (token) {
    return fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }).then(checkResponse);
  }
};

export { register, login, getContent };
