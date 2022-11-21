export function renderSpaceBackground() {
    const canvas = document.querySelector<HTMLCanvasElement>(".background")!;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const stars = 1000;
    const starSize = 2;
    const starSpeed = 0.1;
    const starColor = "#ffffff";

    const starsArray: any[] = [];

    for (let i = 0; i < stars; i++) {
        starsArray.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * starSize,
            speed: Math.random() * starSpeed
        });
    }

    function drawStars() {
        ctx.fillStyle = starColor;
        for (let i = 0; i < stars; i++) {
            const star = starsArray[i];
            ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    function moveStars() {
        for (let i = 0; i < stars; i++) {
            const star = starsArray[i];
            star.y += star.speed;
            if (star.y > height) {
                star.y = -star.size;
            }
        }
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        drawStars();
        moveStars();
        requestAnimationFrame(render);
    }

    render();
}