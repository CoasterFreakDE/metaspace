
interface Player {
  id: string,
  x: number,
  y: number,
  rotation: number,
  team: 1 | 2
}

interface State {
  x: number,
  y: number,
  rotation: number,
}

function createCursor(color: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("cursor");
  svg.setAttribute("width", "228");
  svg.setAttribute("height", "399");
  svg.setAttribute("viewBox", "0 0 228 399");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M105,0,210,381H0Z");
  path.setAttribute('transform', 'translate(9 9)')
  path.setAttribute("fill", color);
  svg.appendChild(path);
  return svg;
}

// function createAlly(id: string) {
//   const canvas = document.querySelector<HTMLDivElement>('.canvas')!
//   const ally = createCursor('var(--allies)')
//   ally.id = id
//   canvas.appendChild(ally)
//
//   return ally
// }

function createEnemy(id: string) {
  const canvas = document.querySelector<HTMLDivElement>('.canvas')!
  const enemy = createCursor('var(--enemies)')
  enemy.id = id
  canvas.appendChild(enemy)

  return enemy
}

export function setupClient(socket: WebSocket) {
  const canvas = document.querySelector<HTMLDivElement>('.canvas')!
  const cursor = createCursor('var(--self)')
  canvas.appendChild(cursor)

  let x = 500
  let y = 500
  let direction = 0
  let speed = 0
  let keys_down = new Set<string>()

  let last_state: State

  const setCursor = (x: number, y: number, rotation: number = 0) => {
      cursor.style.left = `${x}px`
      cursor.style.top = `${y}px`
      cursor.style.transform = `rotate(${rotation}deg)`
      if(!last_state || (last_state.x !== x || last_state.y !== y || last_state.rotation !== rotation)) {
        socket.send(JSON.stringify({event: 'move', player: {x, y, rotation}}))
        last_state = {x, y, rotation}
      }
  }

  socket.onopen = () => {
    setCursor(x, y, direction)
  }

  document.addEventListener('keydown', (event) => {
      event.preventDefault()
      const key = event.key.toLowerCase()
      const up = key === 'arrowup' || key === 'w'
      const down = key === 'arrowdown' || key === 's'
      const left = key === 'arrowleft' || key === 'a'
      const right = key === 'arrowright' || key === 'd'

        if(up) {
            if(!keys_down.has('up')) {
              keys_down.add('up')
            }
        }
        if(down) {
            if(!keys_down.has('down')) {
              keys_down.add('down')
            }
        }
        if(left) {
            if(!keys_down.has('left')) {
              keys_down.add('left')
            }
        }
        if(right) {
            if(!keys_down.has('right')) {
              keys_down.add('right')
            }
        }
        if(event.shiftKey) {
            if(!keys_down.has('shift')) {
              keys_down.add('shift')
            }
        }
  })

    document.addEventListener('keyup', (event) => {
        event.preventDefault()
        const key = event.key.toLowerCase()
        const up = key === 'arrowup' || key === 'w'
        const down = key === 'arrowdown' || key === 's'
        const left = key === 'arrowleft' || key === 'a'
        const right = key === 'arrowright' || key === 'd'

        if(up) {
            keys_down.delete('up')
        }
        if(down) {
            keys_down.delete('down')
        }
        if(left) {
            keys_down.delete('left')
        }
        if(right) {
            keys_down.delete('right')
        }

        if(!event.shiftKey) {
          keys_down.delete('shift')
        }
    })

    const move = () => {
      let changeDirection = true
      if(keys_down.size == 0 || (keys_down.size == 1 && keys_down.has('shift'))) {
          changeDirection = false
      }
      const max_speed = keys_down.has('shift') ? 10 : 5
      if(speed < max_speed) {
           speed += 1
       } else if(speed > max_speed) {
           speed -= 1
       }
      let direction_x = 0
      let direction_y = 0
      if(keys_down.has('up')) {
            y -= speed
            if (y < 0) {
                y = 0
            } else if(y > canvas.clientHeight) {
                y = canvas.clientHeight
            }
            direction_y += 1
        }
        if(keys_down.has('down')) {
            y += speed
            if (y < 0) {
              y = 0
            } else if(y > (canvas.clientHeight - cursor.clientHeight)) {
              y = (canvas.clientHeight - cursor.clientHeight)
            }
            direction_y -= 1
        }
        if(keys_down.has('left')) {
            x -= speed
            if (x < 0) {
                x = 0
            } else if(x > canvas.clientWidth) {
                x =  canvas.clientWidth
            }
            direction_x -= 1
        }
        if(keys_down.has('right')) {
            x += speed
            if (x < 0) {
              x = 0
            } else if(x > (canvas.clientWidth - cursor.clientWidth)) {
              x = (canvas.clientWidth - cursor.clientWidth)
            }
          direction_x += 1
        }

        if(changeDirection) {
            direction = 0
            if (direction_x === 1 && direction_y === 1) {
                direction = 45
            }
            if (direction_x === 1 && direction_y === -1) {
                direction = 135
            }
            if (direction_x === -1 && direction_y === 1) {
                direction = -45
            }
            if (direction_x === -1 && direction_y === -1) {
                direction = -135
            }
            if (direction_x === 1 && direction_y === 0) {
                direction = 90
            }
            if (direction_x === -1 && direction_y === 0) {
                direction = -90
            }
            if (direction_x === 0 && direction_y === 1) {
                direction = 0
            }
            if (direction_x === 0 && direction_y === -1) {
                direction = 180
            }
        }
        setCursor(x, y, direction)
    }

    setInterval(move, 1000/60)

  let players: Player[] = []

  socket.onmessage = (raw) => {
    const data = JSON.parse(raw.data)

    switch(data.event) {
      case 'players':
        const new_players = data.players as Player[]
        const old_players = players
        players = new_players
        for (const old_player of old_players) {
          if (old_player.id === data.playerID) continue
          const new_player = new_players.find(player => player.id === old_player.id)
          if (!new_player) {
            const element = document.getElementById(old_player.id)
            if (element) {
              element.remove()
            }
          }
        }
        for (const new_player of new_players) {
          if (new_player.id === data.playerID) continue
          const old_player = old_players.find(player => player.id === new_player.id)
          if (!old_player) {
            createEnemy(new_player.id)
          }
          const element = document.getElementById(new_player.id)
          if (element) {
            element.style.left = `${new_player.x}px`
            element.style.top = `${new_player.y}px`
            element.style.transform = `rotate(${new_player.rotation}deg)`
          }
        }
        break
      case 'move':
        const player = data as Player
        const existing = players.find((p) => p.id === player.id)
        if (existing) {
          existing.x = player.x
          existing.y = player.y
          existing.rotation = player.rotation
        }

        // Update the position of the enemy cursors
        const enemies = players.filter((p) => p.id !== data.playerID)
        enemies.forEach((enemy) => {
          const enemyCursor = document.getElementById(enemy.id) as HTMLElement
          enemyCursor.style.left = `${enemy.x}px`
          enemyCursor.style.top = `${enemy.y}px`
          enemyCursor.style.transform = `rotate(${enemy.rotation}deg)`
        });
    }
  };
}