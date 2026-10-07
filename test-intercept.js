const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    // Intercept responses to see headers
    page.on('response', response => {
      if (response.request().method() === 'POST') {
        console.log('POST URL:', response.url());
        console.log('POST Status:', response.status());
        const headers = response.headers();
        console.log('Set-Cookie headers:', headers['set-cookie'] || 'NONE');
      }
    });

    await page.goto('https://slot-yourself-7afv.vercel.app/login');
    
    const emailInputs = await page.$$('input[name="email"]');
    await emailInputs[0].fill('fakeuser@fake.com');
    const passInputs = await page.$$('input[name="password"]');
    await passInputs[0].fill('wrongpassword');
    
    const buttons = await page.$$('button:has-text("Sign In")');
    await buttons[0].click();
    
    await page.waitForTimeout(3000);
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
