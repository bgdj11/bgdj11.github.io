import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/pixelify-sans/latin-400.css'
import '@fontsource/silkscreen/latin-400.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import { App } from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/scenes.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
)
