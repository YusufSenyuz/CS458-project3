const {Builder, By, Key, until} = require("selenium-webdriver");
import('chai').then(chai => {
    const expect = chai.expect; // Ensure that expect is properly referenced
}).catch(err => {
    console.error(err);
});

describe("Test Case B2", function(){
    it("GPS isn't enabled and a correct error message is displayed as an alert", async function(){
        let driver = await new Builder().forBrowser("firefox").build();

        try {
            // Navigate to login page
            await driver.get("http://127.0.0.1:5000/login");

            // Login
            await driver.findElement(By.id("loginEmail")).sendKeys("cengizhan@ug.bilkent.edu.tr");
            await driver.findElement(By.id("loginPassword")).sendKeys("pass1234", Key.RETURN);

            // Assertion #1: Check if login was successful
            let loginInfoElement = await driver.wait(until.elementLocated(By.id('loginInfo')), 10000);
            await driver.wait(until.elementTextIs(loginInfoElement, "You have successfully logged in! This page calculates the nearest sea from your GPS coordinates."), 10000);

            // Interact with GPS alert
            await driver.wait(until.alertIsPresent(), 10000);
            let alert = await driver.switchTo().alert(); // Switch to the alert
            await alert.dismiss(); // Dismiss the alert by pressing 'Cancel'

            // Wait for and check the second alert for error message
            await driver.wait(until.alertIsPresent(), 10000); // Ensure the second alert is present
            alert = await driver.switchTo().alert(); // Switch to the second alert
            let error = await alert.getText();

            // Assertion #2: Verify the error message
            expect(error).to.equal("Location information is unavailable.");
        } catch (error) {
            console.error(error);
        } finally {
            // Close the browser
            await driver.quit();
        }
    });
});
