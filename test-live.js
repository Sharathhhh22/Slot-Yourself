const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://slot-yourself-7afv.vercel.app/login');
    
    // We can just use the name attributes since there are duplicates, but we only fill the first one which is login
    const emailInputs = await page.$$('input[name="email"]');
    await emailInputs[0].fill('fakeuser@fake.com');
    
    const passInputs = await page.$$('input[name="password"]');
    await passInputs[0].fill('wrongpassword');
    
    const buttons = await page.$$('button:has-text("Sign In")');
    await buttons[0].click();
    
    await page.waitForTimeout(3000);
    console.log('Current URL:', page.url());
    
    const text = await page.innerText('body');
    if (text.includes('Could not authenticate user')) {
      console.log('ERROR MESSAGE IS VISIBLE ON SCREEN!');
    } else {
      console.log('ERROR MESSAGE IS NOT VISIBLE!');
      console.log(text.substring(0, 300));
    }
    
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
