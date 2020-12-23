import * as Stats from 'stats.js';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';


let scene, camera, renderer, controls, stats;

let height = window.innerHeight;
let width = window.innerWidth;

init();
addDirectionalLight();
addSphere(100);
animation();

function init() {
    let frustumSize = 500;
    let aspect = window.innerWidth / window.innerHeight;

    // 定义场景、相机、渲染器
    let canvas = document.getElementById('canvas');
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({canvas: canvas});

    // camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 800);
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    controls = new THREE.OrbitControls(camera);

    renderer.setClearColor(0x000000);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    camera.position.set(-200, 200, 200);

    // 设定相机位置、渲染图像
    camera.updateMatrixWorld(true);
    renderer.render(scene, camera);

    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // 显示用于简单模拟3个坐标轴的对象
    let axes = new THREE.AxesHelper(20);
    scene.add(axes);
}

function addDirectionalLight() {
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 80, 100);
    scene.add(light);
}


function addSphere(size) {
    let cubeGeom = new THREE.BoxGeometry(size, size, size);
    let material = new THREE.MeshNormalMaterial({wireframe: true});
    let cube = new THREE.Mesh(cubeGeom, material);
    cube.position.set(0, size / 2, 0);
    scene.add(cube);
}

function animation() {
    stats.begin();
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
    controls.update();
    stats.end();
}














