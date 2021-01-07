import { TimeManager } from "../Core/Time/TimeManager";
import { container } from "../Game";

export class TimeManagerFacade {
    private static timeManager: TimeManager = null;

    public static initialize(): void {
        this.timeManager = container.getSingleton<TimeManager>("TimeManager");
    }

    public static get deltaTime(): number {
        return this.timeManager.deltaTime;
    }
}