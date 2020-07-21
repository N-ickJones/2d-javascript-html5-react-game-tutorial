export interface ICreateEngine {
    settings: any;
    game: gameStatus;
    stage: number;
    isJumping: boolean;
    direction: direction;
    position: number;
    jumpMax: number,
    blocks: number[];
    checkBlocks(): void;
    doJump(): void;
    jump(): void;
    repaint(): any;
    start(): void;
}

export type CreateEngineObject = {
    stage: number;
    position: number;
    blocks: number[];
    status: gameStatus;
}

export type CreateEngineSettings = {
    tile: number;
    blocks: number[];
    jumpVelocity: number;
    jumpHeight: number;
    charWidth: number;
    charHeight: number;
    blockWidth: number;
    blockHeight: number;
}

export enum gameStatus {
    Start,
    Fail,
    Win
}

export enum direction {
    Up,
    Down
}

export class CreateEngine implements ICreateEngine {
    constructor(
        public setState: React.Dispatch<React.SetStateAction<CreateEngineObject>>,
        public settings: CreateEngineSettings = {
            tile: 10,
            blocks: [
                140,
                250,
                390,
            ],
            jumpVelocity: 1.4,
            jumpHeight: 40,
            charWidth: 80,
            charHeight: 100,
            blockWidth: 80,
            blockHeight: 200,
        }
    ) {}

    isJumping = false;
    hasStarted = false;
    game = gameStatus.Start;
    direction = direction.Up;
    stage = 0;
    position = 0;
    jumpMax = this.settings.tile * this.settings.jumpHeight;
    blocks = this.settings.blocks.map(b => (b * this.settings.tile));

    checkBlocks() {
        const charXPos = this.stage + 200;
        const charYPos = this.position;

        if (charXPos > this.blocks[this.blocks.length - 1] + 200 && this.position <= 0) {
            this.game = gameStatus.Win;
        }

        this.blocks.forEach((block: number) => {
            if (
                charXPos + this.settings.charWidth >= block
                && charYPos <= this.settings.blockHeight
                && charYPos + this.settings.charHeight >= 0
                && charXPos <= block + this.settings.blockWidth
            ) {
                this.game = gameStatus.Fail;
            }
        });
    };

    doJump() {
        if (!this.isJumping) {
            this.position = 0;
            this.direction = direction.Up;
            return;
        }

        if (this.direction === direction.Down && this.position <= 0) {
            this.isJumping = false;
            this.position = 0;
            this.direction = direction.Up;
            return;
        }

        if (this.position >= this.jumpMax) {
            this.direction = direction.Down;
        }

        if (this.direction === direction.Up) {
            this.position += (this.settings.tile * this.settings.jumpVelocity);
        } 
        else {
            this.position -= (this.settings.tile * this.settings.jumpVelocity);
        }
    };

    jump = () => {
        if (!this.isJumping)
        {
            this.isJumping = true;
        }
    };

    repaint = () => {
        this.stage += this.settings.tile;
        this.checkBlocks();
        this.doJump();
        this.setState({
            stage: this.stage,
            position: this.position,
            blocks: this.blocks,
            status: this.game,
        });

        if (this.game !== gameStatus.Start) {
            this.game = gameStatus.Start;
            this.stage = 0;
            this.isJumping = false;
            this.direction = direction.Up;
            this.position = 0;
            return null;
        }

        return requestAnimationFrame(this.repaint);
    };

    start() {
        if (!this.hasStarted) {
            this.repaint();
        }
    }

}

