import './style.css'
import {setupClient} from "./client";
import {setupServerConnection} from "./server-connection";
import {renderSpaceBackground} from "./background";
import {renderPlanetsForeground} from "./foreground";
import {PlayerManagement} from "./players";
import {ChatAndConsole} from "./chat";

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

const playerManagement = new PlayerManagement()
const {socket, heartbeat} = setupServerConnection()
const chatManagement = new ChatAndConsole(socket, playerManagement)
setupClient(socket, heartbeat, playerManagement, chatManagement)
renderSpaceBackground()
renderPlanetsForeground()
