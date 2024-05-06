const {Builder, By, Key} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case B1", function(){
    it("Location is automatically retrieved and the nearest sea is shown with 5% accuracy.", async function(){
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

        // Go to third page
        await driver.findElement(By.id("thirdPageButton")).click();

        // Enable GPS
        await driver.findElement(By.id("enableGPS")).click();
        driver.switchTo().alert().dismiss();
        driver.switchTo().defaultContent();

        // Retrieve the error message
        let error = driver.switchTo().alert().getText();

        // Assertion #2: Error message is shown correctly
        error.should.equal("Failed to enable GPS. You should either enable GPS or enter latitude and longitude manually.")

        // Close the browser
        await driver.quit();
    });
});