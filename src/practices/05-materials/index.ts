import * as Stats from 'stats.js';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls';

declare var dat: any;

let scene, camera, renderer, controls, stats;

let height = window.innerHeight;
let width = window.innerWidth;

init();
addDirectionalLight();
addPlane();
addSphere(4, -5, 4, 8);
animation();

function init() {
    // 定义场景、相机、渲染器
    let canvas = document.getElementById('canvas');
    scene = new THREE.Scene();
    // @ts-ignore
    renderer = new THREE.WebGLRenderer({canvas: canvas});

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    controls = new THREE.OrbitControls(camera);

    renderer.setClearColor(0x000000);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;

    camera.position.x = -40;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(scene.position);

    // 设定相机位置、渲染图像
    camera.updateMatrixWorld();
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
    // light.position.set(0.5, 0.5, 1);
    light.position.set(50, 80, 100);
    // light.position.multiplyScalar(20);
    // light.shadow.bias = 0.01;

    // let helper = new THREE.DirectionalLightHelper(light, 5);
    scene.add(light);
    // scene.add(helper);

    // //Create a helper for the shadow camera (optional)
    // let helper = new THREE.CameraHelper(light.shadow.camera);
    // scene.add(helper);
}

function addPlane() {
    // 添加一个平面几何
    let planeGeometry = new THREE.PlaneGeometry(60, 60);
    let planeMaterial = new THREE.MeshPhysicalMaterial({color: '#cccccc'});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    // plane.receiveShadow = true;
    scene.add(plane);
}

function addSphere(radius, x, y, z) {
    let sphereGeom = new THREE.SphereGeometry(radius, 20, 20);
    let material = new THREE.MeshNormalMaterial({wireframe: true});
    let sphere = new THREE.Mesh(sphereGeom, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
}


function animation() {
    stats.begin();
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
    controls.update();
    stats.end();
}














