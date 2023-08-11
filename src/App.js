import React from 'react'
import './App.css'

import useComic from './hooks/useComic'

function App() {
    const {
        currentComic: [currentComic],
    } = useComic()
    return <p>{currentComic}</p>
}

export default App
