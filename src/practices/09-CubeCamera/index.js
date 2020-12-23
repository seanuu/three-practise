import * as Stats from 'stats.js';
import * as THREE from 'three';

// Create cube camera
var cubeCamera = new THREE.CubeCamera( 1, 100000, 128 );
scene.add( cubeCamera );

// Create car
var chromeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: cubeCamera.renderTarget } );
var car = new Mesh( carGeometry, chromeMaterial );
scene.add( car );

// Update the render target cube
car.setVisible( false );
cubeCamera.position.copy( car.position );
cubeCamera.update( renderer, scene );

// Render the scene
car.setVisible( true );
renderer.render( scene, camera );
