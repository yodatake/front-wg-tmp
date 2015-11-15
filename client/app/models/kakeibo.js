// クラス定義の方法は
// http://www.yunabe.jp/docs/javascript_class_in_google.html#javascript-
// を参照


// クラスとコンストラクタは関数を使って定義します
var Kakeibo = function(date, money, item) {
	// this はインスタンスを表します。
	this.date = date;
	this.money = money;
	this.item = item;
};

// メソッドはコンストラクタの prototype プロパティに定義します
// 「プロトタイプチェーン」というキーワードで検索してください。
Kakeibo.prototype.getDate = function() {
	// メンバ変数の定義・参照は this.<メンバ変数> を使います。
	// C++, Java と違い this は省略できません。
	return this.date;
};

// 表示用に金額をフォーマット
Kakeibo.prototype.moneyDisp = function() {
	this.money.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
};
