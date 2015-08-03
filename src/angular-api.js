angular.module("ngApi", []);
angular.module("ngApi").provider("api", function () {
	var _config;
	
	this.setConfig = function (config) {
		_config = config;
	};
	
	this.$get = ["$http", function ($http) {
		return buildApi(_config, $http);
	}];
});