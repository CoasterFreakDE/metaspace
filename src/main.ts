import './style.css'
import {setupClient} from "./client";
import {setupServerConnection} from "./server-connection";
import {renderSpaceBackground} from "./background";
import {renderPlanetsForeground} from "./foreground";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  
    <div class="hud">
        <div class="hud__item" id="coords"></div>
        <div class="hud__item" id="players">0 players connected</div>
        
        
        <div class="hud__item" id="console-preview"></div>
        <input class="hud__item" id="console" />
    </div>
   <div class="canvas">
     <div class="bg-text">
      <h1>MetaSpace</h1>
      <h2>created by CoasterFreakDE</h2>
     </div>
   </div>
   <canvas class="foreground"></canvas>
   <canvas class="background"></canvas>
`


const {socket, heartbeat} = setupServerConnection()
setupClient(socket, heartbeat)
renderSpaceBackground()
renderPlanetsForeground()