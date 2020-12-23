import * as Stats from 'stats.js';
import * as THREE from 'three';

// @ts-ignore
let height = window.innerHeight;
let width = window.innerWidth;

// 定义场景、相机、渲染器
let canvas = document.getElementById('canvas');
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
// @ts-ignore
let renderer = new THREE.WebGLRenderer({canvas: canvas});

renderer.setClearColor(0xEEEEEE);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

// 添加点光源
let light = new THREE.PointLight(0xFFFFFF);
light.position.set(-30, 40, -10);
light.castShadow = true;
light.shadow.camera.near = 8;
light.shadow.camera.far = 240;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);


// 显示用于简单模拟3个坐标轴的对象
let axes = new THREE.AxesHelper(20);
scene.add(axes);

// 添加一个平面几何
let planeGeometry = new THREE.PlaneGeometry(40, 20);
let planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 5;
plane.position.y = 0;
plane.position.z = 0;

plane.receiveShadow = true;

scene.add(plane);

// 添加一个立方体
let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
let cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -10;
cube.position.y = 4;
cube.position.z = 0;
cube.castShadow = true;
scene.add(cube);

// 添加一个球体
let sphereGeometry = new THREE.SphereGeometry(2, 40, 40);
let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 10;
sphere.position.y = 4;
sphere.position.z = 0;
sphere.castShadow = true;
scene.add(sphere);

// 设定相机位置、渲染图像
camera.position.x = -40;
camera.position.y = 40;
camera.position.z = 40;
camera.lookAt(scene.position);
renderer.render(scene, camera);
