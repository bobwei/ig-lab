import * as R from 'ramda';
import axios from 'axios';

function setupRequest() {
  const { COOKIE } = R.evolve({ COOKIE: (s) => Buffer.from(s, 'base64') })(process.env);
  axios.interceptors.request.use((config) => ({
    ...config,
    headers: {
      ...config.headers,
      Cookie: COOKIE,
    },
  }));
}

export default setupRequest;
