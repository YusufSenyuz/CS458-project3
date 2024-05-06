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

        // Enter latitude and longitude
        await driver.findElement(By.id("latitude")).sendKeys("39.864339");
        await driver.findElement(By.id("longitude")).sendKeys("32.746444");
        await driver.findElement(By.id("calculate")).click();

        // Retrieve distance to the sun
        let distanceText = await driver.findElement(By.id("distanceInfo")).getText.then(function(value){
            return value;
        });

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