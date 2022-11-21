import {PlayerManagement} from "./players";
import {highlight} from "./console";

/**
 * Each player has a chat bubble above their player.
 * This is the chat bubble.
 */
export class ChatAndConsole {

  private console_input = document.querySelector<HTMLInputElement>('#console') as HTMLInputElement
  private consolePreview = document.querySelector<HTMLDivElement>('#console-preview') as HTMLDivElement

  private createChatBubble(messageID: string, playerID: string, message: string) {
    const chatBubble = document.createElement('div')
    chatBubble.classList.add('chat-bubble')
    chatBubble.id = messageID
    chatBubble.innerText = message
    const player = this.playerManagement.players.find(player => player.id === playerID)
    if(player) {
      const element = document.getElementById(playerID)
      if(element) {
        element.appendChild(chatBubble)
      }
    }
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
    const messageID = `message-${Date.now()}`
    this.createChatBubble(messageID, playerID, message)
    setTimeout(() => {
      const element = document.getElementById(messageID)
      if(element) {
        element.remove()
      }
    }, 15000)
  }
}