import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

export const objLoader = new OBJLoader();
export const mtlLoader = new MTLLoader();

export function loadResource(url, onLoad) {
    objLoader.load(url, onLoad);
}