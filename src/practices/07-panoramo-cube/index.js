import * as Stats from 'stats.js';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let canvas = document.getElementById('canvas');
let camera, renderer, scene, controls;

let height = window.innerHeight;
let width = window.innerWidth;

init();
animate();


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 0.01;

    renderer = new THREE.WebGLRenderer({canvas});

    // 设置视图大小
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // 指定相机视线
    camera.target = new THREE.Vector3(0, 0, 0);

    // 轨道控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.rotateSpeed = -0.25;

}


function animate() {

}
