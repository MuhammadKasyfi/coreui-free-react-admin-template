import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
// import { AuthProvider } from './auth/AuthContext'
import store from './store'

// ReactDOM.render(
//   <AuthProvider>
//     <App />
//     </AuthProvider>,
//     document.getElementById('root'),
// )

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
// )

const root = createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <AuthProvider> */}
    <App />
    {/* </AuthProvider> */}
  </Provider>,
)
