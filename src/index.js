import React from 'react'
import ReactDOM from 'react-dom'
import './client/index.css'
import App from './client/components/App.js'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
