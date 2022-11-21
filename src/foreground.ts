import {Vector} from "vector2d";

export interface Planet {
    origin: Vector;

    position: Vector;

    radius: number;

    // The planet's mass is used to calculate the gravitational force between planets and players.
    mass: number;

    imageId: number;
}

let planetsArray: Planet[] = [];
let images: HTMLImageElement[] = [];



export function renderPlanetsForeground() {
    const canvas = document.querySelector<HTMLCanvasElement>(".foreground")!;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width = canvas.clientWidth;
    const height = canvas.height = canvas.clientHeight;
    const canvas_game = document.querySelector<HTMLDivElement>('.canvas')!

    const planets = 10;
    const planetSize = 1000;
    const planetMinSize = 200;

    for (let i = 0; i < planets; i++) {
        const origin = new Vector((Math.random() * width) - (width / 2), (Math.random() * height) - (height / 2))
        const imageId = Math.floor(Math.random() * 9);
        const image = new Image();
        image.src = `./assets/planets/planet0${imageId}.png`;
        images[imageId] = image;
        planetsArray.push({
            origin: origin,
            position: origin,
            radius: Math.max(planetMinSize, Math.random() * planetSize),
            mass: Math.random() * 10,
            imageId: imageId
        });
    }

    function drawPlanets() {
        for (let i = 0; i < planets; i++) {
            const planet = planetsArray[i];
            ctx.drawImage(images[planet.imageId], planet.position.x, planet.position.y, planet.radius, planet.radius);
        }
    }

    function movePlanets() {
        const canvasRect = canvas_game.getBoundingClientRect()
        const canvasPos = new Vector(canvasRect.left, canvasRect.top)

        for (let i = 0; i < planets; i++) {
            const planet = planetsArray[i];
            const planetPosition = planet.origin;

            // Position of the planet relative to the player
            const relativePosition = canvasPos.subtract(planetPosition);
            planet.position.x = relativePosition.x;
            planet.position.y = relativePosition.y;
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        drawPlanets();
        movePlanets();
        requestAnimationFrame(render);
    }

    render();
}