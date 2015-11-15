'use strict';

var app = angular.module('frontWgApp', ['ui.bootstrap','ui.router']);

// router設定
app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: "/",
		templateUrl: "/templates/kakeibo.html"
	});
	
	$urlRouterProvider.otherwise("/");
});
 
app.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});