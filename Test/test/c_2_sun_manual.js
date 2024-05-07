const {Builder, By, Key,until} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case C2", function(){
    it("Location is manually retrieved and the distance to sun is shown with 5% accuracy.", async function(){
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
        await driver.findElement(By.id("latitude")).sendKeys("39.8643");
        await driver.findElement(By.id("longitude")).sendKeys("32.7464");
        await driver.findElement(By.id("calculate")).click();

        let distanceInfoElement = await driver.wait(until.elementLocated(By.id('distanceInfo')), 10000);
        let distanceText = await driver.wait(until.elementIsVisible(distanceInfoElement)).getText();


        let distance = parseFloat(distanceText.substring(24));
        
        // Assertion #2:  The distance is displayed correctly with 5% accuracy.
        let realDistance = 184.0; // Need to update this with real distance
        let accuracy = realDistance * 0.05;
        /*let withinBoundaries = false;
        if (realDistance - accuracy < distance && realDistance + accuracy > distance) {
            withinBoundaries = true;
        }*/
        distance.should.closeTo(realDistance, accuracy);

        // Close the browser
        await driver.quit();
    });
});