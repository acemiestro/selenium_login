require("chromedriver");
let fs = require("fs");
let swd = require("selenium-webdriver");
let credentialFile = process.argv[2];
let metadataFile = process.argv[3];
let cousreName = process.argv[4];
// browser builder
let bldr = new swd.Builder();
// tab
let driver = bldr.forBrowser("chrome").build();
// global variables
let username, password, gModule, gCourses;

let credentials = fs.promises.readFile(credentialFile);
credentials
    .then(function (credential) {
        // read credentials
        let parser = JSON.parse(credential);
        username = parser.username;
        password = parser.password;
        // promise => page opens
        let pageOpen = driver.get("http://pepcoding.com/login")
        return pageOpen;
    }).then(function () {
        // search email i/p box => i/p email 
        let email = driver.findElement(swd.By.css("input[type=email]"));
        // search password i/p box => i/p password
        let password = driver.findElement(swd.By.css("input[type=password]"));
        return Promise.all([email, password]);
    }).then(function (pro) {
        // i/p email and password
        let a1 = pro[0].sendKeys(username);
        let a2 = pro[1].sendKeys(password);
        // return a1 && a2;
        return Promise.all([a1, a2]);
    }).then(function () {
        console.log("Email and password sent");
        // search submit button => press submit
        return driver.findElement(swd.By.css("button[type=submit]"));
    }).then(function (login) {
        return login.click();
    }).then(function () {
        // wait for button to be clicked
        
    }).then(function () {
        // find and go to resource page
        let selectResources = driver.findElement(swd.By.css(".resource a"));
        return selectResources;
    }).then(function (selectResources) {
        return selectResources.getAttribute("href");
    }).then(function (resourceLink) {
        return driver.get(resourceLink);
    }).then(function () {
        console.log("Reached resource page");
        // Wait to remove Overlay
        let overLay = driver.findElement(swd.By.css("#siteOverlay"));
        return overLay;
    }).then(function (soe) {
        return driver.wait(swd.until.elementIsNotVisible(soe), 10000);
    }).then(function () {
        // find and go to coursePage
        goToCoursePage();
        console.log("Course Page Reached");
    }).then(function () {
        goToQuestionPage();
    //     let metadata = fs.promises.readFile(metadataFile);
    //     return metadata;
    // }).then(function (metadata) {
    //     let parser = JSON.parse(metadata);
    //     let ques = parser[0];
    //     // driver.get(ques.url);
    }).then(function () {
        console.log();
    }).catch(function (err) {
        console.log(err);
    })

function goToCoursePage() {
    let selectCourse = driver.findElements(swd.By.css(".black-text.no-margin.courseInput.bold"));
    selectCourse.then(function (courses) {
        gCourses = courses;
        let courseTextArr = [];
        for (let i = 0; i < courses.length; i++) {
            courseTextArr.push(courses[i].getText());
        }
        return Promise.all(courseTextArr);
    }).then(function (selectCourse) {
        let i;
        for (i = 0; i < selectCourse.length; i++) {
            if (selectCourse[i].includes(cousreName) === true) {
                break;
            }
        }
        return gCourses[i].click();
    }).then(function () {
        // wait for course card
        return driver.wait(swd.until.elementsLocated(swd.By.css(".black-text.no-margin.courseInput.bold")), 1000);
    })
}

function goToQuestionPage() {
    let waiting = driver.wait(swd.until.elementsLocated(swd.By.css(".lis.tab")), 1000);
    waiting.then(function () {
        let selectModule = driver.findElements(swd.By.css(".lis.tab"));
        return selectModule;
    }).then(function (modules) {
        gModule = modules;
        let moduleTextArr = [];
        for (let i = 0; i < modules.length; i++) {
            moduleTextArr.push(modules[i].getText());
        }
        return Promise.all(moduleTextArr);
    }).then(function (modulesText) {  
        let i;
        for (i = 0; i < modulesText.length; i++) {
            if (modulesText[i].includes("Dynamic Programming") === true) {
                break;
            }
        }
        return gModule[i].click();
    }).then(function () {
        console.log("Modules reached");
    })
}