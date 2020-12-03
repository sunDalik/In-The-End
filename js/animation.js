export function animateScene(cube) {
    requestAnimationFrame(() => animateScene(cube));
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}