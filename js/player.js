import * as THREE from "three";
import {Vector3} from "three";
import {renderer, world} from "./setup";
import {chunkSize} from "./chunk";

export class Player extends THREE.Mesh {
    constructor(camera) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({color: 0xffffff});
        super(geometry, material);
        this.camera = camera;
        this.add(camera);
        camera.position.y = 2.5;
        camera.position.z = 3.5;
        camera.rotation.x = -Math.PI / 8;
        this.castShadow = true;
        this.receiveShadow = true;

        this.speed = 0.1;
        this.movingForward = false;
        this.movingBackwards = false;
        this.movingLeft = false;
        this.movingRight = false;

        this.cameraRotationSpeed = 0.05;
        this.movingCameraLeft = false;
        this.movingCameraRight = false;

        this.direction = new Vector3();
        this.lastChunk = new Vector3(0, 0, 0);
        window.addEventListener("keydown", e => this.onKeyDown(e));
        window.addEventListener("keyup", e => this.onKeyUp(e));
    }

    update() {
        this.direction.z = this.movingBackwards - this.movingForward;
        this.direction.x = this.movingRight - this.movingLeft;
        this.direction.normalize();
        this.rotateY((this.movingCameraLeft - this.movingCameraRight) * this.cameraRotationSpeed);

        const dir = new Vector3();
        if (this.direction.z !== 0) {
            this.getWorldDirection(dir);
            const xmove = this.direction.z * dir.x * this.speed;
            const zmove = this.direction.z * dir.z * this.speed;
            this.position.x += xmove;
            this.position.z += zmove;
        }
        if (this.direction.x !== 0) {
            this.getWorldDirection(dir);
            const axis = new THREE.Vector3(0, 1, 0);
            const angle = Math.PI / 2;
            dir.applyAxisAngle(axis, angle);

            const xmove = this.direction.x * dir.x * this.speed;
            const zmove = this.direction.x * dir.z * this.speed;
            this.position.x += xmove;
            this.position.z += zmove;
        }


        const cameraFovStep = 0.7;
        const cameraWalkFov = 71;
        const cameraNormalFov = 75;
        if (this.direction.x !== 0 || this.direction.z !== 0) {
            if (this.camera.fov > cameraWalkFov) {
                this.camera.fov -= cameraFovStep;
                if (this.camera.fov < cameraWalkFov) this.camera.fov = cameraWalkFov;
                this.camera.updateProjectionMatrix();
            }
        } else {
            if (this.camera.fov < cameraNormalFov) {
                this.camera.fov += cameraFovStep;
                if (this.camera.fov > cameraNormalFov) this.camera.fov = cameraNormalFov;
                this.camera.updateProjectionMatrix();
            }
        }

        this.updateChunks();
        renderer.render(world, this.camera); // do we need it?
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

    updateChunks() {
        const currentChunk = this.getChunkTile();
        if (currentChunk.x !== this.lastChunk.x || currentChunk.z !== this.lastChunk.z) {
            this.lastChunk = currentChunk;
            world.loadChunks(currentChunk);
        }
    }

    getChunkTile() {
        const chunkTile = new Vector3(0, 0, 0);
        if (this.position.x === 0) chunkTile.x = 1;
        else if (this.position.x > 0) chunkTile.x = Math.ceil(this.position.x / chunkSize);
        else chunkTile.x = Math.floor(this.position.x / chunkSize);

        if (this.position.z === 0) chunkTile.z = 1;
        else if (this.position.z > 0) chunkTile.z = Math.ceil(this.position.z / chunkSize);
        else chunkTile.z = Math.floor(this.position.z / chunkSize);
        return chunkTile;
    }
}