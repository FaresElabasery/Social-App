
import { Outlet } from 'react-router-dom';
import NavbarCompoenet from '../../Components/Navbar/Navbar';
export default function Layout({ handleDarkMode }) {
    return (
        <div className='dark:bg-dark2 dark:text-white min-h-screen'>
            <NavbarCompoenet handleDarkMode={handleDarkMode} />
            <Outlet />
        </div>

    )
}
