////////////////////////////////////////////////////////////////////
// windowイベントの定義
////////////////////////////////////////////////////////////////////
window.addEventListener("load", function () {
	resizeTo(516, 539);
	threeStart(); //Three.jsのスタート関数の実行
});

////////////////////////////////////////////////////////////////////
// Three.jsスタート関数の定義
////////////////////////////////////////////////////////////////////
function threeStart() {
	initThree();  //Three.js初期化関数の実行
	initObject(); //オブジェクト初期化関数の実行
	initCamera(); //カメラ初期化関数の実行
	loop();       //無限ループ関数の実行
}

////////////////////////////////////////////////////////////////////
// Three.js初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var renderer,    //レンダラーオブジェクト
    scene,       //シーンオブジェクト
    canvasFrame; //キャンバスフレームのDOM要素
function initThree() {
	//キャンバスフレームDOM要素の取得
	canvasFrame = document.getElementById('canvas-frame');
	//レンダラーオブジェクトの生成
	renderer = new THREE.WebGLRenderer({ antialias: true });
	//renderer = new THREE.CanvasRenderer();//<------------------------------------------------------------------------（canvasレンダラー）
	
	if (!renderer) alert('Three.js の初期化に失敗しました');
	//レンダラーのサイズの設定
	renderer.setSize(canvasFrame.clientWidth, canvasFrame.clientHeight);
	//キャンバスフレームDOM要素にcanvas要素を追加
	canvasFrame.appendChild(renderer.domElement);
	
	//レンダラークリアーカラーの設定
	renderer.setClearColor(0xEEEEEE, 1.0);
	
	//シーンオブジェクトの生成
	scene = new THREE.Scene();
}

////////////////////////////////////////////////////////////////////
// カメラ初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var camera;    //カメラオブジェクト
function initCamera() {
	//カメラオブジェクトの生成
	camera = new THREE.PerspectiveCamera(45, canvasFrame.clientWidth / canvasFrame.clientHeight, 1, 10000);
	//カメラの位置の設定
	camera.position.set(200, 0, 0);
	//カメラの上ベクトルの設定
	camera.up.set(0, 1, 0);
	//カメラの中心位置ベクトルの設定
	camera.lookAt({ x: 0, y: 0, z: 0 }); //トラックボール利用時は自動的に無効
	
	//トラックボールオブジェクトの宣言
	trackball = new THREE.TrackballControls(camera, canvasFrame);
	
	//トラックボール動作範囲のサイズとオフセットの設定
	trackball.screen.width  = canvasFrame.clientWidth;                       //横幅
	trackball.screen.height = canvasFrame.clientHeight;                      //縦幅
	trackball.screen.offsetLeft = canvasFrame.getBoundingClientRect().left;  //左オフセット
	trackball.screen.offsetTop = canvasFrame.getBoundingClientRect().top;    //右オフセット
	
	//トラックボールの回転無効化と回転速度の設定
	trackball.noRotate = false;
	trackball.rotateSpeed = 4.0;
	
	//トラックボールの拡大無効化と拡大速度の設定
	trackball.noZoom = false;
	trackball.zoomSpeed = 4.0;
	
	//トラックボールのカメラ中心移動の無効化と中心速度の設定
	trackball.noPan = false;
	trackball.panSpeed = 1.0;
	trackball.target = new THREE.Vector3(0, 0, 0);
	
	//トラックボールのスタティックムーブの有効化
	trackball.staticMoving = true;
	//トラックボールのダイナミックムーブ時の減衰定数
	trackball.dynamicDampingFactor = 0.3;
	
}

////////////////////////////////////////////////////////////////////
// オブジェクト初期化関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var axis; //軸オブジェクト
var lathe; //回転体オブジェクト
function initObject() {
	//軸オブジェクトの生成
	axis = new THREE.AxisHelper(100);
	//軸オブジェクトのシーンへの追加
	scene.add(axis);
	//軸オブジェクトの位置座標を設定
	axis.position.set(0, 0, 0);
	
	//回転体生成元の線分
	var points = new Array();
	points[0] = new THREE.Vector3(0, 0, -60);
	points[1] = new THREE.Vector3(22, 0, -15);
	points[2] = new THREE.Vector3(30, 0, 30);
	points[3] = new THREE.Vector3(15, 0, 45);
	points[4] = new THREE.Vector3(0, 0, 45);
	//形状オブジェクトの宣言と生成
//	var geometry = new THREE.LatheGeometry(points);
	var geometry = new THREE.LatheGeometry(points, 50, Math.PI/3, Math.PI*5/3);
	//材質オブジェクトの宣言と生成
//	var material = new THREE.MeshNormalMaterial();
	var material = new THREE.MeshNormalMaterial({ shading: THREE.SmoothShading });
	//回転体オブジェクトの生成
	lathe = new THREE.Mesh(geometry, material);
	//回転体オブジェクトのシーンへの追加
	scene.add(lathe);
	//回転体オブジェクトの位置座標を設定
	lathe.position.set(0, 0, 0);
}

////////////////////////////////////////////////////////////////////
// 無限ループ関数の定義
////////////////////////////////////////////////////////////////////
//グローバル変数の宣言
var step = 0; //ステップ数
function loop() {
	//トラックボールによるカメラオブジェクトのプロパティの更新
	trackball.update();
	
	//ステップ数のインクリメント
	step++;
	
	//クリアーカラーで初期化
	renderer.clear();
	//レンダリング
	renderer.render(scene, camera);
	
	//「loop()」関数の呼び出し
	requestAnimationFrame(loop);
}