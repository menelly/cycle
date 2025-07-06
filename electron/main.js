const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Process management
let flaskProcess = null

// Keep a global reference of the window object
let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '../public/icon-512.png'),
    titleBarStyle: 'default',
    show: false // Don't show until ready
  })

  // Load the app
  if (isDev) {
    // Development: load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000')
    // Open DevTools in development
    mainWindow.webContents.openDevTools()
  } else {
    // Production: load from built files
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Focus on the window
    if (isDev) {
      mainWindow.focus()
    }
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// Backend process management
function startBackendServices() {
  console.log('[BACKEND] Starting Chaos Command Center backend services...')

  // Start Flask backend (includes built-in quantized Mistral AI)
  startFlaskBackend()

  console.log('[BACKEND] All services started - AI processing built into Flask backend')
}

function startFlaskBackend() {
  try {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
    const backendPath = path.join(__dirname, '..', 'backend', 'app.py')

    console.log('[BACKEND] Starting Flask backend...')
    flaskProcess = spawn(pythonCmd, [backendPath], {
      cwd: path.join(__dirname, '..', 'backend'),
      env: { ...process.env, FLASK_PORT: '5000', FLASK_DEBUG: 'False' }
    })

    flaskProcess.stdout.on('data', (data) => {
      console.log(`Flask: ${data}`)
    })

    flaskProcess.stderr.on('data', (data) => {
      console.log(`Flask Error: ${data}`)
    })

    flaskProcess.on('close', (code) => {
      console.log(`Flask process exited with code ${code}`)
      flaskProcess = null
    })

    console.log('[BACKEND] Flask backend started')
  } catch (error) {
    console.log('[ERROR] Failed to start Flask backend:', error.message)
  }
}

// Ollama removed - using built-in quantized Mistral instead

function stopBackendServices() {
  console.log('[BACKEND] Stopping backend services...')

  if (flaskProcess) {
    flaskProcess.kill()
    flaskProcess = null
    console.log('[BACKEND] Flask backend stopped')
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow()
  startBackendServices()

  // macOS: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  stopBackendServices()
  // macOS: Keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Clean shutdown
app.on('before-quit', () => {
  stopBackendServices()
})

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]

  // macOS menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })

    // Window menu
    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// Set up menu when app is ready
app.whenReady().then(() => {
  createMenu()
})
