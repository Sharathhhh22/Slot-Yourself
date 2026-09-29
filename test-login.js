const { chromium } = require('playwright');
(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    
    // Switch to Register tab
    await page.click('button:has-text("Register")');
    await page.fill('input[name=full_name]', 'Automated Test User');
    await page.fill('div[role="tabpanel"]:has-text("Register") input[name="email"]', 'test888@gmail.com');
    await page.fill('div[role="tabpanel"]:has-text("Register") input[name="password"]', '123456');
    await page.click('button:has-text("Create Account")');
    await page.waitForTimeout(4000);
    console.log('Current URL after signup:', page.url());
    
    // Check if we are on dashboard
    let text = await page.innerText('body');
    console.log('Page text after signup:', text.substring(0, 200));

    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
