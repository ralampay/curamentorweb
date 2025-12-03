import axios from 'axios';
import { buildHeaders } from '../helpers/AppHelper';

export const saveCourse = (course) => {
  if (course.id) {
    return axios.put(
      `${API_BASE_URL}/courses/${course.id}`,
      course,
      {
        headers: buildHeaders()
      }
    );
  }

  return axios.post(
    `${API_BASE_URL}/courses`,
    course,
    {
      headers: buildHeaders()
    }
  );
}

export const deleteCourse = (id) => {
  return axios.delete(
    `${API_BASE_URL}/courses/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getCourse = (id) => {
  return axios.get(
    `${API_BASE_URL}/courses/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getCourses = (params) => {
  return axios.get(
    `${API_BASE_URL}/courses`,
    {
      params,
      headers: buildHeaders()
    }
  );
}

export const getCourseStudents = (id) => {
  return axios.get(
    `${API_BASE_URL}/courses/${id}/students`,
    {
      headers: buildHeaders()
    }
  );
}
