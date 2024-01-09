import * as PIXI from "pixi.js";
import "@pixi/unsafe-eval";
import * as conway from "./conway";

const WIDTH = 512;
const HEIGHT = 512;

let TILE_SIZE = 8;
let FPS_TARGET = 1000 / 30;

window.onload = () => {
    const app = new PIXI.Application({backgroundColor: 0xeeeeee, width: WIDTH, height: HEIGHT, view: document.getElementById('game-render') as HTMLCanvasElement});
    const ctx = new PIXI.Graphics();
    const grid = new PIXI.Graphics();
    let cnw = new conway.Conway({width: Math.floor(WIDTH / TILE_SIZE), height: Math.floor(HEIGHT / TILE_SIZE)});
    const btnReload = document.getElementById("btn-reload") as HTMLButtonElement;
    const btnToggle = document.getElementById("btn-toggle") as HTMLButtonElement;
    const fpsTarget = document.getElementById("fpsTarget") as HTMLInputElement;
    const chkGrid = document.getElementById("chk-grid") as HTMLInputElement;
    const tileSize = document.getElementById("tileSize") as HTMLInputElement;

    let fpst = 0;
    let simulate = false;
    function reloadConway() {
        if (simulate) {
            simulate = false;
            btnToggle.textContent = "Simulate";
        }
        TILE_SIZE = tileSize.valueAsNumber;
        cnw = new conway.Conway({width: Math.floor(WIDTH / TILE_SIZE), height: Math.floor(HEIGHT / TILE_SIZE)});
        if (chkGrid.checked) {
            drawGrid();
        }
        renderConway();
        fpst = 0;
    }
    function renderConway() {
        ctx.clear();
        for (const [pos, state] of cnw.grid.iter_coords()) {
            if (state == conway.ELifeState.Alive) {
                ctx.beginFill(0, 1);
                ctx.drawRect(pos.x * TILE_SIZE, pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
        ctx.endFill();
    }
    function drawGridCell(con: PIXI.Graphics, x: number, y: number) {
        const corners = [[x - TILE_SIZE, y + TILE_SIZE], [x + TILE_SIZE, y + TILE_SIZE], [x + TILE_SIZE, y - TILE_SIZE]];
        con.moveTo(x - TILE_SIZE, y - TILE_SIZE);
        for (const [x, y] of corners) {
            con.lineStyle(1, 0xbbbbbb);
            con.lineTo(x, y);
        }
    }
    function drawGrid() {
        grid.clear();
        for (let y = 0; y < cnw.grid.height; y++) {
            for (let x = 0; x < cnw.grid.width; x++) {
                drawGridCell(grid, x * TILE_SIZE, y * TILE_SIZE);
            }
        }
    }
    chkGrid.onchange = () => {
        if (chkGrid.checked) {
            grid.clear();
            drawGrid();
        } else {
            grid.clear();
        }
    };
    fpsTarget.onchange = () => {
        const nfps = 1000 / fpsTarget.valueAsNumber;
        if (FPS_TARGET != nfps) {
            FPS_TARGET = nfps;
        }
    }
    btnReload.onclick = reloadConway;
    btnToggle.onclick = () => {
        if (simulate) {
            simulate = false;
            btnToggle.textContent = "Simulate";
        } else {
            simulate = true;
            fpst = 0;
            btnToggle.textContent = "Pause";
        }
    };
    app.ticker.add((_) => {
        if (simulate) {
            fpst += app.ticker.deltaMS;
            if (fpst >= FPS_TARGET) {
                cnw.step();
                ctx.clear();
                renderConway();
                fpst = 0;
            }
        }
    });
    drawGrid();
    app.stage.addChild(ctx, grid);
    renderConway();
};