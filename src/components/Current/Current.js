import { about } from '../../portfolio'
import './Current.css'

const Current = () => {
  const { name, role, description, resume, social } = about
  return (
    <div className='about center'>
      <p className='current__desc'>
        <br />
      </p>
    </div>
  )
}

export default Current
