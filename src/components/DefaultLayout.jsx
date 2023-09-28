import logo from "../assets/img/logo.png";
import {
  useNavigate,
  Outlet,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { FaUserEdit } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  Image,
  Center,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useColorMode,
  Button,
  Badge,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiMoon,
  FiSun,
  FiChevronDown,
  FiGitPullRequest,
} from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { BiMessageSquareDetail, BiSupport } from "react-icons/bi";

import { MdVideoLibrary } from "react-icons/md";
import { IoMdContacts } from "react-icons/io";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaBook, FaChevronCircleLeft, FaHome } from "react-icons/fa";
import { TbCertificate } from "react-icons/tb";

// add links to sidebar here
// use icons from 'react-icons/fi'
const LinkItems = [
  { name: "Accueil", icon: AiOutlineHome, path: "/" },
  { name: "Formations", icon: FiGitPullRequest, path: "/formation_" },
  { name: "Mes modules", icon: FaBook, path: "/MonApprentissage" },
  { name: "Mes diplômes", icon: TbCertificate, path: "/ListeCertificat" },
  { name: "Support", icon: BiSupport, path: "/tickets" },
  { name: "Guide d'utilisation", icon: MdVideoLibrary, path: "/tutoriel" },
  { name: "A propos", icon: BsFillInfoCircleFill, path: "/contact" },
];

