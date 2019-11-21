import 'dotenv/config';
import * as R from 'ramda';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

import getFollowings from './apis/getFollowings';

async function fn() {
  setupRequest();
  getFollowings({ userId: '110379', recursive: true })
    .then(mapper())
    .then(writeToFile(path.resolve('./tmp/following.json')))
    .catch(console.log);
}

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

function mapper() {
  return R.pipe(R.pathOr([], ['data', 'user', 'edge_follow', 'edges']), R.map(R.prop('node')));
}

function writeToFile(outputPath) {
  return (content) => {
    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));
    return content;
  };
}

if (require.main === module) {
  fn();
}
