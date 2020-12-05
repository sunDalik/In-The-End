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

export function easeInOutQuad(time) {
    if (time <= 0.5) return 2 * time * time;
    else {
        time -= 0.5;
        return 2 * time * (1 - time) + 0.5;
    }
}

export function easeOutQuad(time) {
    return -1 * (time) * (time - 2);
}

export function easeInQuad(time) {
    return time * time;
}

export function easeInQuart(time) {
    return time * time * time * time;
}

export function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}