import uniqid from 'uniqid'
import { skills } from '../../portfolio'
import './Skills.css'

const Skills = () => {
  if (!skills.length) return null

  return (
    <section className='section skills' id='skills'>
      <ul className='skills__list'>
        <li className='skills__list-item btn btn--plain'>[</li>
        {skills.map((skill) => (
          <li key={uniqid()} className='skills__list-item btn btn--plain'>
            {skill}
          </li>
        ))}
        <li className='skills__list-item btn btn--plain'>]</li>
      </ul>
      <br />
      <br />
      <br />
    </section>
  )
}

export default Skills
