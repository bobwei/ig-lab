import axios from 'axios';
import * as R from 'ramda';

const fn = async (props = {}, output = {}) => {
  const { userId, first = 12, after } = props;
  const variables = { id: userId, first, after };
  if (props.hasNext === false) {
    return output;
  }
  return axios
    .get(getUrl(variables))
    .then((res) => res.data)
    .then(R.mergeDeepWithKey((k, l, r) => (k === 'edges' ? R.concat(l, r) : r), output))
    .then((results) => {
      if (!props.recursive) {
        return results;
      }
      const { end_cursor: cursor, has_next_page: hasNext } = getPageInfo()(results);
      return fn({ ...props, after: cursor, hasNext }, results);
    });
};

export default fn;

function getPageInfo() {
  return R.path(['data', 'user', 'edge_follow', 'page_info']);
}

function getUrl(variables) {
  // prettier-ignore
  return `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=${JSON.stringify(variables)}`;
}
