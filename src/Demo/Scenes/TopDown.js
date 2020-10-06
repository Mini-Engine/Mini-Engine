import Scene from "../../Engine/Scene";
import SpotPointer from "../GameObjects/SpotPointer";
import FollowPlayerCamera from "../Components/FollowPlayerCamera";
import PlayerTop from "../GameObjects/PlayerTop";
import ForegroundTopDown from "../GameObjects/ForegroundTopDown";
import renderLayers from "../Config/renderLayers";
import Bot from "../GameObjects/Bot";
import InputManager from "../GameObjects/InputManager";
import PlayerStats from "../GameObjects/UI/PlayerStats";
import Game from "../../Engine/Game";

export default class TopDown extends Scene {
    assetManager = Game.get("AssetManager");
    assetsLoaded = false;
    gameObjectsLoaded = false;

    constructor() {
        super();

        this.loadAssets();
    }

    start(event) {
        event.game.canvasBGColor = "#080500";
        this.update();
    }

    update() {
        if (this.assetsLoaded === false) {
            this.assetsLoaded = this.assetManager.getAssetsLoaded();
        }

        if (this.assetsLoaded && this.gameObjectsLoaded === false) {
            this.setupGameObjects();
            this.gameObjectsLoaded = true;
        }
    }

    loadAssets() {
        this.assetManager.createImage("image/demo/earth-cave.png");
        this.assetManager.createImage("image/demo/player-top-down.png");
        this.assetManager.createImage("image/demo/projectile.png");
        this.assetManager.createImage("image/demo/avatar.png");
    }

    setupGameObjects() {
        this.addGameObject(() => new ForegroundTopDown(), "Foreground")
            .addGameObject(() => new SpotPointer(), "SpotPointer")
            .addGameObject(() => new InputManager(), "InputManager")
            .addGameObject(() => new PlayerTop(), "Player")
            .addGameObject(() => new PlayerStats(), "PlayerStats")
            .addGameObject(() => new Bot(690, 385), "Bot");

        this.gameCamera.camera.renderLayers = renderLayers;
        this.gameCamera.addComponent(() => new FollowPlayerCamera());
    }
}
