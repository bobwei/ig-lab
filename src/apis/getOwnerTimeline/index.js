import axios from 'axios';

const fn = async ({ id }) => {
  const url = `https://www.instagram.com/graphql/query/?query_hash=f2405b236d85e8296cf30347c9f08c2a&variables={"id":"${id}","first":12}`;
  return axios.get(url).then((res) => res.data);
};

export default fn;
