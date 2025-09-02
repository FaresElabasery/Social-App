
import { Outlet } from 'react-router-dom';
import NavbarCompoenet from '../../Components/Navbar/Navbar';
export default function Layout({ handleDarkMode }) {
    return (
        <>
            <NavbarCompoenet handleDarkMode={handleDarkMode} />
            <Outlet />
        </>

    )
}
