const puppeteer = require('puppeteer');
const fs = require('fs');

const sleep = require(`${__dirname}/utils`);

const count = parseInt(process.argv[2]) || 10;

const writeToFile = data => {
  fs.writeFile('./data.json', JSON.stringify(data), err => {
    if (err) return console.error(err);
    process.exit();
  });
};

(async () => {
  const data = [];
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://en.wikipedia.org/wiki/Main_Page');
  await sleep(page, 60000);
  for (let i = 0; i < count; i++) {
    await page.click('#n-randompage');
    const titleNode = await page.$('#firstHeading');
    const title = await (await titleNode.getProperty('innerText')).jsonValue();
    const paragraphs = await page.$$('#content p');
    const pageObj = {
      title,
      paragraphs: []
    };
    for (let j = 0; j < paragraphs.length; j++) {
      pageObj.paragraphs.push({
        p: await (await paragraphs[j].getProperty('innerText')).jsonValue()
      });
    }
    data.push(pageObj);
  }
  writeToFile(data);
})();
