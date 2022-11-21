import {PlayerManagement} from "./players";
import {highlight} from "./console";

/**
 * Each player has a chat bubble above their player.
 * This is the chat bubble.
 */
export class ChatAndConsole {

  private canvas = document.querySelector<HTMLDivElement>('.canvas')!
  private console_input = document.querySelector<HTMLInputElement>('#console') as HTMLInputElement
  private consolePreview = document.querySelector<HTMLDivElement>('#console-preview') as HTMLDivElement

  private updateChatBubble(messageID: string, playerID: string, message: string) {
    let chatBubble = document.getElementById(`chat-bubble-${playerID}`) as HTMLElement
    if(!chatBubble) {
      chatBubble = document.createElement('div')
      chatBubble.classList.add('chat-bubble')
      chatBubble.id = `chat-bubble-${playerID}`
      this.canvas.appendChild(chatBubble)
    }
    chatBubble.innerText = message
  }

  constructor(socket: WebSocket, private playerManagement: PlayerManagement) {
    this.console_input.onfocus = () => {
      this.consolePreview.style.display = 'block'
      socket.send(JSON.stringify({event: 'commands'}))
    }

    this.console_input.oninput = () => {
      socket.send(JSON.stringify({event: 'commands'}))
    }

    this.console_input.addEventListener('focusout', () => {
      this.consolePreview.style.display = 'none'
    })
  }

  public updateConsolePreview(commands: string[]) {
    if(this.console_input !== document.activeElement) return
    const autocomplete = document.querySelector<HTMLInputElement>('#console-preview') as HTMLInputElement
    const command = this.console_input.value
    if(!command.startsWith('/')) {
      autocomplete.innerHTML = ''
      document.documentElement.style.setProperty('--console-height', `0px`)
      return;
    }

    const commands_list = commands.filter((command) => command.startsWith(this.console_input.value)).map((command) => highlight(command, this.console_input.value))
    autocomplete.innerHTML = commands_list.join('\n')
    document.documentElement.style.setProperty('--console-height', `${commands_list.length * 20}px`)
  }

  public onMessage(message: string, playerID: string) {
    const messageID = `${Date.now()}`
    this.updateChatBubble(messageID, playerID, message)
  }
}