import 'dotenv/config';
import * as R from 'ramda';
import path from 'path';

import getFollowings from './apis/getFollowings';
import writeToFile from './functions/writeToFile';
import setupRequest from './functions/setupRequest';

async function fn() {
  setupRequest();
  getFollowings({ userId: '110379', recursive: true })
    .then(mapper())
    .then(writeToFile(path.resolve('./tmp/following.json')))
    .catch(console.log);
}

function mapper() {
  return R.pipe(R.pathOr([], ['data', 'user', 'edge_follow', 'edges']), R.map(R.prop('node')));
}

if (require.main === module) {
  fn();
}
