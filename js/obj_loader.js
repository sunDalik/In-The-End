import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';

export const objLoader = new OBJLoader();
export const MODELS = {
    bone_skull: null,
    bone_spine: null,
    grave_broken: null,
    grave_cross: null,
    rock_small: null,
    twig: null,
    twig_2: null
};

export function loadAll(onLoad) {
    loadByUrl('models/bone_skull.obj', onLoad);
    loadByUrl('models/bone_spine.obj', onLoad);
    loadByUrl('models/grave_broken.obj', onLoad);
    loadByUrl('models/grave_cross.obj', onLoad);
    loadByUrl('models/rock_small.obj', onLoad);
    loadByUrl('models/twig.obj', onLoad);
    loadByUrl('models/twig_2.obj', onLoad);
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