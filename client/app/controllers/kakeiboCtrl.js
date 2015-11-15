(function () {

	'use strict';

	// 家計簿データを入出力するコントローラ
	angular.module("frontWgApp", []).controller('KakeiboController', KakeiboController);
	
	function KakeiboController($scope, $stateParams) {
		$scope.kakeibos = [];
	};

})();