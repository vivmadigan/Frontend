import React from 'react'
import LogotypeLink from '../components/LogotypeLink'
import { NavLink } from 'react-router-dom'
import NavLinks from './NavLinks'


const Sidebar = () => {
  return (
    <section className="sidebar">
      <LogotypeLink />
      <NavLinks />
    </section>
  )
}

export default Sidebar