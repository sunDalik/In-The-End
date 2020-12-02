import * as THREE from "three";
import {camera, scene} from "./setup";

export function drawCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.castShadow = true;
    cube.receiveShadow = true;
    camera.position.z = 5;
    return cube;
}