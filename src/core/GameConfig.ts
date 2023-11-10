import { BroadPhaseMethods, CollisionMatrix, CollisionMethods } from "angry-pixel-2d-physics";
import { Rectangle, Vector2 } from "angry-pixel-math";

/**
 * Game configuration options
 * @public
 * @category Core
 */
export interface GameConfig {
    /** HTML element where the game will be created */
    containerNode?: HTMLElement;
    /** Game width */
    gameWidth?: number;
    /** Game height */
    gameHeight?: number;
    /** Enables the debug mode */
    debugEnabled?: boolean;
    /** Background color of canvas */
    canvasColor?: string;
    /** Framerate for physics execution. The allowed values are 60, 120, 180, 240.
     * The higher the framerate, the more accurate the physics will be, but it will consume more processor resources.
     * Default value is 180.
     */
    physicsFramerate?: number;
    /** Define a general scaling for all sprites. It can be overwritten individually on each sprite */
    spriteDefaultScale?: Vector2;
    /** Enable Headless mode. The input and rendering functions are turned off. Ideal for game server development */
    headless?: boolean;
    /** Collision configuration options */
    collisions?: {
        /** Collision detection method: CollisionMethods.SAT or CollisionMethods.ABB. Default value is CollisionMethods.SAT */
        collisionMethod?: CollisionMethods;
        /** Define a fixed area  */
        collisionArea?: Rectangle;
        /** Define a fixed rectangular area for collision detection */
        collisionMatrix?: CollisionMatrix;
        /** Collision broad phase method: BroadPhaseMethods.QuadTree or BroadPhaseMethods.SpartialGrid. Default values is BroadPhaseMethods.SpartialGrid */
        collisionBroadPhaseMethod?: BroadPhaseMethods;
    };
}
