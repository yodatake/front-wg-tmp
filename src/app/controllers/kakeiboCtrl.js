(function () {

	'use strict';

	// Application
	var app = angular.module("frontWgApp", []);

	// Value(定数定義)
	app.value(
		'dateFormat', {
			'jpn': 'YYYY年MM月DD日'
		});

	// Module(Model)
	app.factory('Kakeibo', ['dateFormat', function (dateFormat) {
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
			return moment(this.date).format(dateFormat.jpn);
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
			kakeibos[0] = new Kakeibo(new Date(), 1000, "お餅");
			kakeibos[1] = new Kakeibo(new Date(), 2000, "おかき");

			return kakeibos;
		};
	}]);

	// Module(Controller)
	app.controller('KakeiboController', ['$scope', 'KakeiboService', 'Kakeibo',
			function ($scope, KakeiboService, Kakeibo) {
				// 一覧のデータバインド用変数
				$scope.kakeibos = KakeiboService.getKakeibos();
			}
		]);
})();
