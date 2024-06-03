const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');

puppeteer.use(StealthPlugin());

const handle = 'Tumpa-1307';
const from = 1;
const count = 10;
const url = `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${count}`;

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const userAgent = new UserAgent();
  await page.setUserAgent(userAgent.toString());
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Ensure Cloudflare challenge is passed
    await page.waitForSelector('pre', { timeout: 60000 });

    const content = await page.evaluate(() => document.querySelector('pre').innerText);
    
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing JSON response:', e.message);
      console.log('Response data:', content);
      await browser.close();
      return;
    }

    if (jsonData.status === 'OK') {
      const submissions = jsonData.result;
      submissions.forEach(submission => {
        console.log(`Submission ID: ${submission.id}, Verdict: ${submission.verdict}`);
      });
    } else {
      console.log(`Failed to retrieve submissions. Reason: ${jsonData.comment}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
