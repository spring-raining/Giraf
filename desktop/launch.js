const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Report crashes to our server.
//require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

var osxQuitNow = false;

function launchMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    center: true
  });
  mainWindow.loadURL("file://" + __dirname + "/../dist/index.html");

  mainWindow.on("close", function (e) {
    if (process.platform == "darwin" && !osxQuitNow) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function launch() {
  app.on("activate", function() {
    mainWindow.show();
  });

  app.on("before-quit", function() {
    osxQuitNow = true;
  });

  app.on("will-quit", function() {
    mainWindow = null;
  });

  app.on("window-all-closed", function () {
    if (process.platform != "darwin") {
      app.quit();
    }
  });

  app.on("ready", function () {
    launchMainWindow();
  });
}

launch();
