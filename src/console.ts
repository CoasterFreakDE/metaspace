
// command: The full command with arguments to show in the terminal.
// input: The current input
export function highlight(command: string, input: string): string {
   let highlighted = "";

    for(let i = 0; i < command.length; i++) {
        if (command[i] === '/') {
            highlighted += `<span class="command">/</span>`;
        }
        else if (input.length >= i && command[i] === input[i]) {
            highlighted += `<span class="input">${command[i]}</span>`;
        } else {
            highlighted += command[i];
        }
    }

    highlighted.match(/<\S+>/gm)?.forEach((match) => {
        if(match.includes('span')) return;
        highlighted = highlighted.replace(match, `<span class="argument">${match.replace('<', '').replace('>', '')}</span>`);
    });

    return highlighted;
}