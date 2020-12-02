import * as THREE from "three";

export class Chunk extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshPhongMaterial({color: 0x96784b, side: THREE.FrontSide});
        super(geometry, material);
        this.receiveShadow = true;
        this.rotateX(-Math.PI / 2);
    }

    init(scene, player) {
        scene.add(this);
        const playerBox = new THREE.Box3().setFromObject(player);
        const playerSize = playerBox.getSize();
        this.position.y = player.position.y - playerSize.y / 2;
    }
}