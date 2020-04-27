require("chromedriver");
let fs = require("fs");
let swd = require("selenium-webdriver");
let credentialsFile = process.argv[2];
let metaDataFile = process.argv[3];
let courseName = process.argv[4];
let bldr = new swd.Builder();
// tab 
let driver = bldr.forBrowser("chrome").build();

let username, password, gCourses;
// ************************************Login******************************************************
let credentialsWillBeReadPromise = fs.promises.readFile(credentialsFile);
credentialsWillBeReadPromise
  .then(function (credentials) {
    // buffer 
    credentials = JSON.parse(credentials);
    username = credentials.username
    password = credentials.password
    // login page
    let googlePageWillBeOpenedPromise = driver.get("https://pepcoding.com/login");
    return googlePageWillBeOpenedPromise;
  })
  // implicit wait 
  .then(function () {
    let WillBeSetPromise = driver.manage().setTimeouts({
      implicit: 10000
    })
    return WillBeSetPromise;
  })
  .then(function () {
    // search email,password
    let email = driver.findElement(swd.By.css("input[type=email]"));
    let password = driver.findElement(swd.By.css("input[type=password]"));
    // PromiseAll=> promiseArr=> promise=> 
    return Promise.all([email, password]);
  }).then(function (ElementsArray) {
    let inputEmail = ElementsArray[0].sendKeys(username);
    let inputPassword = ElementsArray[1].sendKeys(password);
    return Promise.all([inputEmail, inputPassword]);
  }).then(function () {
    let submitBtn = driver.findElement(swd.By.css("button[type=submit]"));
    return submitBtn;
  }).then(function (submitbtn) {
    return submitbtn.click();
  })
  // *******************************Home Page**********************************
  .then(function () {
    // you shouls always wait 
    return driver.wait(swd.until.elementLocated(swd.By.css(".resource a")));
  })
  .then(function () {
    // resource card find
    let resourceCard = driver.findElement(swd.By.css(".resource a"))
    return resourceCard;
  }).then(function (resourcePageAnchor) {
    return resourcePageAnchor.getAttribute("href");
  }).then(function (rPagelink) {
    let NavigateToCourse = driver.get(rPagelink);
    return NavigateToCourse;
  }).then(willWaitForOverlay).then(function () {
    let courseCard = goToCoursePage();
    return courseCard;
  // }).then(function (courseCard) {
    // return courseCard.click();
  }).then(function () {
    //   read json file 
    let metadata = fs.promises.readFile(metaDataFile);
    return metadata;
  }).then(function (metadata) {
    parser = JSON.parse(metadata);
    let question = parser[0];
    let navigate = goToQuestionPage(question);
    return navigate;
  }).catch(function (err) {
    console.log(err);
  })


function goToCoursePage() {
  return navigationHelper(courseName, ".black-text.no-margin.courseInput.bold");
}

function goToQuestionPage(question) {
// resource page 
  return new Promise(function (resolve, reject) {
    let waitPromise = willWaitForOverlay();
    waitPromise
      .then(function () {
        let module = navigationHelper(question.module, ".lis.tab");
        return module;
      }).then(willWaitForOverlay).then(function () {
        let lecture = navigationHelper(question.lecture, "p.title.black-text.no-margin");
        return lecture;
      }).then(willWaitForOverlay).then(function () {
        let clickQuestion = navigationHelper(question.problem, ".collection-item");
        return clickQuestion;
      }).then(function () {
        resolve();
      }).catch(function () {
        reject();
      })
  })

}
 
function willWaitForOverlay() {
  let waitForPromise = new Promise(function (resolve, reject) {
    // search overlay 
    let waitForsoe = driver.wait(swd.until.elementLocated(swd.By.css("#siteOverlay")));
    waitForsoe.then(function () {
      return driver.findElement(swd.By.css("#siteOverlay"));
    }).then(function (soe) {
        let waiting = driver.wait(swd.until.elementIsNotVisible(soe), 10000);
        return waiting;
      }).then(function () {
        resolve();
      }).catch(function (err) {
        reject(err);
      }) 
  })
  return waitForPromise;
}

function navigationHelper(nameToBeSelected, selector) {
  let gElements
  return new Promise(function (resolve, reject) {
    let waiting = driver.wait(swd.until.elementsLocated(swd.By.css(selector)), 1000);
    waiting.then(function(){
      let modulePromise = driver.findElements(swd.By.css(selector));
        return modulePromise;
    }).then(function (modules) {
      gElements = modules
      console.log(modules.length);
      let moduleTextPromiseArr = [];
      for (let i = 0; i < modules.length; i++) {
        moduleTextPromiseArr.push(modules[i].getText());
      }
      return Promise.all(moduleTextPromiseArr);
    }).then(function (AllModulesText) {
      let i;
      for (i = 0; i < AllModulesText.length; i++) {
        if (AllModulesText[i].includes(nameToBeSelected) == true) {
          break;
        }
      }
      let moduleClick = gElements[i].click();
      return moduleClick;
    }).then(function () {
      resolve();
    }).catch(function (err) {
      reject(err);
    })
  })
}