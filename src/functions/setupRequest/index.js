import axios from 'axios';

function setupRequest({ cookie }) {
  if (cookie) {
    axios.interceptors.request.use((config) => ({
      ...config,
      headers: {
        ...config.headers,
        Cookie: cookie,
      },
    }));
  }
}

export default setupRequest;
