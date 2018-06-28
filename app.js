'use strict';

angular.module('myWeather',[])

.controller('weatherController',['$scope','$http','$interval',function($scope,$http,$interval) {
	
	$scope.currentTemperature = 0;
	$scope.humidity = 0;
	$scope.wind = 0;
	$scope.feelsLike = 0;
	$scope.condition = "Unknown";
	$scope.foreCast = [];

	//create interval to display time
	$scope.timeCheck = 500;
	$scope.location = "";
	$scope.timeInterval = function(){
		$scope.currentDate =Date.now();
	};
	$interval($scope.timeInterval,$scope.timeCheck);

//Get Users permission to detect the user's geo location.

	if ("geolocation" in navigator) {
		      navigator.geolocation.watchPosition(
			      	function geo_success(position) {
			      		var latitude = position.coords.latitude;
					    var longitude = position.coords.longitude;
			      		//successfully detected the coordinates
			      		$http.get('http://api.apixu.com/v1/forecast.json?key=831ba80bf1bf44dc9ba32019180305&q=' + latitude + ","+longitude+"&days=5")
						.then(function successCallback(response){
							$scope.getValues(response);
							$scope.location = response.data.location.name;
						}, function errorCallback(response){
							console.log(response.statusText);
						});
					},
					function geo_error(position){
						//Failed to get coordinates, get location from IP address
						console.log("User denied access");
						$scope.getIpLocation();
					}
				);
	} 
	else {
	  console.log("Can't detect location");
	  $scope.getIpLocation();
	}

	//fetch users location based on IP 
	$scope.getIpLocation = function(){
	
		if(!$scope.location){
			$http.get("http://ip-api.com/json").then(function successCallBack(response){
				$scope.location = response.data.city;
				$scope.getWeather();
			});
		}
	};
	
	$scope.getWeather = function(){

		$http.get('http://api.apixu.com/v1/forecast.json?key=831ba80bf1bf44dc9ba32019180305&q=' + $scope.location+"&days=5")
		.then(function successCallback(response){
		$scope.getValues(response);
	},
		function errorCallback(response) {
			console.log("page is invalid")});
	};

	$scope.getValues = function(response){
		$scope.data = response.data;
		$scope.currentTemperature = $scope.data.current.temp_c;
		$scope.humidity = $scope.data.current.humidity;
		$scope.wind = $scope.data.current.wind_kph;
		$scope.feelsLike = $scope.data.current.feelslike_c;
		$scope.condition = $scope.data.current.condition.text;
		$scope.foreCast = $scope.data.forecast.forecastday;
		$scope.foreCast.shift();
	};
	
}]);