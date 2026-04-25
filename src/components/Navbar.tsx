import { NavLink } from 'react-router-dom';

export function Navbar() {
  const baseStyle =
    'flex-1 py-1.5 text-center font-bold uppercase transition-all border-t-2 text-[10px] sm:text-xs tracking-wider';
  const activeStyle = 'bg-aztechs-grey text-white border-aztechs-orange';
  const inactiveStyle =
    'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400';

  return (
    <nav className="flex w-full sticky bottom-0 z-10 shadow-[0_-1px_5px_rgba(0,0,0,0.1)] backdrop-blur-sm">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Match
      </NavLink>
      <NavLink
        to="/pit"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Pit
      </NavLink>
      <NavLink
        to="/queue"
        className={({ isActive }) =>
          `${baseStyle} ${isActive ? activeStyle : inactiveStyle}`
        }
      >
        Queue
      </NavLink>
    </nav>
  );
}
