import { chromium } from 'playwright';

const WALLET_ADDRESS = '0x141f7D9a6Ab4221F36E21673b43FA751Af37E7eB';

async function executeTrade() {
  console.log('🌐 Opening Polymarket...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Go to Polymarket
    await page.goto('https://polymarket.com');
    await page.waitForTimeout(3000);
    
    // Look for active markets
    console.log('🔍 Finding markets...');
    const markets = await page.locator('[data-testid="market-card"], .market-card, [class*="market"]').count();
    console.log(`Found ${markets} market elements`);
    
    // Click first market
    const firstMarket = page.locator('[data-testid="market-card"], .market-card').first();
    if (await firstMarket.isVisible().catch(() => false)) {
      await firstMarket.click();
      console.log('✅ Clicked market');
      await page.waitForTimeout(2000);
      
      // Look for YES button
      const yesButton = page.locator('button:has-text("YES"), [data-testid="yes-button"]').first();
      if (await yesButton.isVisible().catch(() => false)) {
        await yesButton.click();
        console.log('✅ Clicked YES');
        
        // Enter amount
        const amountInput = page.locator('input[type="number"], [placeholder*="amount"]').first();
        if (await amountInput.isVisible().catch(() => false)) {
          await amountInput.fill('1');
          console.log('✅ Entered $1');
          
          // Submit trade
          const submitButton = page.locator('button:has-text("Buy"), button:has-text("Trade"), [data-testid="submit-trade"]').first();
          if (await submitButton.isEnabled().catch(() => false)) {
            await submitButton.click();
            console.log('🚀 TRADE SUBMITTED!');
            await page.waitForTimeout(5000);
          }
        }
      }
    }
    
    console.log('📸 Screenshot saved');
    await page.screenshot({ path: '/home/workspace/polymarket-trade.png' });
    
  } catch (e) {
    console.error('Error:', e);
    await page.screenshot({ path: '/home/workspace/polymarket-error.png' });
  } finally {
    await browser.close();
  }
}

executeTrade();
