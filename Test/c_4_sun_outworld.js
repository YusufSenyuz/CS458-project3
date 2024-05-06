const {Builder, By, Key} = require("selenium-webdriver");
import('chai').then(chai => {
    // Now you can use chai here
  }).catch(err => {
    // Handle errors if any
    console.error(err);
  });

describe("Test Case C4", function(){
    it("Latitude doesn't exist in the Earth", async function(){
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
        await driver.findElement(By.id("latitude")).sendKeys("90.1");
        await driver.findElement(By.id("longitude")).sendKeys("32.746444");
        await driver.findElement(By.id("calculate")).click();

        // Retrieve the error message
        let error = driver.switchTo().alert().getText();

        // Assertion #2: Error message is shown correctly
        error.should.equal("Latitude is out of bounds.")

        // Close the browser
        await driver.quit();
    });
    it("Longitude doesn't exist in the Earth", async function(){
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
        await driver.findElement(By.id("longitude")).sendKeys("180.1");
        await driver.findElement(By.id("calculate")).click();

        // Retrieve the error message
        let error = driver.switchTo().alert().getText();

        // Assertion #2: Error message is shown correctly
        error.should.equal("Longitude is out of bounds.")

        // Close the browser
        await driver.quit();
    });
    it("Latitude and longitude doesn't exist in the Earth", async function(){
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
        await driver.findElement(By.id("latitude")).sendKeys("-90.1");
        await driver.findElement(By.id("longitude")).sendKeys("-180.1");
        await driver.findElement(By.id("calculate")).click();

        // Retrieve the error message
        let error = driver.switchTo().alert().getText();

        // Assertion #2: Error message is shown correctly
        error.should.equal("Latitude and longitude is out of bounds.")

        // Close the browser
        await driver.quit();
    });
});