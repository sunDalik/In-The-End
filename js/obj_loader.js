import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";

const objLoader = new OBJLoader();

export const MODELS = {
    bone_skull: null,
    bone_spine: null,
    grave_broken: null,
    grave_cross: null,
    rock_small: null,
    twig: null,
    twig_2: null,
    ruins_archway_0: null,
    ruins_archway_1: null
};

export let DIRT_TEXTURE = null;

export function loadAll(onLoad) {
    loadByUrl('models/bone_skull.obj', onLoad);
    loadByUrl('models/bone_spine.obj', onLoad);
    loadByUrl('models/grave_broken.obj', onLoad);
    loadByUrl('models/grave_cross.obj', onLoad);
    loadByUrl('models/rock_small.obj', onLoad);
    loadByUrl('models/twig.obj', onLoad);
    loadByUrl('models/twig_2.obj', onLoad);
    loadByUrl('models/ruins_archway_0.obj', onLoad);
    loadByUrl('models/ruins_archway_1.obj', onLoad);
}

export function loadAllTextures(onLoad) {
    new THREE.TextureLoader().load('textures/dirt.jpg', texture => {
        DIRT_TEXTURE = texture;
        onLoad();
    });
}

function loadByUrl(url, onLoad) {
    objLoader.load(url, object => checkLoadCompletion(object, url, onLoad));
}

export function checkLoadCompletion(object, url, onLoad) {
    url = url.slice(7, -4);
    MODELS[url] = object.children[0];
    for (const model in MODELS) {
        if (MODELS[model] === null) return;
    }
    onLoad();
}