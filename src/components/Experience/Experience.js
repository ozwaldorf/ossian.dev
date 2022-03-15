import uniqid from 'uniqid'
import { experiences } from '../../portfolio'
import './Experience.css'

const Experience = () => {
  if (!experiences.length) return null

  return (
    <div className='history-tl-container'>
      <br />
      <br />

      <ul className='tl'>
        {experiences.map((experience) => (
          <li className='tl-item'>
            <div className='item-title'>
              {experience.duration} &gt;{'  '}
              <a href={experience.link} className='link link--nav'>
                {experience.name}
              </a>
            </div>

            <div className='item-detail'>
              <b>{experience.stack.join(' . ')}</b>
              <br />
              <b>{experience.title}</b>
              <br />
              <br />
              {experience.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Experience
