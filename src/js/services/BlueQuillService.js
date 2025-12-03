import axios from 'axios';

export const chat = (query) => {
  return axios.post(
    `${API_BASE_URL}/blue_quill/chat`,
    {
      query: query
    }
  )
}
