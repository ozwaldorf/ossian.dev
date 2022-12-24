import { about } from '../../portfolio'
import './About.css'

const About = () => {
  const { name, role, description, resume, social, email } = about

  return (
    <div className='grid-container'>
      <div className='grid-child details'>
        {name && (
          <h1>
            <span className='about__name'>{name}</span>
          </h1>
        )}
        <br />
        <br />

        {role && <h2 className='about__role'>{role}</h2>}
        <p className='about__desc'>
          {about.description.map((desc) => (
            <p>{desc}</p>
          ))}
        </p>
      </div>

      <div className='grid-child links'>
        <br />
        <a href={resume} className='link link--nav'>
          Resume
        </a>
        <br />

        <a href={social.github} className='link link--nav'>
          Github
        </a>
        <br />

        <a href={social.linkedin} className='link link--nav'>
          LinkedIn
        </a>
        <br />

        <a href={social.email} className='link link--nav'>
          Email
        </a>
        <br />
      </div>
    </div>
  )
}

export default About
