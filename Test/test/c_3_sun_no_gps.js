const {Builder, By, Key,until} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case C3", function(){
    it("GPS isn't enabled and a correct error message is displayed as an alert", async function(){
        // Launch the browser
        let driver = await new Builder().forBrowser("firefox").build();

        // Navigate to login page
        await driver.get("http://127.0.0.1:5000/login");

        // Login
        await driver.findElement(By.id("loginEmail")).sendKeys("cengizhan@ug.bilkent.edu.tr");
        await driver.findElement(By.id("loginPassword")).sendKeys("pass1234", Key.RETURN);

       // Assertion #1: Check if login was successful
        let loginInfoElement = await driver.wait(until.elementLocated(By.id('loginInfo')), 10000);
        await driver.wait(until.elementTextIs(loginInfoElement, "You have successfully logged in! This page calculates the nearest sea from your GPS coordinates."), 10000);

        // Go to third page
        await driver.findElement(By.id("thirdPageButton")).click();

        // Enable GPS
        // Enable GPS and wait for alert
        await driver.findElement(By.id("enableGPS")).click();
        let alert = await driver.wait(until.alertIsPresent(), 10000);  // Wait up to 10 seconds for the alert to appear
        let error = alert.getText();


        // Retrieve the error message
        let errorm = driver.switchTo().alert().getText();

        // Assertion #2: Error message is shown correctly
        errorm.should.equal("Location information is unavailable.")

        // Close the browser
        await driver.quit();
    });
});