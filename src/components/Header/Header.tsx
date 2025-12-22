import css from "./Header.module.css";
import Icon from "../Icon/Icon";
import { useAuth } from "../../auth/AuthContext";
import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains(css.overlay)
    ) {
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/recommended", { replace: true });
  };

  const userName = user?.name ?? "";

  return (
    <div className={css.container}>
      <div className={css.window}>
        <NavLink to="/recommended" className={css.iconCont}>
          <Icon
            className={css.icon_mob}
            name="logo-mob"
            width={42}
            height={17}
          />
                  <Icon className={css.icon} name="logo" width={182} height={17} />
        </NavLink>

        <div>
          <nav className={css.navDesktop}>
            <NavLink
              to="/recommended"
              className={({ isActive }) =>
                isActive ? `${css.link} ${css.active}` : css.link
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                isActive ? `${css.link} ${css.active}` : css.link
              }
            >
              My library
            </NavLink>
          </nav>
        </div>

        <div className={css.right}>
            <div className={css.names}>
          <div className={css.circle}>
            <span>{userName.charAt(0).toUpperCase()}</span>
          </div>
          <span className={css.name}>{userName}</span>
          </div>
          <button
            className={css.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Icon name="menu" width={28} height={28} />
          </button>
          <button onClick={handleLogout} className={css.logoutButtonDesktop}>
            Log out
          </button>
        </div>

        {menuOpen && (
          <div className={css.overlay} onClick={handleOverlayClick}>
            <nav className={css.menu}>
              <button className={css.closeButton} onClick={closeMenu}>
                <Icon name="close" width={28} height={28} />
              </button>
              <NavLink
                to="/recommended"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? `${css.link} ${css.active}` : css.link
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/library"
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? `${css.link} ${css.active}` : css.link
                }
              >
                My library
              </NavLink>
              <button onClick={handleLogout} className={css.logoutButton}>
                Log out
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
