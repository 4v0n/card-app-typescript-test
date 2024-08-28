import {NavLink} from 'react-router-dom'

export default function NavBar(){
    return(
      <nav className="flex justify-center gap-5">
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/'}>All Entries</NavLink>
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={'/create'}>New Entry</NavLink>
        <button className="m-3 p-4 text-xl bg-gray-300 hover:bg-gray-400 rounded-md font-medium text-black">Toggle Dark Mode</button>
      </nav>
    )
}