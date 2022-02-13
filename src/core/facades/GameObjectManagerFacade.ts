import { GameObjectManager, GameObjectFactory } from "../managers/GameObjectManager";
import { GameObject } from "../GameObject";

export class GameObjectManagerFacade {
    private static manager: GameObjectManager;

    public static initialize(manager: GameObjectManager): void {
        this.manager = manager;
    }

    /**
     * @param gameObjectFactory The factory function for the game object
     * @param name The name of the game object, this must not be used by another game object
     * @param parent (optional) The parent game object
     * @returns the added game object
     */
    public static addGameObject<T extends GameObject>(
        gameObjectFactory: GameObjectFactory,
        name: string,
        parent: GameObject = null
    ): T {
        return this.manager.addGameObject<T>(gameObjectFactory, name, parent) as T;
    }

    /**
     * @returns All the added game objects
     */
    public static getGameObjects(): GameObject[] {
        return this.manager.getGameObjects();
    }

    /**
     * @param name The name of the game object to find
     * @returns The found game object
     */
    public static findGameObjectByName<T extends GameObject>(name: string): T {
        return this.manager.findGameObjectByName(name) as T;
    }

    /**
     * @param parent The parent game object
     * @returns The found game objects
     */
    public static findGameObjectsByParent(parent: GameObject): GameObject[] {
        return this.manager.findGameObjectsByParent(parent);
    }

    /**
     *
     * @param parent The parent game object
     * @param name The name of the game object to find
     * @returns The found game objects
     */
    public static findGameObjectByParentAndName<T extends GameObject>(parent: GameObject, name: string): T {
        return this.manager.findGameObjectByParentAndName(parent, name) as T;
    }

    /**
     * @param tag The tag of the game objects to find
     * @returns The found game objects
     */
    public static findGameObjectsByTag(tag: string): GameObject[] {
        return this.manager.findGameObjectsByTag(tag);
    }

    /**
     * @param tag The tag of the game object to find
     * @returns The found game object
     */
    public static findGameObjectByTag<T extends GameObject>(tag: string): T {
        return this.manager.findGameObjectByTag(tag) as T;
    }

    /**
     * Destroy the game objects
     * @param gameObject The game object to destory
     */
    public static destroyGameObject(gameObject: GameObject): void {
        this.manager.destroyGameObject(gameObject);
    }

    /**
     * Destroy one game objects by its name
     * @param name The name of the game object
     */
    public static destroyGameObjectByName(name: string): void {
        this.destroyGameObject(this.findGameObjectByName(name));
    }
}
