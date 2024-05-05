const https = require('https');

const handle = 'Tumpa-1307';
const from = 1;
const count = 10;

const url = `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${count}`;

https.get(url, (response) => {
  let data = '';

  // A chunk of data has been received.
  response.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received.
  response.on('end', () => {
    const jsonData = JSON.parse(data);
    if (jsonData.status === 'OK') {
      const submissions = jsonData.result;
      submissions.forEach(submission => {
        console.log(`Submission ID: ${submission.id}, Verdict: ${submission.verdict}`);
      });
    } else {
      console.log(`Failed to retrieve submissions. Reason: ${jsonData.comment}`);
    }
  });

}).on('error', (error) => {
  console.error(`Error retrieving data: ${error.message}`);
});
