import 'dotenv/config';
import * as R from 'ramda';
import fs from 'fs';
import path from 'path';

import getFollowings from './apis/getFollowings';
import writeToFile from './functions/writeToFile';
import setupRequest from './functions/setupRequest';

async function fn() {
  setupRequest();
  if (!fs.existsSync(path.resolve('./tmp/followings.json'))) {
    const mapper = R.pipe(
      R.pathOr([], ['data', 'user', 'edge_follow', 'edges']),
      R.map(R.prop('node')),
    );
    await getFollowings({ userId: '110379', recursive: true })
      .then(mapper)
      .then(writeToFile(path.resolve('./tmp/followings.json')))
      .catch(console.log);
  }
}

if (require.main === module) {
  fn();
}
