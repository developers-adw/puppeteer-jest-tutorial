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
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  await page.emulate(iPhone);
  // page.setViewport({ width: 500, height: 2400 });
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
  });

  //   test('login form for iPhone works correctly', async () => {
  //     const page2 = await browser.newPage();
  //     await page2.emulate(iPhone);
  //     await page2.goto('http://localhost:3000/');

  //     const firstName = await page2.$('[data-testid="firstName"]');
  //     const lastName = await page2.$('[data-testid="lastName"]');
  //     const email = await page2.$('[data-testid="email"]');
  //     const password = await page2.$('[data-testid="password"]');
  //     const submit = await page2.$('[data-testid="submit"]');

  //     await firstName.tap();
  //     await page2.type('[data-testid="firstName"]', user.firstName);

  //     await lastName.tap();
  //     await page2.type('[data-testid="lastName"]', user.lastName);

  //     await email.tap();
  //     await page2.type('[data-testid="email"]', user.email);

  //     await password.tap();
  //     await page2.type('[data-testid="password"]', user.password);

  //     await submit.tap();

  //     await page2.waitForSelector('[data-testid="success"]');
  //   }, 19000);
});

afterAll(() => {
  if (isDebugging()) {
    browser.close();
  }
});
