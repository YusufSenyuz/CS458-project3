import {until} from "selenium-webdriver";

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

        // Assertion #1: Check if login was successful
        let loginInfoElement = await driver.wait(until.elementLocated(By.id('loginInfo')), 10000);
        await driver.wait(until.elementTextIs(loginInfoElement, "You have successfully logged in! This page calculates the nearest sea from your GPS coordinates."), 10000);

        // Override GPS
        const latitude = 41.029823;
        const longitude = 29.406313;

        const options = new firefox.Options();
        options.setPreference("geo.enabled", true);
        options.setPreference("geo.provider.use_corelocation", false);
        options.setPreference("geo.prompt.testing", true);
        options.setPreference("geo.prompt.testing.allow", true);
        options.setPreference("geo.wifi.uri", `data:application/json,{"location": {"lat": ${latitude}, "lng": ${longitude}}}`);

        // Enable GPS
        await driver.findElement(By.id("enableGPS")).click();
        driver.switchTo().alert().accept();
        driver.switchTo().defaultContent();

        let distanceInfoElement = await driver.wait(until.elementLocated(By.id('distanceInfo')), 10000);
        let locationText = await driver.wait(until.elementIsVisible(distanceInfoElement)).getText();

        let seaAndDistance = locationText.substring(28);
        const substrings = seaAndDistance.split(": ");
        let sea = substrings[0];
        let distance = parseFloat(substrings[1]);

        // Assertion #2: The sea is displayed correctly. Test location is somewhere Istanbul
        sea.should.be.oneOf(['Marmara Sea', 'Black Sea']);

        // Assertion #3: The distance is displayed correctly with 5% accuracy.
        let realDistance = 18.95;
        let accuracy = realDistance * 0.05;
        distance.should.closeTo(realDistance, accuracy);

        // Close the browser
        await driver.quit();
    });
});