angular.module('work-orders')

.controller('AppCtrl', function($http, loginService) {

  var app = this;
  app.completeWorkOrders = 0;
  app.inProgressWorkOrders = 0;

// hides main site content until a user is signed in.
  app.isContentHidden = function () {
    if (loginService.getCurrentUser() === null) {
      return true;
    } else {
      return false;
    }
  };

  //This method is passed down to all child components.
  //it is called any time the Work Orders list gets updated
  //in any way.
  this.getWorkOrders = function () {
    var curUser = loginService.getCurrentUser().username;
    $http.get('/get-orders')
    .then(function(res) {
      app.workOrders = res.data;
      //Create a count of complete and in progress orders
      var complete = 0;
      var inProgress = 0;
      app.workOrders.forEach( function (val,ind,arr) {
        if (val.is_done && val.workername === curUser) {
          complete++;
        } else if (val.workername === curUser) {
          inProgress++;
        }
      });
      app.completeWorkOrders = complete;
      app.inProgressWorkOrders = inProgress;
    });
  }.bind(this);

  if(loginService.getCurrentUser() !== null) {
    if ( loginService.getCurrentUser().username ) {
      // this.getWorkOrders();
    }
  }

  this.getCompleted = function () {
    var curUser = loginService.getCurrentUser().username;
    $http.get('/get-completed')
    .then(function(res) {
      app.workOrders = res.data;
    });
  }.bind(this);

  this.getMyCreated = function () {
    var curUser = loginService.getCurrentUser().username;
    $http.get('/get-my-created/' + curUser)
    .then(function(res) {
      app.workOrders = res.data;
    });
  }.bind(this);

  this.getMyInProgress = function () {
    var curUser = loginService.getCurrentUser().phone;
    $http.get('/get-my-in-progress/' + curUser)
    .then(function(res) {
      app.workOrders = res.data;
    });
  }.bind(this);

})

.component('app', {
  controller: 'AppCtrl',
  templateUrl: '../templates/app.html'
});
