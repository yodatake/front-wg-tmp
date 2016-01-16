describe('KakeiboControllerのテスト', function() {
	beforeEach(module('frontWgApp'));
	{
		var $controller;
		var $scope;
		
		beforeEach(inject(function(_$controller_) {
			$scope = {};
			$scope.$watch = function () {};
			$controller = _$controller_;
		}));
		describe('$scope.delete', function() {
			it('kakeibo.selectedに入っているKakeiboオブジェクトが、kakeibosから削除されること', function() {
				var controller = $controller('KakeiboController', {$scope: $scope});
				$scope.kakeibos = [];
			});
		});
	}
});
