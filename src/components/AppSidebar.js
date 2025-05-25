import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// Import your logo image (place it in src/assets/images/lamsa-logo.png)
import lamsaLogo from 'src/assets/brand/lamsalogo.png'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
<CSidebarHeader className="border-bottom">
  <CSidebarBrand
    to="/"
    style={{
      padding: '0.5rem',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '1rem', // Adds space between logo and text
      textDecoration: 'none',
    }}
  >
    <img
      src={lamsaLogo}
      alt="Lamsa"
      height={50}
      style={{
        objectFit: 'contain',
        borderRadius: 12,
        background: '#fff',
        boxShadow: '0 2px 8px rgba(255, 255, 255, 0.04)',
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <span
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          color: '#ffff',
          letterSpacing: 1,
          textDecoration: 'none'
        }}
      >
        Lamsa
      </span>
      <span
        style={{
          fontSize: 9,
          color: '#ffff',
          fontStyle: 'italic',
          maxWidth: 100,
          lineHeight: '1.2',
          textDecoration: 'none'
        }}
      >
        Effortless cleaning, one lamsa away!
      </span>
    </div>
  </CSidebarBrand>
  <CCloseButton
    className="d-lg-none"
    dark
    onClick={() => dispatch({ type: 'set', sidebarShow: false })}
  />
</CSidebarHeader>

      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)