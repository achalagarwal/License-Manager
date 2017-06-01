angular.module('app.controllers', [])

.controller('loginCtrl', function($rootScope, $scope, $ionicPopup, LoginService, $state, HttpService, Backand) {
  $scope.data = {};

  HttpService.getPost()
    .then(function(response) {
      $rootScope.data1 = response;
    })
  HttpService.getFeatureNames() //data3
    .then(function(response) {
      $rootScope.data3 = response;

    })
  HttpService.getComp()
    .then(function(response) {
      $rootScope.data2 = response;
    })
    /*  HttpService.getCompDetails()
        .then(function(response) {
          $rootScope.data3 = response;
        })
        */
  console.log($rootScope.data1, $scope.data.username, $scope.data.password);
  $scope.login = function() {
    LoginService.loginUser($rootScope.data1, $scope.data.username, $scope.data.password).success(function(data) {
      $state.go('side-menu21.ginesysLicenseManager');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    })
  }


})

.controller('ginesysLicenseManagerCtrl', function($rootScope, $scope, Backand, HttpService, $ionicLoading, $state) {

  $ionicLoading.show({
    template: "Loading..."
  });
  /*$ionicLoading.show({
      template: "Loading..."
    });

    HttpService.getComp()
      .then(function(response) {
        $scope.comp = response;
        $ionicLoading.hide();
  */
  $scope.comp = $rootScope.data2;
  $ionicLoading.hide();
  console.log($scope.comp);
})




.controller('companyDetailsCtrl', function($rootScope, $scope, Backand, $ionicLoading, $state, HttpService) {
  $ionicLoading.show({
    template: "Loading..."
  });
  $scope.comp = $rootScope.data2;
  console.log($scope.comp);
  for (var i = 0; i < $scope.comp.data.length; i++) {
    if ($scope.comp.data[i].SerialNumber == $state.params.companyId) {
      $scope.name = $scope.comp.data[i].CustomerName;
      break;

    }
  }


  //$rootScope.data4_1={$state.params.companyId};
  HttpService.getCompDetails($state.params.companyId)
    .then(function(response) {
      $scope.data = response;
      $ionicLoading.hide();
    })

})



.controller('licenseKeyFeatureCtrl', function($rootScope, $ionicPopup,$scope, Backand, $ionicLoading, $state, HttpService) {
  //$scope.get;
  $ionicLoading.show({
    template: "Loading..."
  });
  HttpService.getKeyDetails($state.params.keyId)
    .then(function(response) {
      $scope.data = response;
      //console.log($scope.data.data);
      for (var i = 0; i < $scope.data.data.length; i++) {
        if ($scope.data.data[i].ExpiryDate) {
          var day = $scope.data.data[i].ExpiryDate;
          var month = $scope.data.data[i].ExpiryDate;
          var year = $scope.data.data[i].ExpiryDate;
          day = day.substr(8, 2);
          month = month.substr(5, 2);
          year = year.substr(0, 4);
          $scope.data.data[i].ExpiryDate = day + '/' + month + '/' + year;
        } else {
          $scope.data.data[i].ExpiryDate = "N.A.";
        }
        }

      for (var i = 0; i < $scope.data.data.length; i++) {
        console.log(i);
        var s = $scope.data.data.length - 1;
        console.log(s);
        console.log(i == ($scope.data.data.length - 1));
        if (i == ($scope.data.data.length - 1))
          $ionicLoading.hide();
        $scope.set(i);
      }
    })
  $scope.set = function(i) {
    console.log($scope.data.data[0].LicenseKeyId, $scope.data.data[i].FeatureId);
    HttpService.getFeatureGeneratedDate($scope.data.data[0].LicenseKeyId, $scope.data.data[i].FeatureId)
      .then(function(response) {
        $scope.dates = response.data;
        console.log("respective data", $scope.dates);
        $scope.data.data[i].dates = $scope.dates.data[0].GeneratedOn;

        var day = $scope.data.data[i].dates;
        var month = $scope.data.data[i].dates;
        var year = $scope.data.data[i].dates;
        day = day.substr(8, 2);
        month = month.substr(5, 2);
        year = year.substr(0, 4);
        $scope.data.data[i].dates = day + '/' + month + '/' + year;
      })
    };





  /*  HttpService.getFeatureNames()//data3
      .then(function(response) {
        $scope.data_f = response.data;

      })
      */
  $scope.data_f = $rootScope.data3.data;
  $scope.get = function(id) {

    for (var i = 0; i < $scope.data_f.length; i++) {
      if ($scope.data_f[i].Id == id) {

        return $scope.data_f[i].FeatureName;

      }
    }
  };
  $scope.click=function(a,b,i){
          if (($scope.data.data[i].ExpiryDate = "N.A.") && ($scope.data.data[i].Count==0)) {
      var alertPopup = $ionicPopup.alert({
          title: 'Failed!',
        template: 'No History Available!'
      });
        }
      else
      $state.go("side-menu21.featureDetail",{"key":a, "kId":b});
    //  "auctions", {"product": auction.product, "id": auction.id}

  };

})

.controller('licenseKeyTimeCtrl', function($scope) {

})

.controller('featureDetailCtrl', function($rootScope, $scope, Backand, $ionicLoading, $state, HttpService) {
  $ionicLoading.show({
    template: "Loading..."
  });

  HttpService.getKeyFeatureLog($state.params.key, $state.params.kId)
    .then(function(response) {
      $scope.data = response;
      for (var i = 0; i < $scope.data.data.length; i++) {
        for (var j = 0; j < $rootScope.data1.data.length; j++) {
          if ($rootScope.data1.data[j].Id == $scope.data.data[i].GeneratedBy) {
            $scope.data.data[i].UserName = $rootScope.data1.data[j].UserName;
            break;

          }
        }
      }

      /*  HttpService.getFeatureNames()
          .then(function(response) {
            $scope.data.data_f = response.data;*/
      $scope.data.data_f = $rootScope.data3.data;
      for (var i = 0; i < $scope.data.data_f.length; i++) {
        if ($scope.data.data_f[i].Id == $scope.data.data[0].FeatureId) {
          $scope.name = $scope.data.data_f[i].FeatureName;
        }
      }
      for (var i = 0; i < $scope.data.data.length; i++) {
        if ($scope.data.data[i].ExpiryDate) {
          var day = $scope.data.data[i].ExpiryDate;
          var month = $scope.data.data[i].ExpiryDate;
          var year = $scope.data.data[i].ExpiryDate;
          day = day.substr(8, 2);
          month = month.substr(5, 2);
          year = year.substr(0, 4);
          $scope.data.data[i].ExpiryDate = day + '/' + month + '/' + year;
        } else {
          $scope.data.data[i].ExpiryDate = "N.A.";
        }
      }
      for (var i = 0; i < $scope.data.data.length; i++) {
        if ($scope.data.data[i].GeneratedOn) {
          var day = $scope.data.data[i].GeneratedOn;
          var month = $scope.data.data[i].GeneratedOn;
          var year = $scope.data.data[i].GeneratedOn;
          var time = $scope.data.data[i].GeneratedOn;
          day = day.substr(8, 2);
          month = month.substr(5, 2);
          year = year.substr(0, 4);
          time = time.substr(11, 5);
          $scope.data.data[i].GeneratedOn = "Date: " + day + '/' + month + '/' + year + "  Time:           " + time;
          if (i == $scope.data.data.length - 1)
            $ionicLoading.hide();
        } else {
          $scope.data.data[i].GeneratedOn = "N.A.";
        }
      }
    })

})
