import axios from 'axios';
import { buildHeaders, buildFileUploadHeaders } from '../helpers/AppHelper';

const appendPublicationPayload = (form, hasFile) => {
  if (hasFile) {
    const payload = new FormData();
    payload.append("title", form.title || "");
    payload.append("date_published", form.date_published || "");
    payload.append("file", form.file);
    return { payload, headers: buildFileUploadHeaders() };
  }

  return {
    payload: {
      title: form.title,
      date_published: form.date_published
    },
    headers: buildHeaders()
  };
};

export const savePublication = (publication) => {
  const hasFile = publication.file instanceof File;
  const { payload, headers } = appendPublicationPayload(publication, hasFile);

  if (publication.id) {
    return axios.put(
      `${API_BASE_URL}/publications/${publication.id}`,
      payload,
      {
        headers
      }
    );
  }

  return axios.post(
    `${API_BASE_URL}/publications`,
    payload,
    {
      headers
    }
  );
}

export const deletePublication = (id) => {
  return axios.delete(
    `${API_BASE_URL}/publications/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const vectorize = (id) => {
  return axios.post(
    `${API_BASE_URL}/publications/${id}/vectorize`,
    {},
    {
      headers: buildHeaders()
    }
  );
}

export const getPublication = (id) => {
  return axios.get(
    `${API_BASE_URL}/publications/${id}`,
    {
      headers: buildHeaders()
    }
  );
}

export const getPublications = (params) => {
  return axios.get(
    `${API_BASE_URL}/publications`,
    {
      params,
      headers: buildHeaders()
    }
  );
}
