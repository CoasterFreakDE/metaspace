import {Planet} from "./foreground";

export interface Player {
  id: string,

  name: string,
  x: number,
  y: number,
  rotation: number,
  team: 1 | 2,

  // The player's mass is used to calculate the gravitational force between planets and players.
  mass: number,

  planets_nearby: Planet[],

  chatMessages: ChatMessage[],
}

export interface ChatMessage {
  time: number,
  message: string,
}

export class PlayerManagement {
  public players: Player[] = []

  /**
   * Updates the players array.
   * @param new_players
   * @param playerID
   * @param createEnemy
   */
  public updatePlayers(new_players: Player[], playerID: string, createEnemy: (id: string, name: string) => SVGSVGElement) {
    const old_players: Player[] = this.players
    this.players = new_players
    for (const old_player of old_players) {
      if (old_player.id === playerID) continue
      const new_player = new_players.find(player => player.id === old_player.id)
      if (!new_player) {
        const element = document.getElementById(old_player.id)
        if (element) {
          element.remove()
          const nametag = document.getElementById(`nametag-${old_player.id}`) as HTMLElement
          nametag.remove()
        }
      }
    }
    for (const new_player of new_players) {
      if (new_player.id === playerID) continue
      const old_player = old_players.find(player => player.id === new_player.id)
      if (!old_player) {
        createEnemy(new_player.id, new_player.name)
      }
      const element = document.getElementById(new_player.id)
      if (element) {
        element.style.left = `${new_player.x}px`
        element.style.top = `${new_player.y}px`
        element.style.transform = `rotate(${new_player.rotation}deg)`
      }
    }
  }

  public renderPlayersForeground(playerID: any) {
    // Update the position of the enemy cursors
    const enemies = this.players.filter((p) => p.id !== playerID)
    enemies.forEach((enemy) => {
      const enemyCursor = document.getElementById(enemy.id) as HTMLElement
      enemyCursor.style.left = `${enemy.x - 15}px`
      enemyCursor.style.top = `${enemy.y}px`
      enemyCursor.style.transform = `rotate(${enemy.rotation}deg)`

      // Update nametag position
      const nametag = document.getElementById(`nametag-${enemy.id}`) as HTMLElement
      nametag.style.left = `${enemy.x - 15}px`
      nametag.style.top = `${enemy.y - 30}px`
    });

    // Update positions of chat bubbles
    this.players.forEach((player) => {
      const chatBubble = document.getElementById(`chat-bubble-${player.id}`) as HTMLElement
      if(!chatBubble) return
      chatBubble.style.left = `${player.x - 15}px`
      chatBubble.style.top = `${player.y - 60}px`
    })
  }

}