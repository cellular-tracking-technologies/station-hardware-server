# CTT Sensor Station Hardware Access HTTP Server
Set up with [babel](https://babeljs.io/docs/en/babel-cli) transpile for [ECMA Script](https://www.ecma-international.org/publications/standards/Ecma-262.htm) functionality.

## Install Dependencies
`npm install`

## Auto babel transpile files on save
`npm run compile`

Let this service run in the background.  Each time a source file is saved, it is transpiled.

## Debug

#### VS Code 
Integrated debugging.  Just run the debugger from the project. `F5`
#### Chrome Dev Tools
Establish an SSH tunnel from your local machine to the target machine:
[SSH Tunnel](https://nodejs.org/en/docs/guides/debugging-getting-started/#enabling-remote-debugging-scenarios)

`ssh -L 9221:localhost:9229 pi@192.168.X.XX`

Open [Chrome Dev Tool Device Inspector](chrome://inspect/#devices)
`chrome://inspect/#devices`

