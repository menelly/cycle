const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// Process management
let flaskProcess = null
let vllmProcess = null
let nextjsProcess = null
let nextjsPort = 3000 // Default port, will be updated when detected
let nextjsReady = false // Track when Next.js is actually ready

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
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/icon-512.png'),
    titleBarStyle: 'default',
    show: false // Don't show until ready
  })

  // Load the app with retry logic for dev mode
  if (isDev) {
    // Development: Start loading attempts after a reasonable delay
    setTimeout(() => {
      loadDevServerWithRetry()
    }, 8000) // 8 seconds should be enough for Next.js to start
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

function loadDevServerWithRetry(retryCount = 0) {
  const maxRetries = 15 // Increased for Next.js startup time
  const retryDelay = 3000 // 3 seconds

  mainWindow.loadURL(`http://localhost:${nextjsPort}`).catch((error) => {
    console.log(`[ELECTRON] Failed to load dev server (attempt ${retryCount + 1}/${maxRetries}):`, error.message)

    if (retryCount < maxRetries) {
      console.log(`[ELECTRON] Retrying in ${retryDelay/1000} seconds...`)
      setTimeout(() => {
        loadDevServerWithRetry(retryCount + 1)
      }, retryDelay)
    } else {
      console.log('[ELECTRON] Max retries reached. Please make sure Next.js dev server is running.')
      // Show an error dialog or fallback
      const { dialog } = require('electron')
      dialog.showErrorBox(
        'Connection Error',
        'Could not connect to the development server. Please make sure "npm run dev" is running.'
      )
    }
  })
}

// Backend process management
function startBackendServices() {
  console.log('[BACKEND] Starting Chaos Command Center backend services...')

  // Start Next.js dev server in development mode
  if (isDev) {
    startNextjsServer()
  }

  // Start Flask backend (AI will be initialized separately if user chooses)
  startFlaskBackend()

  console.log('[BACKEND] Backend services started - AI will load on demand')
}

function startNextjsServer() {
  if (nextjsProcess) {
    console.log('[NEXTJS] Server already running')
    return
  }

  try {
    console.log('[NEXTJS] Starting Next.js dev server...')

    // Use cmd on Windows to handle npm properly
    const isWindows = process.platform === 'win32'
    const command = isWindows ? 'cmd' : 'npm'
    const args = isWindows ? ['/c', 'npm', 'run', 'dev'] : ['run', 'dev']

    nextjsProcess = spawn(command, args, {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env },
      stdio: 'pipe'
    })

    nextjsProcess.stdout.on('data', (data) => {
      const output = data.toString()

      // Detect port from Next.js output
      const portMatch = output.match(/Local:\s+http:\/\/localhost:(\d+)/)
      if (portMatch) {
        nextjsPort = parseInt(portMatch[1])
        console.log(`[NEXTJS] Detected port: ${nextjsPort}`)
      }

      if (output.includes('Local:') || output.includes('Ready')) {
        console.log('[NEXTJS] Dev server ready')
        nextjsReady = true
      }
    })

    nextjsProcess.stderr.on('data', (data) => {
      console.log('[NEXTJS] Error:', data.toString())
    })

    nextjsProcess.on('close', (code) => {
      console.log(`[NEXTJS] Process exited with code ${code}`)
      nextjsProcess = null
    })

    nextjsProcess.on('error', (error) => {
      console.error('[NEXTJS] Failed to start:', error)
      nextjsProcess = null
    })

  } catch (error) {
    console.error('[NEXTJS] Error starting Next.js server:', error)
  }
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

// vLLM server management
function startVLLMServer(modelPath) {
  if (vllmProcess) {
    console.log('[vLLM] Server already running')
    return
  }

  try {
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'
    const modelName = modelPath || 'unsloth/llava-v1.6-mistral-7b-hf-bnb-4bit'

    console.log(`[vLLM] Starting vLLM server with model: ${modelName}`)
    console.log('[vLLM] This may take a few minutes to download/load the model')

    // Use the main Python environment (where vLLM is actually installed)
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3'

    vllmProcess = spawn(pythonCmd, ['-m', 'vllm.entrypoints.openai.api_server', '--model', modelName, '--port', '8000'], {
      cwd: path.join(__dirname, '..', 'backend'),
      env: { ...process.env }
    })

    vllmProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log(`[vLLM] ${output}`)

      // Notify frontend when server is ready
      if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
        console.log('[vLLM] Server is ready!')
        if (mainWindow) {
          mainWindow.webContents.send('vllm-ready')
        }
      }
    })

    vllmProcess.stderr.on('data', (data) => {
      const output = data.toString()
      console.log(`[vLLM] ${output}`)

      // Also check stderr for ready messages (vLLM logs there sometimes)
      if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
        console.log('[vLLM] Server is ready!')
        if (mainWindow) {
          mainWindow.webContents.send('vllm-ready')
        }
      }
    })

    vllmProcess.on('close', (code) => {
      console.log(`[vLLM] Process exited with code ${code}`)
      vllmProcess = null
      if (mainWindow) {
        mainWindow.webContents.send('vllm-stopped')
      }
    })

    console.log('[vLLM] Server starting...')
  } catch (error) {
    console.log('[ERROR] Failed to start vLLM server:', error.message)
  }
}

function stopVLLMServer() {
  if (vllmProcess) {
    console.log('[vLLM] Stopping server...')
    vllmProcess.kill()
    vllmProcess = null
    console.log('[vLLM] Server stopped')
  }
}

function stopBackendServices() {
  console.log('[BACKEND] Stopping backend services...')

  if (nextjsProcess) {
    nextjsProcess.kill()
    nextjsProcess = null
    console.log('[NEXTJS] Dev server stopped')
  }

  if (flaskProcess) {
    flaskProcess.kill()
    flaskProcess = null
    console.log('[BACKEND] Flask backend stopped')
  }

  stopVLLMServer()
}

// IPC handlers for vLLM management
ipcMain.handle('start-vllm', async (event, modelPath) => {
  try {
    startVLLMServer(modelPath)
    return { success: true, message: 'vLLM server starting...' }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('stop-vllm', async () => {
  try {
    stopVLLMServer()
    return { success: true, message: 'vLLM server stopped' }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('vllm-status', async () => {
  return {
    running: vllmProcess !== null,
    pid: vllmProcess ? vllmProcess.pid : null
  }
})

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
