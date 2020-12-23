import * as THREE from 'three';


var renderer, scene, camera, stats;
var sphere, length1;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var radius = 100, segments = 68, rings = 38;
var vertices1 = new THREE.SphereGeometry(radius, segments, rings).vertices;
var vertices2 = new THREE.BoxGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10).vertices;
length1 = vertices1.length;
var vertices = vertices1.concat(vertices2);

var positions = new Float32Array(vertices.length * 3);
var colors = new Float32Array(vertices.length * 3);
var sizes = new Float32Array(vertices.length);
var vertex;

var color = new THREE.Color();
for (var i = 0, l = vertices.length; i < l; i++) {
    vertex = vertices[i];
    vertex.toArray(positions, i * 3);
    if (i < length1) {
        color.setHSL(0.01 + 0.1 * (i / length1), 0.99, (vertex.y + radius) / (4 * radius));
    } else {
        color.setHSL(0.6, 0.75, 0.25 + vertex.y / (2 * radius));
    }
    color.toArray(colors, i * 3);
    sizes[i] = i < length1 ? 10 : 40;
}

console.log(positions)
