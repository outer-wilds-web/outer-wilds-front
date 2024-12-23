export type KeyPressed = {
    engines: {
        front: boolean;
        back: boolean;
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    };
    rotation: {
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    };
};