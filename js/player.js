import * as THREE from "three";
import {Vector3} from "three";
import {camera, playerLight, renderer, scene} from "./setup";

export class Player extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.ConeGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xffffff});
        super(geometry, material);
        this.castShadow = true;
        this.receiveShadow = true;
        this.speed = 0.1;
        this.cameraRotationSpeed = 0.05;
        this.movingForward = false;
        this.movingBackwards = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.movingCameraLeft = false;
        this.movingCameraRight = false;
        this.direction = new Vector3();
        window.addEventListener("keydown", e => this.onKeyDown(e));
        window.addEventListener("keyup", e => this.onKeyUp(e));
        this.update();
    }

    update() {
        this.direction.z = this.movingBackwards - this.movingForward;
        this.direction.x = this.movingRight - this.movingLeft;
        this.direction.normalize();
        this.rotateY((this.movingCameraLeft - this.movingCameraRight) * this.cameraRotationSpeed);

        //const cameraDirection = camera.getWorldDirection();
        if (this.direction.z !== 0) {
            const dir = this.getWorldDirection();
            console.log(dir);
            const xmove = this.direction.z * dir.x * this.speed;
            const zmove = this.direction.z * dir.z * this.speed;
            this.position.x += xmove;
            this.position.z += zmove;
        }
        if (this.direction.x !== 0) {
            const dir = this.getWorldDirection();
            const axis = new THREE.Vector3(0, 1, 0);
            const angle = Math.PI / 2;
            dir.applyAxisAngle(axis, angle);

            const xmove = this.direction.x * dir.x * this.speed;
            const zmove = this.direction.x * dir.z * this.speed;
            this.position.x += xmove;
            this.position.z += zmove;
        }

        playerLight.position.lerp(new Vector3(this.position.x, playerLight.position.y, this.position.z), 0.02);
        renderer.render(scene, camera); // do we need it?
        window.requestAnimationFrame(() => this.update());
    }

    onKeyDown(e) {
        switch (e.code) {
            case "KeyW":
                this.movingForward = true;
                break;
            case "KeyS":
                this.movingBackwards = true;
                break;
            case "KeyA":
                this.movingLeft = true;
                break;
            case "KeyD":
                this.movingRight = true;
                break;
            case "KeyQ":
                this.movingCameraLeft = true;
                break;
            case "KeyE":
                this.movingCameraRight = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case "KeyW":
                this.movingForward = false;
                break;
            case "KeyS":
                this.movingBackwards = false;
                break;
            case "KeyA":
                this.movingLeft = false;
                break;
            case "KeyD":
                this.movingRight = false;
                break;
            case "KeyQ":
                this.movingCameraLeft = false;
                break;
            case "KeyE":
                this.movingCameraRight = false;
                break;
        }
    }
}