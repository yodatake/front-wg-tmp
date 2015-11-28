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
			this.selected = false;
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
			$scope.in_kakeibo = new Kakeibo(numberringId(), new Date(), 0, "");

			// 新規登録
			$scope.add = function () {
				var newone = angular.copy($scope.in_kakeibo);
				newone.id = numberringId();
				$scope.kakeibos.push(newone);
			};

			// 修正
			$scope.modify = function () {
				$scope.kakeibos.forEach(function (kakeibo, idx, kakeibos) {
					// idが一致したら
					if (kakeibo.id === $scope.in_kakeibo.id) {
						// spliceで配列の要素を置換
						kakeibos.splice(idx, 1, angular.copy($scope.in_kakeibo));
						kakeibos[idx].selected = true;
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
				// 入力項目選択されている行の内容をコピー(一覧と同期されないようにコピーとする)
				$scope.in_kakeibo = angular.copy(selkakeibo);

				// selected更新
				$scope.kakeibos.forEach(function (kakeibo) {
					kakeibo.selected = (kakeibo.id === selkakeibo.id);
				});
			};

			// IDの採番
			function numberringId() {
				// idのリストを取得
				var ids = $scope.kakeibos.map(function (kakeibos) {
					return kakeibos.id;
				});
				// 最大値+1
				return Math.max.apply(null, ids) + 1;
			}
		}
		]);
})();