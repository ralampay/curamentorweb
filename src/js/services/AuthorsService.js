import axios from 'axios';
import { buildHeaders } from '../helpers/AppHelper';

export const addPublicationAuthor = (publicationId, payload) => {
  return axios.post(
    `${API_BASE_URL}/publications/${publicationId}/authors`,
    payload,
    {
      headers: buildHeaders()
    }
  );
}

export const getPublicationAuthors = (publicationId) => {
  return axios.get(
    `${API_BASE_URL}/publications/${publicationId}/authors`,
    {
      headers: buildHeaders()
    }
  );
}

export const deletePublicationAuthor = (publicationId, authorId) => {
  return axios.delete(
    `${API_BASE_URL}/publications/${publicationId}/authors/${authorId}`,
    {
      headers: buildHeaders()
    }
  );
}
