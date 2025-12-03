import axios from 'axios';
import { buildHeaders } from '../helpers/AppHelper';

export const saveStudent = (student) => {
  if (student.id) {
    return axios.put(
      `${API_BASE_URL}/students/${student.id}`,
      student,
      {
        headers: buildHeaders()
      }
    )
  } else {
    return axios.post(
      `${API_BASE_URL}/students`,
      student,
      {
        headers: buildHeaders()
      }
    )
  }
}

export const deleteStudent = (id) => {
  return axios.delete(
    `${API_BASE_URL}/students/${id}`,
    student,
    {
      headers: buildHeaders()
    }
  )
}

export const getStudent = (id) => {
  return axios.get(
    `${API_BASE_URL}/students/${id}`,
    {
      headers: buildHeaders()
    }
  )
}

export const getStudents = (params = {}, config = {}) => {
  return axios.get(
    `${API_BASE_URL}/students`,
    {
      params,
      headers: buildHeaders(),
      ...config
    }
  )
}
