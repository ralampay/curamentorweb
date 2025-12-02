import axios from 'axios';
import { buildHeaders } from '../helpers/AppHelper';

export const saveUser = (user) => {
  if (user.id) {
    return axios.put(
      `${API_BASE_URL}/users/${user.id}`,
      user,
      {
        headers: buildHeaders()
      }
    );
  }

  return axios.post(
    `${API_BASE_URL}/users`,
    user,
    {
      headers: buildHeaders()
    }
  );
}

export const deleteUser = (id) => {
  return axios.delete(
    `${API_BASE_URL}/users/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getUser = (id) => {
  return axios.get(
    `${API_BASE_URL}/users/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getUsers = (params) => {
  return axios.get(
    `${API_BASE_URL}/users`,
    {
      params,
      headers: buildHeaders()
    }
  );
}
