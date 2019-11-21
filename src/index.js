import 'dotenv/config';
import * as R from 'ramda';
import fs from 'fs';
import path from 'path';

import getFollowings from './apis/getFollowings';
import getOwnerTimeline from './apis/getOwnerTimeline';
import writeToFile from './functions/writeToFile';
import setupRequest from './functions/setupRequest';
import createTaskQueue from './utilities/task-queue';

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
  if (!fs.existsSync(path.resolve('./tmp/posts.json'))) {
    await new Promise((resolve) => {
      const followings = JSON.parse(fs.readFileSync('./tmp/followings.json')).slice(0, 50);
      // prettier-ignore
      const props = [
        'id', 'display_url', 'edge_media_to_caption', 'shortcode', 'edge_media_preview_like',
        'owner', 'location'
      ]
      const mapper = R.pipe(
        R.pathOr([], ['data', 'user', 'edge_owner_to_timeline_media', 'edges']),
        R.map(R.prop('node')),
        R.reject(R.propEq('location', null)),
        R.map(R.pick(props)),
      );
      const arr = [];
      const queue = createTaskQueue({
        fn: R.pipeP(getOwnerTimeline, mapper),
        onData: (arg, res) => {
          arr.push(...res);
          writeToFile(path.resolve('./tmp/posts.json'))(arr);
          console.log(queue.status);
          if (queue.isComplete) {
            console.log('arr.length =', arr.length);
            resolve();
          }
        },
      });
      followings.forEach((arg) => queue.push(arg));
    });
  }
}

if (require.main === module) {
  fn();
}
