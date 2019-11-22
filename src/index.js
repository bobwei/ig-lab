import 'dotenv/config';
import * as R from 'ramda';

import getFollowings from './apis/getFollowings';
import getOwnerTimeline from './apis/getOwnerTimeline';
import setupRequest from './functions/setupRequest';
import createTaskQueue from './utilities/task-queue';
import FileStorage from './storages/FileStorage';
import withCache from './functions/withCache';

class DataLoader {
  constructor(props) {
    setupRequest(props);
    const { storage: Storage = FileStorage } = props;
    this.storage = new Storage();
  }

  load({ userId } = {}) {
    return Promise.resolve()
      .then(
        withCache(this.storage, createKey(userId, 'followings'), () => {
          const mapper = R.pipe(
            R.pathOr([], ['data', 'user', 'edge_follow', 'edges']),
            R.map(R.prop('node')),
          );
          return getFollowings({ userId, recursive: true }).then(mapper);
        }),
      )
      .then(
        withCache(this.storage, createKey(userId, 'posts'), (followings) => {
          return new Promise((resolve) => {
            // prettier-ignore
            const pickedProps = [
              'id', 'display_url', 'edge_media_to_caption', 'shortcode',
              'edge_media_preview_like', 'owner', 'location'
            ]
            const mapper = R.pipe(
              R.pathOr([], ['data', 'user', 'edge_owner_to_timeline_media', 'edges']),
              R.map(R.prop('node')),
              R.reject(R.propEq('location', null)),
              R.map(R.pick(pickedProps)),
            );
            const arr = [];
            const queue = createTaskQueue({
              fn: R.pipeP(getOwnerTimeline, mapper),
              onData: async (arg, res) => {
                arr.push(...res);
                if (queue.isComplete) {
                  resolve(arr);
                }
              },
            });
            followings.forEach((arg) => queue.push(arg));
          });
        }),
      )
      .catch(console.log);
  }
}

function createKey(...args) {
  return args.join(':');
}

export default DataLoader;
