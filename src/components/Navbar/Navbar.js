import { useContext, useState } from 'react'
import Brightness2Icon from '@material-ui/icons/Brightness2'
import WbSunnyRoundedIcon from '@material-ui/icons/WbSunnyRounded'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { ThemeContext } from '../../contexts/theme'
import { projects, skills, contact } from '../../portfolio'
import './Navbar.css'

const Navbar = () => (
  <nav className='center nav'>
    <ul className='nav__list'>
      <li className='nav__list-item'>
        <a href='#skills' onClick={null} className='link link--nav'>
          Skills
        </a>
      </li>

      <li className='nav__list-item'>
        <a href='#experience' onClick={null} className='link link--nav'>
          Experience
        </a>
      </li>

      <li className='nav__list-item'>
        <a href='#projects' onClick={null} className='link link--nav'>
          Projects
        </a>
      </li>

      <li className='nav__list-item'>
        <a href='#current' onClick={null} className='link link--nav'>
          Current
        </a>
      </li>

      <li className='nav__list-item'>
        <a href='#contact' onClick={null} className='link link--nav'>
          Contact
        </a>
      </li>
    </ul>
  </nav>
)

export default Navbar
