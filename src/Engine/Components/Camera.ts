import { CameraComponent } from "../Component";
import { DomManager } from "../Core/Dom/DomManager";
import { GameEngineException } from "../Core/Exception/GameEngineException";
import { CameraData } from "../Core/Rendering/CameraData";
import { RenderManager } from "../Core/Rendering/RenderManager";
import { container } from "../Game";
import { LAYER_DEFAULT } from "../GameObject";
import { Rectangle } from "../Math/Rectangle";
import { ComponentTypes } from "./ComponentTypes";

const DEFAULT_LAYERS: string[] = [LAYER_DEFAULT];

export class Camera extends CameraComponent {
    private renderManager: RenderManager = container.getSingleton<RenderManager>("RenderManager");
    private domManager: DomManager = container.getSingleton<DomManager>("DomManager");

    private _layers: string[] = DEFAULT_LAYERS;
    private _depth: number = 0;
    private _zoom: number = 1;

    private _originalViewportRect: Rectangle = new Rectangle(0, 0, 0, 0);
    private _viewportRect: Rectangle = new Rectangle(0, 0, 0, 0);
    private _worldSpaceRect: Rectangle = new Rectangle(0, 0, 0, 0);

    private canvas: HTMLCanvasElement;
    private cameraData: CameraData = new CameraData();

    constructor() {
        super();

        this.allowMultiple = false;
        this.type = ComponentTypes.Camera;
        this.canvas = this.domManager.canvas;
    }

    public set layers(layers: string[]) {
        this._layers = [...DEFAULT_LAYERS, ...layers];
    }

    public get layers(): string[] {
        return this._layers;
    }

    public set depth(depth: number) {
        this._depth = depth;
    }

    public get depth(): number {
        return this._depth;
    }

    public set zoom(zoom: number) {
        if (this.zoom <= 0) {
            throw new GameEngineException("zoom must be greather than 0");
        }

        this._zoom = zoom;
    }

    public get zoom(): number {
        return this._zoom;
    }

    public get originalViewportRect(): Rectangle {
        return this._originalViewportRect;
    }

    public get worldSpaceRect(): Rectangle {
        return this._worldSpaceRect;
    }

    public get viewportRect(): Rectangle {
        return this._viewportRect;
    }

    public addLayer(layer: string): void {
        this._layers.push(layer);
    }

    protected update(): void {
        this.updateOriginalViewportRect();
        this.updateViewportRect();
        this.updateWorldSpaceRect();
        this.updateCameraData();
    }

    private updateOriginalViewportRect(): void {
        this._originalViewportRect.x = -this.canvas.width / 2;
        this._originalViewportRect.y = -this.canvas.height / 2;
        this._originalViewportRect.width = this.canvas.width;
        this._originalViewportRect.height = this.canvas.height;
    }

    private updateViewportRect(): void {
        const inverseZoom: number = 1 / this._zoom;

        this._viewportRect.x = this._originalViewportRect.x * inverseZoom;
        this._viewportRect.y = this._originalViewportRect.y * inverseZoom;
        this._viewportRect.width = this._originalViewportRect.width * inverseZoom;
        this._viewportRect.height = this._originalViewportRect.height * inverseZoom;
    }

    private updateWorldSpaceRect(): void {
        this._worldSpaceRect.x = this.gameObject.transform.position.x - this._viewportRect.width / 2;
        this._worldSpaceRect.y = this.gameObject.transform.position.y - this._viewportRect.height / 2;
        this._worldSpaceRect.width = this._viewportRect.width;
        this._worldSpaceRect.height = this._viewportRect.height;
    }

    private updateCameraData(): void {
        this.cameraData.depth = this._depth;
        this.cameraData.layers = this._layers;
        this.cameraData.originalViewportRect = this._originalViewportRect;
        this.cameraData.viewportRect = this._viewportRect;
        this.cameraData.worldSpaceRect = this._worldSpaceRect;
        this.cameraData.zoom = this._zoom;

        this.renderManager.addCameraData(this.cameraData);
    }
}
