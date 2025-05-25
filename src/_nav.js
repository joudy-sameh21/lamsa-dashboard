import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
  
    },
  },
  {
    component: CNavTitle,
    name: 'Pages',
  },
  {
  component: 'CNavItem',
  name: 'Housekeepers',
  to: '/housekeepers',
},
{
  component: 'CNavItem',
  name: 'Bookings',
  to: '/bookings',
},
{
  component: 'CNavItem',
  name: 'Users',
  to: '/users',
},,
{
  component: 'CNavItem',
  name: 'Payments',
  to: '/payments',
},
{
  component: 'CNavItem',
  name: 'Subscriptions',
  to: '/subscriptions',
},
  
]

export default _nav
