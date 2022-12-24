import { useContext, useState } from 'react'
import { ThemeContext } from './contexts/theme'
// import Header from "./components/Header/Header";
// import Navbar from './components/Navbar/Navbar'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Skills from './components/Skills/Skills'
// import ScrollToTop from './components/ScrollToTop/ScrollToTop'
// import Contact from './components/Contact/Contact'
import Current from './components/Current/Current'
import Footer from './components/Footer/Footer'

import './App.css'

const App = () => {
  const [{ themeName }] = useContext(ThemeContext)
  const [state, setState] = useState(
    window.location.hash.replace('#', '') || 'skills'
  )

  return (
    <div id='top' className={`${themeName} app`}>
      <main>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <About />
        <br />

        <a
          href='#skills'
          onClick={() => setState('skills')}
          className={state === 'skills' ? 'link link--active' : 'link'}
        >
          Skills
        </a>

        {'       |       '}

        <a
          href='#experience'
          onClick={() => setState('experience')}
          className={state === 'experience' ? 'link link--active' : 'link'}
        >
          Experience
        </a>

        {'       |       '}

        <a
          href='#projects'
          onClick={() => setState('projects')}
          className={state === 'projects' ? 'link link--active' : 'link'}
        >
          Projects
        </a>

        {'       |       '}

        <a
          href='#current'
          onClick={() => setState('current')}
          className={state === 'current' ? 'link link--active' : 'link'}
        >
          Current
        </a>

        <br />

        {state === 'skills' && <Skills />}
        {state === 'experience' && <Experience />}
        {state === 'projects' && <Projects />}
        {state === 'current' && <Current />}

        <br />

        <Footer />
      </main>
    </div>
  )
}

export default App
