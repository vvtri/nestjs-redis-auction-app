import { Curl } from 'node-libcurl';
import axios from 'axios';

const send = async (body: any) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/v1/user/product/bid',
      // '{\n  "id": "43848648-98b0-4270-80e5-c98ed03089be",\n  "price": 1\n}',
      body,
      {
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTY5MjYyNTE1MCwiZXhwIjoxNjk1MjE3MTUwfQ.UkOXiYwJSI6uSt0EZbHuO6uZTkxJt50bcgotRGAHlBI',
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('success', body);
  } catch (error) {
    console.log('failed', body);
  }
};

const run = async () => {
  for (let i = 0; i < 3; i++) {
    send({
      id: '43848648-98b0-4270-80e5-c98ed03089be',
      price: 7,
    });
  }
};

run();
