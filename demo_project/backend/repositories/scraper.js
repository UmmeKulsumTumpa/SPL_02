const assert = require('assert');
const axios = require('axios');
const cheerio = require('cheerio');

// Function to retrieve problem details from Codeforces
async function getCodeforcesProblem({ contest, problem }) {
  try {
    const url = `https://codeforces.com/contest/${contest}/problem/${problem}`;
    const response = await axios.get(url, { maxRedirects: 0 });
    assert.strictEqual(response.status, 200);

    const $ = cheerio.load(response.data);

    // Define Cheerio prototype methods for text extraction
    $.prototype.justtext = function () {
      return this.clone().children().remove().end().text();
    };

    $.prototype.textArray = function () {
      return this.map(function () {
        return $(this).text();
      }).toArray();
    };

    // Extract problem details from HTML
    const statement = $('.problem-statement');
    const header = statement.find('.header');

    let sampleTests = [];
    const tests = statement.find('.sample-test').children();

    for (let i = 0; i < tests.length; i += 2) {
      const input = tests.eq(i).find('pre').html().replace(/<br>/g, '\n').replace(/&#xA0;/g, '\xa0');
      const output = tests.eq(i + 1).find('pre').html().replace(/<br>/g, '\n').replace(/&#xA0;/g, '\xa0');
      sampleTests.push({ input, output });
    }

    // Return extracted problem details
    return {
      title: header.find('.title').text().trim(),
      timeLimit: header.find('.time-limit').justtext().trim(),
      memoryLimit: header.find('.memory-limit').justtext().trim(),
      input: header.find('.input-file').justtext().trim(),
      output: header.find('.output-file').justtext().trim(),
      statement: {
        text: statement.children().eq(1).children().textArray(),
        inputSpec: statement.find('.input-specification > p').textArray(),
        outputSpec: statement.find('.output-specification > p').textArray(),
        sampleTests,
        notes: statement.find('.note > p').textArray(),
      },
      link: url,
      submitLink: `https://codeforces.com/contest/${contest}/submit/${problem}`,
    };
  } catch (err) {
    console.error(err);
    throw new Error('Could not find or parse problem');
  }
}

// Function to retrieve problem details from Hackerrank (not implemented)
function getHackerrankProblem({ contest, problem }) {
  try {
    const url = contest
      ? `https://www.hackerrank.com/contests/${contest}/challenges/${problem}`
      : `https://www.hackerrank.com/challenges/${problem}/problem`;
    throw new Error('Not implemented');
  } catch (err) {
    console.error(err);
    throw new Error('Could not find or parse problem');
  }
}

// Main scraper function to determine the type of problem and call respective function
function scraper(type, pid) {
  if (type === 'CF') {
    // Codeforces
    const match = pid.match(/([0-9]+)([A-Z][A-Z0-9]*)$/);
    if (!match) throw new Error('Invalid Codeforces problem ID');
    const contest = match[1];
    const problem = match[2];
    return getCodeforcesProblem({ contest, problem });
  } else if (type === 'HR') {
    // Hackerrank
    let contest = null;
    let problem = pid;
    const idx = pid.indexOf('/');
    if (idx !== -1) {
      contest = pid.substring(0, idx);
      problem = pid.substring(idx + 1);
    }
    return getHackerrankProblem({ contest, problem });
  } else {
    throw new Error('Invalid problem type');
  }
}

module.exports = scraper;
