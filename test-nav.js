const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://slot-yourself-7afv.vercel.app/login');
    
    const emailInputs = await page.$$('input[name="email"]');
    await emailInputs[0].fill('test100@gmail.com');
    const passInputs = await page.$$('input[name="password"]');
    await passInputs[0].fill('123456'); // assuming this might work if I created it earlier, but I didn't. 
    // Wait, I can't login if I don't have an account. I'll just see what happens if I do it with fake credentials. It won't login.
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
