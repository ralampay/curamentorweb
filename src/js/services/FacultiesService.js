import axios from 'axios';
import { buildHeaders } from '../helpers/AppHelper';

export const saveFaculty = (faculty) => {
  if (faculty.id) {
    return axios.put(
      `${API_BASE_URL}/faculties/${faculty.id}`,
      faculty,
      {
        headers: buildHeaders()
      }
    );
  }

  return axios.post(
    `${API_BASE_URL}/faculties`,
    faculty,
    {
      headers: buildHeaders()
    }
  );
}

export const deleteFaculty = (id) => {
  return axios.delete(
    `${API_BASE_URL}/faculties/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getFaculty = (id) => {
  return axios.get(
    `${API_BASE_URL}/faculties/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getFaculties = (params = {}, config = {}) => {
  return axios.get(
    `${API_BASE_URL}/faculties`,
    {
      params,
      headers: buildHeaders(),
      ...config
    }
  );
}
