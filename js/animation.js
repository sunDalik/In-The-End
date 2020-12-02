import {camera, renderer, scene} from "./setup";

export function animateScene(cube) {
    requestAnimationFrame(() => animateScene(cube));
    renderer.render(scene, camera);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}