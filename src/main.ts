import './style.css'
import {setupClient} from "./client";
import {setupServerConnection} from "./server-connection";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  
  
   <div class="canvas">
     <div class="bg-text">
      <h1>MetaSpace</h1>
      <h2>created by CoasterFreakDE</h2>
     </div>
   </div>
`


const socket = setupServerConnection()
setupClient(socket)