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
