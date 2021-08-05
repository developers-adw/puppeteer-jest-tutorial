const puppeteer = require('puppeteer');
const faker = require('faker');
const iPhone = puppeteer.devices['iPhone 6'];

const user = {
  email: faker.internet.email(),
  password: 'test',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const isDebugging = () => {
  const debugging_mode = {
    headless: false,
    slowMo: 30,
    devtools: true,
  };
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};

let browser;
let page;
let logs = [];
let errors = [];
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  page.setRequestInterception(true);
  // page.on('request', (interceptedRequest) => {
  //   if (interceptedRequest.url.includes('mockapi')) {
  //     interceptedRequest.abort();
  //   } else {
  //     interceptedRequest.continue();
  //   }
  // });
  page.on('console', (c) => {
    // console.log(c.text);
    logs.push(c.text);
  });
  page.on('pageerror', (e) => errors.push(e.text));
  await page.goto('http://localhost:3000/');
  await page.emulate(iPhone);
});

describe('on page load', () => {
  test('h1 loads correctly', async () => {
    const html = await page.$eval('[data-testid="h1"]', (e) => e.innerHTML);

    expect(html).toBe('Welcome to React');
  }, 16000);

  test('nav loads correctly', async () => {
    const navbar = await page.$eval('[data-testid="navbar"]', (el) =>
      el ? true : false
    );
    const listItems = await page.$$('[data-testid="navBarLi"]');

    expect(navbar).toBe(true);
    if (listItems.length !== 4)
      await page.screenshot({
        path: 'screenshot.png',
        // You have have the page.pdf to save a pdf instead of a screenshot.
        // You can also set formatting options for the pdf or the screenshot
      });
    expect(listItems.length).toBe(4);
  });

  describe('login form', () => {
    test('fills out form and submits', async () => {
      await page.click('[data-testid="firstName"]');
      await page.type('[data-testid="firstName"]', user.firstName);

      await page.click('[data-testid="lastName"]');
      await page.type('[data-testid="lastName"]', user.lastName);

      await page.click('[data-testid="email"]');
      await page.type('[data-testid="email"]', user.email);

      await page.click('[data-testid="password"]');
      await page.type('[data-testid="password"]', user.password);

      await page.click('[data-testid="submit"]');

      await page.waitForSelector('[data-testid="success"]');
    }, 16000);
    test('sets firstName cookie', async () => {
      const cookies = await page.cookies();
      const firstNameCookie = cookies.find(
        (c) => c.name === 'firstName' && c.value === user.firstName
      );

      expect(firstNameCookie).not.toBeUndefined();
    });
    test('does not have console logs', async () => {
      expect(logs.length).toBe(3);
    });
    test('does not have exceptions', () => {
      expect(errors.length).toBe(0);
    });
    // test.only('fails to fetch mock endpoint', async () => {
    //   const h3 = await page.$eval(
    //     '[data-testid="mockAPI"]',
    //     (e) => e.innerHTML
    //   );
    //   expect(h3).toBe('Received mock data!');
    // });
  });
  /**
 test('login form for iPhone works correctly', async () => {
   const page2 = await browser.newPage();
   await page2.emulate(iPhone);
   await page2.goto('http://localhost:3000/');
   
   const firstName = await page2.$('[data-testid="firstName"]');
   const lastName = await page2.$('[data-testid="lastName"]');
   const email = await page2.$('[data-testid="email"]');
   const password = await page2.$('[data-testid="password"]');
   const submit = await page2.$('[data-testid="submit"]');

   await firstName.tap();
   await page2.type('[data-testid="firstName"]', user.firstName);
   
   await lastName.tap();
   await page2.type('[data-testid="lastName"]', user.lastName);
   
   await email.tap();
   await page2.type('[data-testid="email"]', user.email);
   
   await password.tap();
   await page2.type('[data-testid="password"]', user.password);
   
   await submit.tap();
   
   await page2.waitForSelector('[data-testid="success"]');
  }, 19000);
  */
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});
