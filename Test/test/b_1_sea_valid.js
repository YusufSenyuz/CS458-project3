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

        // Assertion #1: Login was successful
        // Assertion #1: Check if login was successful
        let loginInfoElement = await driver.wait(until.elementLocated(By.id('loginInfo')), 10000);
        await driver.wait(until.elementTextIs(loginInfoElement, "You have successfully logged in! This page calculates the nearest sea from your GPS coordinates."), 10000);

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

        // Assertion #2: The sea is displayed correctly. Test location is Bilkent University Ankara
        sea.should.equal("Black Sea");

        // Assertion #3: The distance is displayed correctly with 5% accuracy.
        let realDistance = 184.0;
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