import { useState } from 'react'

import Dashboard from './Dashboard'
import LandingPage from './LandingPage'

export default function App() {
  const [started, setStarted] = useState(false)

  return started ? <Dashboard /> : <LandingPage onStart={() => setStarted(true)} />
}
