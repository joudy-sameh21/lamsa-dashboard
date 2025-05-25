import React from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('admin-auth')
    localStorage.removeItem('admin-name')
    window.location.href = '/#/login'
  }

  return (
   <CDropdown variant="nav-item" style={{ display: 'flex', alignItems: 'center' }}>
  <CDropdownToggle
    placement="bottom-end"
    className="py-0 pe-0"
    caret={false}
    style={{ display: 'flex', alignItems: 'center', height: '40px' }} // adjust height as needed
  >
    <CIcon icon={cilAccountLogout} size="xl" style={{ cursor: 'pointer', verticalAlign: 'middle' }} />
  </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown