import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 2000 },
    // { duration: '1m30s', target: 10 },
    // { duration: '20s', target: 0 },
  ],
};
export default function () {
  const url = 'http://localhost:3000/qa/questions';
  const payload = {
    product_id: 7,
  };
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.get(url, payload, params);
  //   http.get('https://test.k6.io');
  //   sleep(1);
}
