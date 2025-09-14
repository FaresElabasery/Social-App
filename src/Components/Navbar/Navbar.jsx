import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from "@heroui/navbar";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Switch,
  useDisclosure,
  User,
} from "@heroui/react";
import { useContext, useEffect, useState } from 'react';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { TfiWorld } from "react-icons/tfi";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import ProfilePhotoModal from "../ProfilePhotoModal/ProfilePhotoModal";

export default function NavbarCompoenet({ handleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setUserToken, userToken, userInfo } = useContext(AuthContext)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenChangePassword, onOpen: onOpenChangePassword, onClose: onCloseChangePassword } = useDisclosure();
  // upload Profile Picture of user
  const [menuItems, setMenuItems] = useState([
    "Home",
    "Profile",
    "SignUp"
  ])
  useEffect(() => {
    if (userToken) {
      setMenuItems([
        "Home",
        "Profile",
      ])
    } else {
      setMenuItems([
        "SignUp"
      ])
    }
  }, [userToken])


  const handleLogout = () => {
    localStorage.removeItem('token')
    setUserToken('')
    navigate('/register')
  }
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gradient-to-b border-b-1 border-gray-200  ">
      <div className="container flex-center">
        <NavbarContent justify="start">
          <NavbarBrand>
            <p as={Link} to='/' className="font-bold text-inherit flex justify-center items-center"><TfiWorld size={15} /><span className="p-1">Social App</span></p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
          </NavbarItem>
          {
            userToken && <>
              <NavbarItem >
                <NavLink aria-current="page" to="/">
                  Home
                </NavLink>
              </NavbarItem>
              <NavbarItem >
                <NavLink aria-current="page" to="/profile">
                  Profile
                </NavLink>
              </NavbarItem>
            </>
          }
        </NavbarContent>
        <NavbarContent justify="end">
          <Switch
            defaultSelected
            color="warning"
            size="sm"
            thumbIcon={({ isSelected, className }) =>
              isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
            }
            onChange={handleDarkMode}
          >
          </Switch>
          {!userToken &&
            <>
              <NavbarItem>
                <Button className="hover:border-b-2 hover:!border-blue-400 hover:scale-105" as={NavLink} color="primary" to="/register" variant="flat">
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          }
          {userToken &&
            <span className="relative">
              <Avatar
                isBordered
                as={Link}
                to={'/profile'}
                classNames={{
                  img: "object-cover object-top",
                }}
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src={userInfo?.user?.photo}
              />
              <ProfilePhotoModal isOpen={isOpen} onClose={onClose} userInfo={userInfo} />
              <ChangePasswordModal isOpen={isOpenChangePassword} onClose={onCloseChangePassword} />
              <Dropdown placement="bottom-end" backdrop="opaque" >
                <DropdownTrigger>
                  <IoIosArrowDropdownCircle className="bg-white  hover:bg-whitetext-black hover: duration-250 rounded-full absolute top-[80%] right-[10%] translate-x-1/2" />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat" >
                  <DropdownSection showDivider>
                    <DropdownItem key="profile" className="h-14 gap-2 opacity-100" as={Link} to='/profile'>
                      <User
                        avatarProps={{
                          size: "sm",
                          src: userInfo?.user?.photo,
                          classNames: {
                            img: 'object-cover object-top'
                          }
                        }}
                        classNames={{
                          name: "text-default-600",
                          description: "text-default-500",
                        }}

                        description={userInfo?.user?.email}
                        name={userInfo?.user?.name}
                      />
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownItem key="Change-profile" onClick={onOpen}><label htmlFor="upload">Change Profile Picture</label></DropdownItem>
                  <DropdownItem key="Change-Password" onClick={onOpenChangePassword}>Change Password</DropdownItem>
                  <DropdownItem key="logout" className="bg-danger text-white" variant="flat" color="danger" onPress={handleLogout} >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </span>
          }
        </NavbarContent>
      </div>
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
              to={item === "Home" ? "/" : item === "login" ? "/register" : item === "SignUp" ? "/register" : `/${item.toLowerCase()}`}
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
export const MoonIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
        fill="currentColor"
      />
    </svg>
  );
};

export const SunIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <g fill="currentColor">
        <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
        <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
      </g>
    </svg>
  );
}; 