import { EVENT_UPDATE } from "../../Game";
import { Vector2 } from "../../Math/Vector2";

export class MouseController {
    private _leftButtonPressed: boolean = false;
    private _scrollButtonPressed: boolean = false;
    private _rightButtonPressed: boolean = false;
    private _positionInViewport: Vector2 = new Vector2(0, 0);
    private _hasMoved: boolean = false;

    private lastPositionInViewport: Vector2 = new Vector2(0, 0);
    private gameNode: HTMLElement;
    private gameCanvas: HTMLCanvasElement;

    constructor(gameNode: HTMLElement, gameCanvas: HTMLCanvasElement) {
        this.gameNode = gameNode;
        this.gameCanvas = gameCanvas;

        this.setup();
    }

    public get leftButtonPressed(): boolean {
        return this._leftButtonPressed;
    }

    public get scrollButtonPressed(): boolean {
        return this._scrollButtonPressed;
    }

    public get rightButtonPressed(): boolean {
        return this._rightButtonPressed;
    }

    public get positionInViewport(): Vector2 {
        return this._positionInViewport;
    }

    public get hasMoved(): boolean {
        return this._hasMoved;
    }

    private setup(): void {
        this.gameNode.addEventListener("mousemove", (e: MouseEvent) => this.updatePosition(e));
        this.gameNode.addEventListener("mousedown", (e: MouseEvent) => this.updateButtonDown(e));
        this.gameNode.addEventListener("mouseup", (e: MouseEvent) => this.updateButtonUp(e));

        window.addEventListener(EVENT_UPDATE, () => this.update());
    }

    private updateButtonDown(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this._leftButtonPressed = event.button === 0;
        this._scrollButtonPressed = event.button === 1;
        this._rightButtonPressed = event.button === 2;
    }

    private updateButtonUp(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this._leftButtonPressed = event.button === 0 ? false : this._leftButtonPressed;
        this._scrollButtonPressed = event.button === 1 ? false : this._scrollButtonPressed;
        this._rightButtonPressed = event.button === 2 ? false : this._rightButtonPressed;
    }

    private updatePosition(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();

        this._positionInViewport.set(
            event.offsetX / (this.gameCanvas.clientWidth / this.gameCanvas.width) - this.gameCanvas.width / 2,
            -event.offsetY / (this.gameCanvas.clientHeight / this.gameCanvas.height) + this.gameCanvas.height / 2
        );
    }

    private update(): void {
        if (
            this._positionInViewport.x !== this.lastPositionInViewport.x ||
            this._positionInViewport.y !== this.lastPositionInViewport.y
        ) {
            this._hasMoved = true;
            this.lastPositionInViewport.set(this._positionInViewport.x, this._positionInViewport.y);
        } else {
            this._hasMoved = false;
        }
    }
}
