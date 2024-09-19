const puppeteer = require('puppeteer');

async function scrapeTable(url, loginUrl, username, password) {
    try {
        const browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
        const page = await browser.newPage();

        // Navigate to the login page
        await page.goto(loginUrl, { waitUntil: 'networkidle2' });

        // Fill out the login form
        await page.type('#j_idt141\\:j_username', username); // Username field
        await page.type('#j_idt141\\:j_password', password); // Password field

        // Submit the login form
        await page.click('#j_idt141\\:j_idt151'); // Login button
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Navigate to the page with the table
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Ensure the table is present
        await page.waitForSelector('#reportForm\\:reportTable_data'); // Wait for the table data

        // Extract data from the "TOTAL" row
        const totalValues = await page.evaluate(() => {
            // Get all rows from the table body
            const rows = Array.from(document.querySelectorAll('#reportForm\\:reportTable_data tr'));

            // Find the last row
            const lastRow = rows[rows.length - 1];

            // Ensure the last row is the "TOTAL" row
            const firstCellText = lastRow.querySelector('td')?.textContent.trim();
            console.log('First cell text of last row:', firstCellText); // Debugging: Print the first cell text
            if (firstCellText !== 'TOTAL') {
                console.log('Last row is not the TOTAL row.');
                return [];
            }

            // Extract cell values from the "TOTAL" row
            const cells = Array.from(lastRow.querySelectorAll('td')).map(td => td.textContent.trim());

            console.log('Cells in TOTAL row:', cells); // Debugging: Print cells

            // Exclude the first cell which is the "TOTAL" label and any non-numeric values
            return cells.slice(1).map(cell => {
                // Convert the cell value to a number, ignore any non-numeric characters
                const numericValue = parseFloat(cell.replace(/[^0-9.]/g, ''));
                console.log('Parsed numeric value:', numericValue); // Debugging: Print parsed values
                return isNaN(numericValue) ? 0 : numericValue;
            });
        });

        // Log total values for debugging
        console.log('Extracted TOTAL Values:', totalValues);

        // Calculate the sum of cell values in the "TOTAL" row
        const sum = totalValues.reduce((acc, value) => acc + value, 0);

        console.log('Sum of TOTAL Row Values:', sum);

        await browser.close();
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }
}

// Replace with the actual URLs and login credentials
const loginUrl = 'http://npch.infotelebd.com:8080/QAdmin/pages/public/login.xhtml'; // Replace with the actual login URL
const url = 'http://npch.infotelebd.com:8080/QAdmin/pages/admin/report/portedNumbers.xhtml'; // Replace with the actual URL of the page with the table
const username = 'anti'; // Replace with your username
const password = 'mnp123@XX'; // Replace with your password

scrapeTable(url, loginUrl, username, password);