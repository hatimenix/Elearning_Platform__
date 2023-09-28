import {
    Badge,
    Box,
    Button, ButtonGroup, Card, CardBody, CardFooter,
    Circle,
    Flex, Heading, Image,
    Input,
    InputGroup,
    InputLeftElement,
    Progress,
    Spacer,
    Stack, Text,
    useColorModeValue
} from '@chakra-ui/react'

import {
    SimpleGrid,
    useDisclosure
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { BsBookFill } from 'react-icons/bs'
import {
    FiHome,
} from 'react-icons/fi'
import { ImCancelCircle } from 'react-icons/im'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../../axios-client'
import DemandeAcces from './DemandeAcces'
import Progres from './Progres'

import bookData from '../../assets/lot/book.json'
import animationData from '../../assets/lot/learning.json'

import { SearchIcon } from '@chakra-ui/icons'
import Lottie from 'react-lottie'
import { useStateContext } from '../../context/ContextProvider'


const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const defaultOpt = {
    loop: true,
    autoplay: true,
    animationData: bookData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

function Modules() {

    const [searchQuery, setSearchQuery] = useState('');


    const [listModule, setListModule] = useState([])
    const [listAcces, setListAcces] = useState([])
    const [listApprenant, setListApprenant] = useState([])
    const [listProgres, setListProgres] = useState([])
    const [listChapitres, setListChapitres] = useState([])

    const [idApprenant, setIdApprenant] = useState('')
    const location = useLocation()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();



    const [loading, setLoading] = useState(false);

    const [isLoading, setIsLoading] = useState(true); // Add isLoading state



    // const fetchData = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         const progressRes = await axiosClient.get('progres/');
    //         const accessRes = await axiosClient.get('acces/');
    //         setListProgres(progressRes.data);
    //         setListAcces(accessRes.data);
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error);
    //         setLoading(false);
    //     }
    // }, []);



    useEffect(() => {
        axiosClient.get('progres/')
            .then((res) => setListProgres(res.data))
    }, [])


    useEffect(() => {
        axiosClient.get('chapitre/')
            .then((res) => setListChapitres(res.data))
    }, [])

    useEffect(() => {
        axiosClient.get('acces/')
            .then((res) => setListAcces(res.data))
    }, [])



    // useEffect(() => {
    //     let timer = null;
    //     if (!loading) {
    //         timer = setTimeout(() => {
    //             fetchData();
    //         }, 300); // Delay API call by 500ms
    //     }
    //     return () => clearTimeout(timer);
    // }, [fetchData, loading]);

    useEffect(() => {
        axiosClient.get(`module/?search=${location.state.id}`)
            .then((res) => {
                setListModule(res.data.filter(e => e.etat === true))
                setIsLoading(false); // Set isLoading to false when data is fetched

            })
            .catch((error) => {
                setIsLoading(false); // Set isLoading to false even if there's an error
            });
    }, [])



    useEffect(() => {
        axiosClient.get('apprenants/')
            .then((res) => setListApprenant(res.data))
    }, [])





    const getAccesbyApprenant = (idA, idM) => {
        let a = "error"
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                if ((val.etat === false && val.encours === true && val.refus === false)) {
                    a = "en cours"
                }
                if (val.etat === false && val.encours === false && val.refus === true) {
                    a = "reactiver"
                }
                if (val.etat === true && val.encours === false && val.refus === false) {
                    a = "commencer"
                }
                if ((val.etat === false && val.encours === true && val.refus === true)) {
                    a = "en cours d'activation"
                }
            }
        })
        return a
    }

    const getProgresbyApprenant = (idA, idM) => {
        let e = "error"
        let a
        listProgres.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {

                e = val.progres
                a = e.toFixed(0)
            }
        })

        return a
    }


    const reactiver = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.patch(`/acces/${id}/`, {
            encours: true,
        })
            .then((res) => {

            })
            .catch((error) => {
            })
    }

    const annulerDamandeAcces = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.delete(`/acces/${id}/`)
            .then((res) => {


            })
            .catch((error) => {
            })
    }

    const annulerReactivation = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.patch(`/acces/${id}/`, {
            etat: false,
            encours: false,
            refus: true
        })
            .then((res) => {

            })
            .catch((error) => {
            })
    }



    function openModContent(ids, titre, titreFormation, desc, formation, progress) {
        navigate('/chapitres', {
            state: {
                id: ids,
                titre: titre,
                titreF: titreFormation,
                description: desc,
                idf: formation,
                prog: progress
            }
        })
    }


    const { user, setUser } = useStateContext();

    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])
    const [idA, setIdA] = useState(null)

    useEffect(() => {
        if (user && user.id) {
            setIdA(user.id)
        }
    }, [user])



    const filteredModules = listModule.filter((val) => {

        const ChapitresOfModules = listChapitres.filter((chapitre) => chapitre.module === val.id);

        return ChapitresOfModules.length > 0 && val.titre.toLowerCase().includes(searchQuery.toLowerCase());


    });





    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={0.5} mt={2} fontWeight={"bold"} fontSize={"28px"} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    const inputBg = useColorModeValue("white", "gray.700");
    function truncateDescription(description) {
        const words = description.split(' ');
        const truncatedWords = words.slice(0, 30);
        return truncatedWords.join(' ') + (words.length > 15 ? '...' : '');
    }
    // const isExistModule = filteredModules.length > 0 ? (



    //     <>


    //         <Box height={"600px"} overflowY="auto" css={{
    //             "&::-webkit-scrollbar": {
    //                 width: "9px",
    //                 height: "6px",

    //             },
    //             "&::-webkit-scrollbar-thumb": {
    //                 background: "#089bd7",
    //                 borderRadius: "6px",

    //             },
    //             "&::-webkit-scrollbar-track": {
    //                 background: "gray.50",
    //             },
    //         }} >

    //             <SimpleGrid mt={8} columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, lg: 3 }} >


    //                 {filteredModules.map((val, key) => {
    //                     return (
    //                         <>
    //                             <Card mx={5} >
    //                                 <CardBody >
    //                                     <Image

    //                                         src={val.image}
    //                                         height="180px"
    //                                         width="100%"
    //                                         alt='Green double couch with wooden legs'
    //                                         borderRadius='lg'
    //                                     />
    //                                     {listAcces.map((acces, key) => {
    //                                         if (val.id === acces.module && getAccesbyApprenant(idA, val.id) === "commencer") {


    //                                             return (
    //                                                 <>
    //                                                     <Badge rounded="full" position="absolute"
    //                                                         top={6}
    //                                                         left={6} fontSize="0.8em" colorScheme="green">
    //                                                         En cours
    //                                                     </Badge>
    //                                                     <Circle
    //                                                         size="10px"
    //                                                         position="absolute"
    //                                                         top={6}
    //                                                         right={6}
    //                                                         bg="green.200"
    //                                                     />
    //                                                 </>

    //                                             )
    //                                         } else {

    //                                         }
    //                                     })
    //                                     }
    //                                     <Stack mt='3' spacing='3'>
    //                                         {
    //                                             getProgresbyApprenant(idA, val.id) === "error"
    //                                                 ? <Progress size='md' isIndeterminate />
    //                                                 : getAccesbyApprenant(idA, val.id) === "reactiver" || getAccesbyApprenant(idA, val.id) === "en cours d'activation"
    //                                                     ? <Progres color={'red'} value={getProgresbyApprenant(idA, val.id) > 100 ? 100 : getProgresbyApprenant(idA, val.id)} a={getAccesbyApprenant(idA, val.id)} />
    //                                                     : getAccesbyApprenant(idA, val.id) === "commencer"
    //                                                         ? <Progres color={'green'} value={getProgresbyApprenant(idA, val.id) > 100 ? 100 : getProgresbyApprenant(idA, val.id)} />
    //                                                         : null
    //                                         }
    //                                         <Heading size='md'>{val.titre}</Heading>
    //                                         <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDescription(val.description)}</Text>
    //                                     </Stack>
    //                                 </CardBody>
    //                                 <CardFooter style={{ justifyContent: "end" }} >
    //                                     <ButtonGroup spacing='1'>
    //                                         {getAccesbyApprenant(idA, val.id) === "error"
    //                                             ? <DemandeAcces idApprenant={idA} idModule={val.id} />
    //                                             : getAccesbyApprenant(idA, val.id) === "en cours" || getAccesbyApprenant(idA, val.id) === "en cours d'activation"
    //                                                 ? <Stack direction='row' spacing={4} align='center'>
    //                                                     {getAccesbyApprenant(idA, val.id) === "en cours"
    //                                                         ? <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerDamandeAcces(idA, val.id); window.location.reload() }}><ImCancelCircle /></Button>
    //                                                         : <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerReactivation(idA, val.id); window.location.reload() }}><ImCancelCircle /></Button>}

    //                                                     <Button
    //                                                         isLoading={false}
    //                                                         isDisabled
    //                                                         colorScheme="teal"
    //                                                         variant="outline"
    //                                                     >
    //                                                         Demande en attente
    //                                                     </Button>

    //                                                 </Stack>
    //                                                 : getAccesbyApprenant(idA, val.id) === "reactiver"
    //                                                     ? <Button colorScheme='red' onClick={() => { reactiver(idA, val.id); window.location.reload() }}>Reactiver</Button>
    //                                                     : getAccesbyApprenant(idA, val.id) === "commencer"

    //                                                         ? <Button onClick={() => openModContent(val.id, val.titre, location.state.titre, val.description, val.formation, getProgresbyApprenant(idA, val.id))} colorScheme='green'>Commencer</Button>
    //                                                         : null

    //                                         }
    //                                     </ButtonGroup>

    //                                 </CardFooter>
    //                             </Card>
    //                         </>
    //                     )
    //                 })}
    //             </SimpleGrid>
    //         </Box>
    //     </>



    // ) : (

    //     <>
    //         <Box >

    //             <Lottie height={400} width={550} options={defaultOptions} />
    //             <Text fontSize={"2xl"} color={"#1A365D"} fontFamily={"mono"} textAlign="center" alignItems="center" justifyContent="center">Aucun module n'a été trouvé</Text>
    //         </Box>
    //     </>


    // );


    const noModulesFound = searchQuery.trim() !== "" && filteredModules.length === 0;



    return (
        <Box>

            <Box display="flex" justifyContent="space-between">
                <Box display="flex" justifyContent="flex-start">

                    <Flex alignItems="center">
                        <Lottie height={80} width={80} options={defaultOpt} />
                        <GradientText gradient="#ffd140, #089bd7">
                            Formation {location.state.titre}</GradientText>                    </Flex>
                </Box>
                <Spacer flex="1" />
                <Box>
                    <InputGroup width="100%" size="md" borderRadius="md">
                        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
                        <Input
                            value={searchQuery}
                            bg={inputBg}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="Recherche Modules"
                            borderRadius="md"
                            py={3}
                            pl={10}
                            boxShadow="md"
                            _focus={{ outline: "none", boxShadow: "outline" }}
                        /></InputGroup>
                </Box>
            </Box>






            {isLoading ? (
                <Text></Text>
            ) : noModulesFound ? (
                // Show the message only when the search query is provided and no formations are found
                <>
                    <Lottie height={400} width={550} options={defaultOptions} />
                    <Text fontSize={"2xl"} color={"#1A365D"} fontFamily={"mono"} textAlign="center" alignItems="center" justifyContent="center">Aucune formation n'a été trouvée !</Text>
                </>
            ) : (
                // Show the filtered formations when available
                <>
                    <Box height={"600px"} overflowY="auto" css={{
                        "&::-webkit-scrollbar": {
                            width: "9px",
                            height: "6px",

                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#089bd7",
                            borderRadius: "6px",

                        },
                        "&::-webkit-scrollbar-track": {
                            background: "gray.50",
                        },
                    }} >
                        <SimpleGrid mt={37} columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, lg: 3 }}>
                            {filteredModules.map((val, key) => {
                                return (
                                    <>
                                        <Card mx={5} >
                                            <CardBody >
                                                <Image

                                                    src={val.image}
                                                    height="180px"
                                                    width="100%"
                                                    alt='Green double couch with wooden legs'
                                                    borderRadius='lg'
                                                />
                                                {listAcces.map((acces, key) => {
                                                    if (val.id === acces.module && getAccesbyApprenant(idA, val.id) === "commencer") {


                                                        return (
                                                            <>
                                                                <Badge rounded="full" position="absolute"
                                                                    top={6}
                                                                    left={6} fontSize="0.8em" colorScheme="green">
                                                                    En cours
                                                                </Badge>
                                                                <Circle
                                                                    size="10px"
                                                                    position="absolute"
                                                                    top={6}
                                                                    right={6}
                                                                    bg="green.200"
                                                                />
                                                            </>

                                                        )
                                                    } else {

                                                    }
                                                })
                                                }
                                                <Stack mt='3' spacing='3'>
                                                    {
                                                        getProgresbyApprenant(idA, val.id) === "error"
                                                            ? <Progress size='md' isIndeterminate />
                                                            : getAccesbyApprenant(idA, val.id) === "reactiver" || getAccesbyApprenant(idA, val.id) === "en cours d'activation"
                                                                ? <Progres color={'red'} value={getProgresbyApprenant(idA, val.id) > 100 ? 100 : getProgresbyApprenant(idA, val.id)} a={getAccesbyApprenant(idA, val.id)} />
                                                                : getAccesbyApprenant(idA, val.id) === "commencer"
                                                                    ? <Progres color={'green'} value={getProgresbyApprenant(idA, val.id) > 100 ? 100 : getProgresbyApprenant(idA, val.id)} />
                                                                    : null
                                                    }
                                                    <Heading size='md'>{val.titre}</Heading>
                                                    <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDescription(val.description)}</Text>
                                                </Stack>
                                            </CardBody>
                                            <CardFooter style={{ justifyContent: "end" }} >
                                                <ButtonGroup spacing='1'>
                                                    {getAccesbyApprenant(idA, val.id) === "error"
                                                        ? <DemandeAcces idApprenant={idA} idModule={val.id} />
                                                        : getAccesbyApprenant(idA, val.id) === "en cours" || getAccesbyApprenant(idA, val.id) === "en cours d'activation"
                                                            ? <Stack direction='row' spacing={4} align='center'>
                                                                {getAccesbyApprenant(idA, val.id) === "en cours"
                                                                    ? <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerDamandeAcces(idA, val.id); window.location.reload() }}><ImCancelCircle /></Button>
                                                                    : <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerReactivation(idA, val.id); window.location.reload() }}><ImCancelCircle /></Button>}

                                                                <Button
                                                                    isLoading={false}
                                                                    isDisabled
                                                                    colorScheme="teal"
                                                                    variant="outline"
                                                                >
                                                                    Demande en attente
                                                                </Button>

                                                            </Stack>
                                                            : getAccesbyApprenant(idA, val.id) === "reactiver"
                                                                ? <Button colorScheme='red' onClick={() => { reactiver(idA, val.id); window.location.reload() }}>Reactiver</Button>
                                                                : getAccesbyApprenant(idA, val.id) === "commencer"

                                                                    ? <Button onClick={() => openModContent(val.id, val.titre, location.state.titre, val.description, val.formation, getProgresbyApprenant(idA, val.id))} colorScheme='green'>Commencer</Button>
                                                                    : null

                                                    }
                                                </ButtonGroup>

                                            </CardFooter>
                                        </Card>
                                    </>
                                )
                            })}
                        </SimpleGrid>
                    </Box>
                </>
            )}




        </Box>
    )
}

export default Modules






