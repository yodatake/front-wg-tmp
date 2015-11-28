(function () {

	'use strict';

	// Application
	var app = angular.module("frontWgApp", []);

	// Value(定数定義)
	app.value(
		'consts', {
			'dateFormat': {
				'jpn': 'YYYY年MM月DD日'
			}
		}
	);

	// Module(Model)
	app.factory('Kakeibo', ['consts', function (consts) {
		// コンストラクタ
		function Kakeibo(date, money, item) {
			// this はインスタンスを表します。
			this.date = date;
			this.money = money;
			this.item = item;
		}

		// メソッドはコンストラクタの prototype プロパティに定義します
		// 「プロトタイプチェーン」というキーワードで検索してください。
		Kakeibo.prototype.formatDate = function () {
			// メンバ変数の定義・参照は this.<メンバ変数> を使います。
			// C++, Java と違い this は省略できません。
			return moment(this.date).format(consts.dateFormat.jpn);
		};

		// 表示用に金額をフォーマット
		Kakeibo.prototype.moneyDisp = function () {
			return Number(this.money).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		};

		return Kakeibo;
	}]);

	//Module(Service)
	app.service('KakeiboService', ['Kakeibo', function (Kakeibo) {
		this.getKakeibos = function () {
			var kakeibos = [];
			kakeibos.push(new Kakeibo(new Date(), 1000, "お餅"));
			kakeibos.push(new Kakeibo(new Date('2015/10/10'), 2000, "おかき"));
			kakeibos.push(new Kakeibo(new Date('2015/10/12'), 2000, "おかき"));

			return kakeibos;
		};
	}]);

	// Module(Controller)
	app.controller('KakeiboController', ['$scope', 'KakeiboService', 'Kakeibo',
										 function ($scope, KakeiboService, Kakeibo) {

			$scope.in_kakeibo = new Kakeibo(new Date(), 0, "");

			// 一覧のデータバインド用変数
			$scope.kakeibos = KakeiboService.getKakeibos();

			$scope.addNew = function () {
				$scope.kakeibos.push(angular.copy($scope.in_kakeibo));
			};
										 }
		]);
})();