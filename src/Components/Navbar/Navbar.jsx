import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/navbar";
import { Button } from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { TfiWorld } from "react-icons/tfi";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext/AuthContext";

export default function NavbarCompoenet() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setUserToken, userToken } = useContext(AuthContext)
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([
    "Home",
    "About",
    "Login",
    "Profile",
    "Posts",
    "SignUp"
  ])
  useEffect(() => {
    if (userToken) {
      setMenuItems([
        "Home",
        "About",
        "Profile",
        "Posts"
      ])
    } else {
      setMenuItems([
        "Home",
        "Login",
        "SignUp"
      ])
    }
  }, [userToken]) // هيتنفذ بس لما userToken يتغير


  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserToken('')
    navigate('/login')
  }
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gradient-to-b border-b-1 border-gray-200 bg-gray-200">
      <NavbarContent>
        <NavbarBrand>
          <p className="font-bold text-inherit flex justify-center items-center"><TfiWorld size={15} /><span className="p-1">Social App</span></p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <NavLink color="foreground" to="/">
            Home
          </NavLink>
        </NavbarItem>
        {
          userToken && <>
            <NavbarItem >
              <NavLink aria-current="page" to="/about">
                About
              </NavLink>
            </NavbarItem>
            <NavbarItem >
              <NavLink aria-current="page" to="/profile">
                Profile
              </NavLink>
            </NavbarItem>
            <NavbarItem >
              <NavLink aria-current="page" to="/posts">
                Posts
              </NavLink>
            </NavbarItem>
          </>
        }
      </NavbarContent>
      <NavbarContent justify="end">
        {userToken ?
          <NavbarItem >
            <Button className="!border-transparent hover:!border-red-400 hover:scale-105" as={NavLink} onPress={handleLogout} color="danger" variant="flat">
              Log Out
            </Button>
          </NavbarItem>
          :
          <>
            <NavbarItem className="hidden md:flex">
              <NavLink to="/login">Login</NavLink>
            </NavbarItem>
            <NavbarItem>
              <Button className="hover:border-b-2 hover:!border-blue-400 hover:scale-105" as={NavLink} color="primary" to="/register" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        }
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <NavLink
              className="w-full"
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              to={item === "login" ? "/login" : item === "SignUp" ? "/register" : `/${item.toLowerCase()}`}
              size="lg"
            >
              {item}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
