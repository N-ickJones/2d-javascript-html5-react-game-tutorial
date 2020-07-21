export interface ICreateEngine {
    settings: any;
    game: gameStatus;
    stage: number;
    isJumping: boolean;
    direction: direction;
    position: number;
    jumpMax: number,
    blocks: CreateEngineBlock[];
    setState: React.Dispatch<React.SetStateAction<CreateEngineObject>> | null;
    createLevel(): void;
    checkBlocks(): void;
    doJump(): void;
    jump(): void;
    repaint(): any;
    start(): void;
}

export type CreateEngineObject = {
    stage: number;
    position: number;
    blocks: CreateEngineBlock[];
    status: gameStatus;
}

export type CreateEngineSettings = {
    tile: number;
    jumpVelocity: number;
    jumpHeight: number;
    charWidth: number;
    charHeight: number;
    blockWidth: number;
    blockHeight: number;
}

export type CreateEngineBlock = {
    transform: number;
    height: number;
    width: number;
}

export type CreateEngineLevel = {  
    length: number;
    spacingMin: number;
    spacingMax: number;
    heightMin: number;
    heightMax: number;
    widthMin: number;
    widthMax: number;
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
        public settings: CreateEngineSettings = {
            tile: 20,
            jumpVelocity: 1.5,
            jumpHeight: 50,
            charWidth: 100,
            charHeight: 100,
            blockWidth: 150,
            blockHeight: 200,
        }
    ){}

    setState = null as unknown as React.Dispatch<React.SetStateAction<CreateEngineObject>>;

    isJumping = false;
    hasStarted = false;
    game = gameStatus.Start;
    direction = direction.Up;
    stage = 0;
    position = 0;
    width = 2000;
    offset = 200;
    blocks = [] as CreateEngineBlock[];
    jumpMax = this.settings.tile * this.settings.jumpHeight;
    
    defaultLevel =  {
        length: 10,
        spacingMin: 100,
        spacingMax: 200,
        heightMin: 200,
        heightMax: 400,
        widthMin: 180,
        widthMax: 260
    }
    
    createLevel(level: CreateEngineLevel = this.defaultLevel) {
        this.blocks[0] = { 
            transform: 140,
            height: 300,
            width: 180
        };
        
        for (let i = 1; i < level.length; i++) {
            this.blocks.push({
                height: (level.heightMin + (Math.random() * (level.heightMax - level.heightMin))),
                width: (level.widthMin + (Math.random() * (level.widthMax - level.widthMin))),
                transform: this.blocks[i-1].transform + (level.spacingMin + (Math.random() * (level.spacingMax - level.spacingMin)))
            })
        }
        
        this.blocks = this.blocks.map( (block => ({ height: block.height, width: block.width, transform: block.transform * this.settings.tile })) );
        this.width = this.blocks[this.blocks.length-1].transform + 2000;
    }

    checkBlocks() {
        const charXPos = this.stage + this.offset;
        const charYPos = this.position;

        if (charXPos > this.blocks[this.blocks.length - 1].transform + this.offset && this.position <= 0) {
            this.game = gameStatus.Win;
        }

        this.blocks.forEach((block: CreateEngineBlock) => {
            if (
                charXPos + this.settings.charWidth >= block.transform
                && charYPos <= this.settings.blockHeight
                && charYPos + this.settings.charHeight >= 0
                && charXPos <= block.transform + this.settings.blockWidth
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

