import * as THREE from "three";
import {drawCube} from "./cube";
import {animateScene} from "./animation";
import {Player} from "./player";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = drawCube();
animateScene(cube);

const player = new Player();
scene.add(player);

camera.position.y = player.position.y + 3;
camera.position.z = player.position.z + 6;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});