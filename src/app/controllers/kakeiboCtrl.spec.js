/**
 * ユニットテストサンプル
 * 
 * 【Jasmineの機能】
 * describe: テストをグルーピングする宣言。ネストして書くことも可能
 * beforeEach : テスト実行前に実行する処理を書く Javaで言うとsetUp
 * it: ユニットテストを記述する。Javaで言うとこれがtestXxxxというテストメソッド。
 * 
 * 【ng-Mockの機能】
 * module: モジュールの読み込み
 * inject: ServiceやFactoryをDIする。パラメータの両端にアンダースコアをつけて宣言する。(つけなくてもできるけど)
 * 
 */

describe('factry: Kakeiboのテスト', function () {
	// Modelクラス格納用変数
	var Kakeibo = null;

	// 前処理
	beforeEach(function () {
		// アプリモジュールの読み込み
		module('frontWgApp');

		// Factory, Service定義を取得
		inject(function (_Kakeibo_) {
			Kakeibo = _Kakeibo_;
		});
	});

	describe('moneyDispのテスト', function () {

		it('メソッドが定義されていること', function () {
			var kakeibo = new Kakeibo(new Date(), 100, 'おかき');
			expect(kakeibo.moneyDisp()).toBeDefined();
		});

		it('小数点以下2桁0埋めで金額がフォーマットされること', function () {
			var kakeibo = new Kakeibo(new Date(), 100, 'おかき');
			expect(kakeibo.moneyDisp()).toEqual('100.00');
		});

		it('小数点以下2桁は四捨五入されること', function () {
			// TODO 以下のテストが通るように元の処理を変更
			//			var kakeibo = new Kakeibo(new Date(), 100.255, 'おかき');
			//			expect(kakeibo.moneyDisp()).toEqual('100.26');			
			// 			kakeibo.money = 100.254;
			// 			expect(kakeibo.moneyDisp()).toEqual('100.25');
		});
	});

	describe('formatDateのテスト', function () {
		it('メソッドが定義されていること', function () {
			var kakeibo = new Kakeibo();
			expect(kakeibo.formatDate()).toBeDefined();
		});

		it('yyyy年mm月dd日で変換されること', function () {
			var kakeibo = new Kakeibo(new Date('2016/10/10'), 100, 'おかき');
			expect(kakeibo.formatDate()).toEqual('2016年10月10日');
		});

		it('月日部分は0埋めで変換されること', function () {
			var kakeibo = new Kakeibo(new Date('2016/1/1'), 100, 'おかき');
			expect(kakeibo.formatDate()).toEqual('2016年01月01日');
		});
	});

});

describe('service: KakeiboServiceのテスト', function () {
	// Service格納用変数
	var KakeiboService = null;
	// Modelクラス格納用変数
	var Kakeibo = null;

	// 前処理
	beforeEach(function () {
		// アプリモジュールの読み込み
		module('frontWgApp');

		// Factory, Service定義を取得
		inject(function (_KakeiboService_, _Kakeibo_) {
			KakeiboService = _KakeiboService_;
			Kakeibo = _Kakeibo_;
		});
	});

	describe('getKakeibosのテスト', function () {
		it('Kakeiboのインスタンスが一覧で取得できること', function () {
			// TODO: dateも検証したい。new Date()をモック化すれば検証できそう。

			var kakeibos = KakeiboService.getKakeibos();
			expect(kakeibos.length).toEqual(2);

			// Kakeiboインスタンスであることの確認、値の検証を実施
			expect(kakeibos[0]).toEqual(jasmine.any(Kakeibo));
			expect(kakeibos[0].money).toEqual(1000);
			expect(kakeibos[0].item).toEqual('お餅');

			// Kakeiboインスタンスであることの確認、値の検証を実施
			expect(kakeibos[1]).toEqual(jasmine.any(Kakeibo));
			expect(kakeibos[1].money).toEqual(2000);
			expect(kakeibos[1].item).toEqual('おかき');
		});
	});
});

describe('controller: KakeiboControllerのテスト', function () {

	// controller格納用
	var $controller;
	// $scope格納用
	var $scope;
	// Modelクラス格納用変数
	var Kakeibo = null;
	// Service格納用変数
	var KakeiboService = null;

	beforeEach(function () {

		module('frontWgApp');

		$scope = {};

		// Serviceをモック化 (上書きするイメージ)
		module(function ($provide) {
			$provide.service('KakeiboService', ['Kakeibo', function (Kakeibo) {
				// 'callFake'という記法をネットで見かけるがJasmine1系の記法なので以下を使う。
				this.getKakeibos = jasmine.createSpy('getKakeibos').and.callFake(function () {
					// KakeiboServiceもメソッドをモック化
					var mockReturn = [];
					mockReturn.push(new Kakeibo(new Date(), 100, 'testitem'));
					return mockReturn;
				});
			}]);
		});

		// 定義をインジェクション
		inject(function (_$controller_, _Kakeibo_, _KakeiboService_) {
			$controller = _$controller_;
			Kakeibo = _Kakeibo_;
			KakeiboService = _KakeiboService_;
		});
	});

	describe('コンストラクタのテスト', function () {
		it('KakeiboService.getKakeibosがコールされること', function () {
			$controller('KakeiboController', {
				'$scope': $scope,
				'KakeiboService': KakeiboService,
				'Kakeibo': Kakeibo
			});

			// KakeiboService.getKakeibosがコールされること
			expect(KakeiboService.getKakeibos).toHaveBeenCalled();

			// KakeiboService.getKakeibosのリプライが$Scopeに格納されていること
			var kakeibos = $scope.kakeibos;
			expect(kakeibos.length).toEqual(1);

			// Kakeiboインスタンスであることの確認、値の検証を実施
			expect(kakeibos[0]).toEqual(jasmine.any(Kakeibo));
			expect(kakeibos[0].money).toEqual(100);
			expect(kakeibos[0].item).toEqual('testitem');
		});
	});
	
	describe('家計簿一行削除のテスト', function () {
		//		it('Scopeのテストを書く場合の例', function () {
		//			$controller('KakeiboController', {
		//				'$scope': $scope,
		//				'KakeiboService': KakeiboService,
		//				'Kakeibo': Kakeibo
		//			});
		//			
		//			// 事前確認：kakeibosは1行分のはず
		//			expect($scope.kakeibos.length).toEqual(1);
		//
		//			// メソッド実行：Scopeのメソッドをコール。
		//			$scope.deleteKakeibos();
		//			
		//			// 検証：kakeibosが削除されているはず。
		//			expect($scope.kakeibos.length).toEqual(0);
		//		});
	});
});