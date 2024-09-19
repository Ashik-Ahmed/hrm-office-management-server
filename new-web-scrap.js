const puppeteer = require('puppeteer');
async function scrapePortedNumbers() {
    const browser = await puppeteer.launch({ headless: false }); // Keep this false for debugging
    const page = await browser.newPage();

    try {
        console.log('Navigating to login page...');
        await page.goto('http://npch.infotelebd.com:8080/QAdmin/pages/public/login.xhtml', { waitUntil: 'networkidle0' });

        console.log('Logging in...');
        await page.waitForSelector('#j_idt141\\:j_username');
        await page.type('#j_idt141\\:j_username', 'anti');
        await page.type('#j_idt141\\:j_password', 'mnp123@XX');
        await page.click('#j_idt141\\:j_idt151');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.goto('http://npch.infotelebd.com:8080/QAdmin/pages/admin/report/portedNumbers.xhtml', { waitUntil: 'networkidle0' });

        await page.waitForSelector('#reportForm\\:reportTable_data', { timeout: 30000 });

        const tableData = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#reportForm\\:reportTable_data tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => cell.textContent.trim());
            });
        });

        console.log('Extracting last row data...');
        const lastRowData = await page.evaluate(() => {
            const lastRow = document.querySelector('tr[data-ri="10"]');
            if (!lastRow) {
                throw new Error('Last row not found');
            }
            const cells = Array.from(lastRow.querySelectorAll('td')).slice(1, -1);
            console.log('Last row cells:', cells);
            return cells.map(cell => {
                console.log('Cell text:', cell);
                const value = cell.textContent.trim();
                return value === '/' ? 0 : parseInt(value) || 0;
            });
        });

        console.log('Last row data:', lastRowData);

        const sum = lastRowData.reduce((acc, val) => acc + val, 0);
        console.log('Sum of last row values:', sum);

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await browser.close();
    }
}

scrapePortedNumbers();

scrapePortedNumbers();