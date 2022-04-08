// Three.js 불러오기
import * as THREE from "../build/three.module.js";
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
class App {
	// 밑줄로 시작하는 field와 method?
	// 밑줄로 시작하는 이유는?
	// 이 App class 내부에서만 사용되는 프라이빗한 기능들 이라는 의미
	// JS에서는 프라이빗한 성격을 부여할수 있는 기능이 없음
	// App클래스 외부에서는 밑줄로 시작하는 field 또는 method를 호출 하면 안된다.
	constructor() {
		// id가 webgl-container인 div 요소를 얻어 와서 divContainer라는 이름으로 저장
		const divContainer = document.querySelector("#webgl-container");
		// 이 divContainer를 field로 정의, divContainer를 this._divContainer로 다른 method에서 참조할 수 있도록 하기 위함
		this._divContainer = divContainer;

		// renderer 객체는 three.js의 webGLRenderer라는 클래스로 생성 가능
		// 생성할 때, 옵션 선택이 가능, antialias: true 값 !
		// antialias를 활성화 시켜주면 3차원 장면이 렌더링 될 때 오브젝트들의 경계선이 계단 현상 없이 부드럽게 표현
		const renderer = new THREE.WebGLRenderer({ antialias: true });

		// renderer 객체에 setPixelRatio 메서드를 호출해서 픽셀의 비율을 정의
		// window값을 불러옴, display 배율이 150%로 설정이 되있기 때문에 1.5
		renderer.setPixelRatio(window.devicePixelRatio);
		// 생성된 renerer의 domEl(canvas 타입의 dom객체)을 divContainer(id = webgl-container)의 자식으로 추가
		divContainer.appendChild(renderer.domElement);
		// 이 renderer가 다른 method에서 참조 할 수 있도록 this._renderer로 정의
		this._renderer = renderer;

		// scene 객체 생성 (three.js 라이브러리에서 Scene 클래스로 생성가능)
		const scene = new THREE.Scene();
		// scene 객체 필드화
		this._scene = scene;

		// 메서드들 호출
		this._setupCamera();
		this._setupLight();
		this._setupModel();
		this._setupControls();

		// 창 크기가 변경되면 발생하는 onresize 이벤트에 이 클래스의 resize 메소드 지정
		// resize 이벤트가 필요한 이유는 renderer나 camera는 창 크기가 변경 될 때 마다 그 크기에 맞게 속성 값을 재설정 해줘야한다.
		// bind를 사용! 그 이유는 resize메소드 안에서 this가 가르키는 객체가 이벤트 객체가 아닌 이 App 클래스의 객체가 되도록 하기 위함
		window.onersize = this.resize.bind(this);
		// resize method를 창 크기가 변경될때 발생하는 이벤트와 상관없이 생성자에서 한번 무조건적으로 호출
		// 이렇게 함으로써 renderer나 camera의 창 크기에 상관없이 설정
		this.resize();

		// API에 넘겨줘서 호출
		// 3차원 그래픽 장면을 만들어주는 메소드
		requestAnimationFrame(this.render.bind(this));
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;
		this._camera = camera;
	}
	// 광원의 색상과 세기 값
	_setupLight() {
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}
	// 마우스 효과 추가
	_setupControls() {
		new OrbitControls(this._camera, this._divContainer);
	}
	// 정육면체 mesh를 생성
	_setupModel() {
		// boxgeometry 클래스를 이용해 객체 생성
		// 3개의 인자값 (세로, 가로, 깊이)
		const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
		// 정육면체 색상
		const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
		const cube = new THREE.Mesh(geometry, fillMaterial);

		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
		// WireFrame형태로 Geometry 표현
		const line = new THREE.LineSegments(
			new THREE.WireframeGeometry(geometry),
			lineMaterial
		);

		const group = new THREE.Group();
		group.add(cube);
		group.add(line);

		this._scene.add(group);
		this._cube = group;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	// time 이라는 인자를 받아옴
	// 렌더링이 처음 시작된 이후 경과된 시간값으로 단위가 milli-second
	// 애니메이션에 이용 가능
	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}
	update(time) {
		// time 전달 milli-second를 second 단위로 변환
		time *= 0.001;

		// this._cube.rotation.x = time;
		// this._cube.rotation.y = time;
	}
}

window.onload = function () {
	new App();
};
