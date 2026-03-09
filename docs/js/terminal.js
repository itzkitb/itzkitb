const historyContainer = document.getElementById('history');
const hiddenInput = document.getElementById('hidden-input');
const beforeCursor = document.getElementById('before-cursor');
const afterCursor = document.getElementById('after-cursor');
const cursor = document.getElementById('cursor');
const promptText = "sillydev@TupidLol:~$";

let cmdHistory = [];
let historyIndex = -1;

document.addEventListener('click', () => hiddenInput.focus());

function updateDisplay() {
    const val = hiddenInput.value;
    const start = hiddenInput.selectionStart;

    beforeCursor.textContent = val.substring(0, start);
            
    if (start < val.length) {
        cursor.textContent = val.substring(start, start + 1);
        afterCursor.textContent = val.substring(start + 1);
    } else {
        cursor.innerHTML = '&nbsp;';
        afterCursor.textContent = '';
    }
}

hiddenInput.addEventListener('input', updateDisplay);
        
hiddenInput.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        updateDisplay();
    }
});

hiddenInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
            if (historyIndex === -1) historyIndex = cmdHistory.length;
            if (historyIndex > 0) {
                historyIndex--;
                hiddenInput.value = cmdHistory[historyIndex];
                updateDisplay();
            }
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex !== -1) {
            if (historyIndex < cmdHistory.length - 1) {
                historyIndex++;
                hiddenInput.value = cmdHistory[historyIndex];
            } else {
                historyIndex = -1;
                hiddenInput.value = '';
            }
            updateDisplay();
        }
    }

    if (e.key === 'Enter') {
        const command = hiddenInput.value;
        const trimmedCmd = command.trim();
                
        if (trimmedCmd) {
            cmdHistory.push(command);
            historyIndex = -1;
        }

        const line = document.createElement('div');
        line.innerHTML = `<span style="color: #ff8f5c">${promptText}</span> ${command}`;
        historyContainer.appendChild(line);

        handleCommand(trimmedCmd);

        hiddenInput.value = '';
        updateDisplay();
        window.scrollTo(0, document.body.scrollHeight);
    }
});

function printToHistory(text, isError = false) {
    const entry = document.createElement('div');
    entry.className = 'command-output';
    if (isError) entry.classList.add('error');
    entry.textContent = text;
    historyContainer.appendChild(entry);
}

function handleCommand(cmd) {
    if (cmd === "") return;

    const args = cmd.split(/\s+/);
    const mainCmd = args[0].toLowerCase();
    const isHelp = args.includes('--help');

    switch(mainCmd) {
        case 'echo':
            if (isHelp) {
                printToHistory("Usage: echo [text]");
                printToHistory("Displays the text you typed back to the terminal.");
            } else {
                printToHistory(args.slice(1).join(' '));
            }
            break;
                
        case 'clear':
            if (isHelp) {
                printToHistory("Usage: clear");
                printToHistory("Clears the terminal screen of all previous output.");
            } else {
                historyContainer.innerHTML = '';
            }
            break;

        case 'help':
            if (isHelp) {
                printToHistory("Usage: help");
                printToHistory("Wait... you are asking for help about the help command?");
            } else {
                printToHistory("Tupid.lol Website Console, version 100-release (x86_64-pc-linux-gnu)");
                printToHistory("The commands shown below are defined within the shell.");
                printToHistory("To see help for the function \"name\", type \"name --help\".");
                printToHistory(" ");
                printToHistory("An asterisk (*) next to a command name indicates that the command is disabled.");
                printToHistory(" ");
                printToHistory(" echo [argument ...]");
                printToHistory(" clear");
                printToHistory(" help [sample ...]");
                printToHistory(" whoami [argument ...]");
                printToHistory(" ls [argument ...]");
                printToHistory(" title [argument ...]");
            }
            break;

        case 'whoami':
            if (isHelp) {
                printToHistory("Usage: whoami");
                printToHistory("Prints the current user identity.");
            } else {
                printToHistory("sillydev");
            }
            break;

        case 'ls':
            if (isHelp) {
                printToHistory("Usage: ls");
                printToHistory("Lists files in the current directory.");
            } else {
                printToHistory("js  huh.txt  index.html");
            }
            break;

        case 'title':
            if (isHelp) {
                printToHistory("Usage: title [text]");
                printToHistory("Changes the page title to the specified text.");
            } else {
                const newTitle = args.slice(1).join(' ');
                document.title = newTitle || 'Terminal';
                printToHistory(`Page title changed to: "${document.title}"`);
            }
            break;
                
        case 'te9ds0lo':
            printToHistory("SXQncyB3YXRjaGluZyBtZS4gSXQncyBuZWFyYnkuIFlvdSBrbm93IHdoZXJlIHRvIGZpbmQgdGhlIGNvZGUuIElmIHlvdSBmb3Jnb3QsIHRoZSBjb21iaW5hdGlvbiBpcyAwLTUtNi0yMi0xLTEzLTE1LTEwLTE1Lg==");
            break;
                
        default:
            printToHistory(`${mainCmd}: command not found`, true);
    }
}

updateDisplay();