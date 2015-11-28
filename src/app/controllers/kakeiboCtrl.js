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
		function Kakeibo(id, date, money, item) {
			// this はインスタンスを表します。
			this.id = id;
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
			return Number(this.money).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		};

		return Kakeibo;
	}]);

	//Module(Service)
	app.service('KakeiboService', ['Kakeibo', function (Kakeibo) {
		this.getKakeibos = function () {
			var kakeibos = [];
			kakeibos.push(new Kakeibo(kakeibos.length, new Date(), 1000, "お餅"));
			kakeibos.push(new Kakeibo(kakeibos.length, new Date('2015/10/10'), 2000, "おかき"));
			kakeibos.push(new Kakeibo(kakeibos.length, new Date('2015/10/12'), 2000, "おかき"));

			return kakeibos;
		};
	}]);

	// Module(Controller)
	app.controller('KakeiboController', ['$scope', 'KakeiboService', 'Kakeibo', function ($scope, KakeiboService, Kakeibo) {
			// 一覧のデータバインド用変数
			$scope.kakeibos = KakeiboService.getKakeibos();
		
			// 入力された家計簿
			$scope.in_kakeibo = new Kakeibo($scope.kakeibos.length, new Date(), 0, "");

			// 新規登録
			$scope.add = function () {
				$scope.kakeibos.push(angular.copy($scope.in_kakeibo));
			};
		
			// 修正
			$scope.modify = function () {
				$scope.kakeibos.forEach(function (kakeibo, idx, kakeibos) {
					// idが一致したら
					if (kakeibo.id === $scope.in_kakeibo.id) {
						// spliceで配列の要素を置換
						kakeibos.splice(idx, 1, $scope.in_kakeibo);
					}
				});
			};
		
			// 行削除
			$scope.delete = function () {
				$scope.kakeibos = $scope.kakeibos.filter(function (kakeibo) {
					return !kakeibo.selected;
				});
			};

			// 行選択
			$scope.selected = function (selkakeibo) {
				// 入力項目選択されている行の内容をコピー
				$scope.in_kakeibo = new Kakeibo($scope.kakeibos.length, selkakeibo.date, selkakeibo.money, selkakeibo.item);

				// selected更新
				$scope.kakeibos.forEach(function (kakeibo) {
					kakeibo.selected = (kakeibo.id === selkakeibo.id);
				});
			};
		}
		]);
})();