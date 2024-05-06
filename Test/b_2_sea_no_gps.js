const {Builder, By, Key} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case B2", function(){
    it("GPS isn't enabled and a correct error message is displayed as an alert", async function(){
        // Launch the browser
        let driver = await new Builder().forBrowser("firefox").build();

        // Navigate to login page
        await driver.get("http://127.0.0.1:5000/login");

        // Login
        await driver.findElement(By.id("loginEmail")).sendKeys("cengizhan@ug.bilkent.edu.tr");
        await driver.findElement(By.id("loginPassword")).sendKeys("pass1234", Key.RETURN);

        // Assertion #1: Login was successful
        let loginText = await driver.findElement(By.id("loginInfo")).getText().then(function(value){
            return value;
        });
        loginText.should.equal("You have successfully logged in! This page calculates the nearest sea from your GPS coordinates.");

        // Don't enable GPS
        await driver.findElement(By.id("enableGPS")).click();
        driver.switchTo().alert().dismiss();
        driver.switchTo().defaultContent();

        // Retrieve the error message
        let noGPSText = await driver.findElement(By.id("noGPSText")).getText().then(function(value){
            return value;
        });

        // Assertion #2: Error message is correct
        noGPSText.should.equal("Failed to enable GPS. You should enable GPS to see the nearest sea.");

        // Close the browser
        await driver.quit();
    });
});