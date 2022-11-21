import {Vector} from "vector2d";

export interface Planet {
    id: string,

    origin: Vector,

    position: Vector;

    radius: number;

    // The planet's mass is used to calculate the gravitational force between planets and players.
    mass: number;

    imageId: number;
}

let last_planets: Planet[] = [];

export function renderPlanetsForeground(planets: Planet[]) {
    if(planets.length === last_planets.length) return;
    const planet_group = document.querySelector<HTMLDivElement>(".planets")!;
    planet_group.innerHTML = "";

    for(const planet of planets) {
        const planet_element = document.createElement("img") as HTMLImageElement;
        planet_element.classList.add("planet");
        planet_element.id = planet.id;
        planet_element.src = `./assets/planets/planet0${planet.imageId}.png`;
        planet_element.style.left = `${-(planet.position.x - planet.origin.x)}px`
        planet_element.style.top = `${-(planet.position.y - planet.origin.y) - 100}px`

        planet_element.style.width = `${planet.radius * 2}px`;
        planet_element.style.height = `${planet.radius * 2}px`
        planet_group.appendChild(planet_element);
    }
    last_planets = planets;
}

export function getCurrentPlanets() {
    return last_planets;
}