import * as THREE from "three";
import {world} from "./setup";

export function drawCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    world.add(cube);
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
}