export default function DefaultLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSiderBar, setIsSideBar] = useState("block");
  const [changedWidth, setChangedWidth] = useState("60");

  const handleCloseSideBar = () => {
    if (isSiderBar === "block") {
      setIsSideBar("none");
      setChangedWidth("full");
    } else {
      setIsSideBar("block");
      setChangedWidth("60");
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: isSiderBar }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav
        onOpen={onOpen}
        handleCloseSideBar={handleCloseSideBar}
        isSiderBar={isSiderBar}
      />
      <Box ml={{ base: 0, md: changedWidth }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
  return (
    <Box
      transition="3s ease"
      color="white"
      bg={useColorModeValue("#089bd7", "gray.900")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src={logo} width="250px" mt="10px"></Image>

        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} onClose={onClose}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, children, onClose, ...rest }) => {
  const [count, setCount] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const pathLink = LinkItems.find((e) => e.name === children);
  const { user, setUser } = useStateContext();

  const handleClick = () => {
    navigate(pathLink.path);
    onClose();
  };

  useEffect(() => {
    axiosClient.get("auth/user/").then(({ data }) => {
      setUser(data);
    });
  }, []);

  // useEffect(() => {
  //   axiosClient.get(`acces/getModuleById/?idApprenant=${user.id}`)
  //     .then(({ data }) => {
  //       setmoduleApprenant(data)
  //       const cmp = data.length;
  //       setCount(cmp);
  //     })
  // }, [user.id])

  return (
    <Box
      onClick={handleClick}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="5"
        m="2"
        mx="4"
        bg={pathLink.path === location.pathname ? "#ffd140" : ""}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "#ffd140",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="20"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children === "Mes modules" ? (
          <>
            <Box flex="1">{children}</Box>
            {/* {count > 0 && (
              <Badge rounded="full" bg="green.400" style={{ padding: "2px 7px 2px 6px" }} color="white" ml='2'>
                {count}
              </Badge>
            )} */}
          </>
        ) : (
          <Box flex="1">{children}</Box>
        )}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, handleCloseSideBar, isSiderBar, ...rest }) => {
  const { user, setToken, setUser, setRefresh } = useStateContext();
  const { colorMode, toggleColorMode } = useColorMode();
  //user picture
  const [avatarUrl, setAvatarUrl] = useState("");

  //stocking the user image
  useEffect(() => {
    axiosClient
      .get(`/apprenants/${user.id}/image`)
      .then((response) => {
        setAvatarUrl(response.request.responseURL);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.id]);

  useEffect(() => {
    axiosClient.get("auth/user/").then(({ data }) => {
      setUser(data);
    });
  }, []);
  const navigate = useNavigate();

  const onLogout = (ev) => {
    ev.preventDefault();
    setUser({});
    setToken(null);
    setRefresh(null);
    localStorage.removeItem("tokenExpirationTime");
  };

  const flexContent = (
    <>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      {isSiderBar === "block" ? (
        <Text
          mt={2}
          fontWeight={"bold"}
          color={"#ffd140"}
          fontSize={{ base: "1xl", sm: "1xl", md: "2xl", lg: "2xl" }}
        >
          Päiperléck E-Learning
        </Text>
      ) : (
        <Text
          color={"#ffd140"}
          ml={10}
          fontWeight={"bold"}
          fontSize={{ base: "1xl", sm: "1xl", md: "2xl", lg: "2xl" }}
        >
          Päiperléck E-Learning
        </Text>
      )}

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          onClick={toggleColorMode}
          size="lg"
          variant=""
          _hover={{
            bg: "#ffd140",
            color: "white",
          }}
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
        />
        <Flex alignItems={"center"} color="black">
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={avatarUrl} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm" color="white">
                    {user.first_name} {user.last_name}
                  </Text>
                  {/* <Text fontSize="xs" color="yellow.300">
                    Admin
                  </Text> */}
                </VStack>
                <Box display={{ base: "none", md: "flex" }} color="white">
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              zIndex={9999}
              borderColor="white"
              alignItems={"center"}
              bg={useColorModeValue("#089bd7", "gray.900")}
              color="white"
            >
              <br />
              <Center>
                <Avatar size={"2xl"} src={avatarUrl} />
              </Center>
              <br />
              
              <MenuItem
                icon={<FaUserEdit size={18} />}
                _hover={{ bg: "blue.800", color: "white" }}
                bg={useColorModeValue("#089bd7", "gray.900")}
                onClick={() => navigate("/profile")}
              >
                {" "}
                Profil
              </MenuItem>
              <MenuDivider />
              <MenuItem
                icon={<BiLogOut size={20} />}
                _hover={{ bg: "blue.800", color: "white" }}
                bg={useColorModeValue("#089bd7", "gray.900")}
                onClick={onLogout}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </>
  );
  const b = useColorModeValue("#089bd7", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  return (
    <Box>
      {isSiderBar === "block" ? (
        <Flex
          ml={{ base: 0, md: "full" }}
          px={{ base: 4, md: 4 }}
          height="20"
          alignItems="center"
          color="white"
          marginLeft={{ base: 0, md: 60, lg: 60 }}
          bg={b}
          borderBottomWidth="1px"
          borderBottomColor={border}
          justifyContent={{ base: "space-between", md: "space-between" }}
          {...rest}
        >
          {flexContent}
        </Flex>
      ) : (
        <Flex
          ml={{ base: 0, md: "full" }}
          px={{ base: 4, md: 4 }}
          height="20"
          alignItems="center"
          color="white"
          marginLeft={0}
          bg={b}
          borderBottomWidth="1px"
          borderBottomColor={border}
          justifyContent={{ base: "space-between", md: "space-between" }}
          {...rest}
        >
          {flexContent}
        </Flex>
      )}

      {isSiderBar === "block" ? (
        <IconButton
          icon={<FaChevronCircleLeft />}
          onClick={handleCloseSideBar}
          variant=""
          display={{ base: "none", md: "block" }}
          style={{
            position: "absolute",
            left: "220px",
            top: "25px",
            color: "#ECC94B",
            fontSize: "20px",
            fontWeight: "bolder",
          }}
        />
      ) : (
        <IconButton
          onClick={handleCloseSideBar}
          icon={<FiMenu />}
          variant="outline"
          aria-label="open menu"
          style={{
            position: "absolute",
            left: "10px",
            top: "20px",
            color: "white",
            fontSize: "20px",
            fontWeight: "bolder",
          }}
        />
      )}
    </Box>
  );
};
