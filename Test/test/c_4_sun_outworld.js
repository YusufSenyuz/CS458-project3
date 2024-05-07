const {Builder, By, Key,until} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case C4", function(){
    it("Latitude and longitude doesn't exist in the Earth", async function(){
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

        // Enter latitude and longitude
        await driver.findElement(By.id("latitude")).sendKeys("-90.1");
        await driver.findElement(By.id("longitude")).sendKeys("-180.1");
        await driver.findElement(By.id("calculate")).click();

        // Retrieve the error message
        await driver.wait(until.alertIsPresent(), 10000);  // waits up to 10 seconds for the alert to appear
        let error = await driver.switchTo().alert().getText();


        // Assertion #2: Error message is shown correctly
        error.should.equal("Latitude and longitude is out of bounds.")

        // Close the browser
        await driver.quit();
    });
});