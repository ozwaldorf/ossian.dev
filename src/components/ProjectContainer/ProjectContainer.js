import uniqid from 'uniqid'
import GitHubIcon from '@material-ui/icons/GitHub'
import LaunchIcon from '@material-ui/icons/Launch'
import './ProjectContainer.css'

const ProjectContainer = ({ project }) => (
  <div className='project'>
    <h3 className='project__title'>{project.name}</h3>

    <p className='project__description'>{project.description}</p>
    {project.stack && (
      <ul className='project__stack'>
        {project.stack.map((item) => (
          <li key={uniqid()} className='project__stack-item'>
            {item}
          </li>
        ))}
      </ul>
    )}

    {project.sourceCode && (
      <a href={project.sourceCode} className='link link--nav'>
        Github
      </a>
    )}
    {'              '}

    {project.livePreview && (
      <a href={project.livePreview} className='link link--nav'>
        Demo
      </a>
    )}
  </div>
)

export default ProjectContainer
