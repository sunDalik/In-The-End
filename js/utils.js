import * as THREE from "three";
import {Vector3} from "three";

export function removeObjectFromArray(object, array) {
    const index = array.indexOf(object);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

export function callTimes(method, times) {
    for (let i = 0; i < times; i++) {
        method();
    }
}

export function getSize(object) {
    const objectBox = new THREE.Box3().setFromObject(object);
    const objectSize = new Vector3();
    objectBox.getSize(objectSize);
    return objectSize;
}