import css from './Header.module.css'
import Icon from '../Icon/Icon'
import { useAuth } from '../../auth/AuthContext';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

        const closeMenu = () => {
        setMenuOpen(false);
    }

        useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto"
    }, [menuOpen])

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
   if (e.target instanceof HTMLElement && e.target.classList.contains(css.overlay)) {
    setMenuOpen(false);
  }
  };

  const { user } = useAuth();

  const userName = user?.name ?? "";

    return (
        <div className={css.container}>
            <div className={css.window}>
            <Icon name="logo-mob" width={42} height={17}/>
            <div className={css.right}>
                <div className={css.circle}>
                    {userName.charAt(0).toUpperCase()}
                </div>
                <button className={css.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                    <Icon name="menu" width={28} height={28}/>
                </button>
            </div>
            {menuOpen && (
                <div className={css.overlay} onClick={handleOverlayClick}>
                    <nav className={css.menu}>
                        <button className={css.closeButton} onClick={closeMenu}>
                            <Icon name="close" width={28} height={28}/>
                        </button>
                        <NavLink to='/recommended' onClick={closeMenu}   className={({ isActive }) =>
    isActive ? `${css.link} ${css.active}` : css.link
  }>Home</NavLink>
                        <NavLink to='/library' onClick={closeMenu}   className={({ isActive }) =>
    isActive ? `${css.link} ${css.active}` : css.link
  }>My library</NavLink>
                    </nav>
                </div>
            )}
            </div>
        </div>
    )
}