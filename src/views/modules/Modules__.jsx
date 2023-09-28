// Chakra imports
import {
    Box,
    Button,
    Flex,

    Image,

    Text,
    useColorMode,
    useToast,
    Heading,
    Stack,
    SimpleGrid,
    Progress,
    useColorModeValue,
    ButtonGroup,
    Card, CardBody, CardFooter, InputGroup, InputLeftElement, Input, Spacer

} from "@chakra-ui/react";
import Progres from './Progres'

import axiosClient from "../../axios-client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStateContext } from "../../context/ContextProvider";



import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IoDocumentsSharp } from "react-icons/io5";
import DemandeAcces from "./DemandeAcces";
import { ImCancelCircle } from "react-icons/im";
import { SearchIcon, StarIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";
import bookData from '../../assets/lot/book.json'
import animationData from '../../assets/lot/learning.json'
import edata from '../../assets/lot/loadash.json'

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
    animationData: edata,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


function Modules_() {
    const [searchQuery, setSearchQuery] = useState('');
    const [listChapitres, setListChapitres] = useState([])
    const [listModule, setListModule] = useState([])
    const [listProgres, setListProgres] = useState([])
    const [listAcces, setListAcces] = useState([])
    const [listCertificats, setListCertificats] = useState([])
    const [listResultat, setListResultat] = useState([])

    const [idA, setIdA] = useState(1)

    const toast = useToast()
    const [filterprog, setFP] = useState([])
    const [listFormation, setListFormation] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state


    const [loading, setLoading] = useState(false);

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

    // useEffect(() => {
    //     let timer = null;
    //     if (!loading) {
    //         timer = setTimeout(() => {
    //             fetchData();
    //         }, 300); // Delay API call by 500ms
    //     }
    //     return () => clearTimeout(timer);
    // }, [fetchData, loading]);

    const { user, setUser } = useStateContext();
    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)

            })
    }, [])


    const us = sessionStorage.getItem('userid');
    const currentuser = parseInt(us); // Convert to integer

    console.log("user", currentuser);


    useEffect(() => {
        axiosClient.get('chapitre/')
            .then((res) => setListChapitres(res.data))
    }, [])

    useEffect(() => {

        if (user.id !== undefined) {
            axiosClient.get('progres/')
                .then((res) => {


                    setListProgres(res.data.filter(e => e.apprenant === user.id))
                    // console.log(res.data.filter(e => e.apprenant === user.id))
                    // console.log("res data", res.data)
                })



        }


    }, [user])

    useEffect(() => {
        axiosClient.get('acces/')
            .then((res) => {
                setListAcces(res.data)
                setListAcces(res.data.filter(e => e.apprenant === currentuser))


            }



            )
    }, [])

    // useEffect(() => {
    //     axiosClient.get('progres/')
    //         .then((res) => set(res.data.filter(e => e.apprenant === user.id)))
    // }, [])



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

    useEffect(() => {
        axiosClient.get('module/')
            .then((res) => {
                setListModule(res.data.filter(e => e.etat === true))
                setIsLoading(false)
            })

            .catch((error) => {
                setIsLoading(false); // Set isLoading to false even if there's an error
            });
    }, [])
    useEffect(() => {
        axiosClient.get('formation/')
            .then((res) => {
                setListFormation(res.data)
            })
    }, [])



    useEffect(() => {
        axiosClient.get('certificat/')
            .then((res) => setListCertificats(res.data))
    }, [])
    useEffect(() => {
        axiosClient.get('resultat/')
            .then((res) => setListResultat(res.data))
    }, [])





    const [setAvatarUrl] = useState('');

    const [apprenant, setApprenant] = useState('');

    useEffect(() => {
        axiosClient.get(`/apprenants/${user.id}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        axiosClient.get(`/apprenants/${currentuser}/`)
            .then(({ data }) => {
                setApprenant(data)
            })
    }, [])

    const [moduleApprenant, setmoduleApprenant] = useState([])

    useEffect(() => {
        axiosClient.get(`acces/getModuleById/?idApprenant=${currentuser}`)
            .then(({ data }) => {
                setmoduleApprenant(data)
            })
    }, [])







    function truncateDescription(description) {
        const words = description.split(' ');
        const truncatedWords = words.slice(0, 30);
        return truncatedWords.join(' ') + (words.length > 15 ? '...' : '');
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

    const annulerDamandeAcces = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.delete(`acces/${id}/`)
            .then((res) => {


            })
            .catch((error) => {

            })
    }

    const navigate = useNavigate()

    const annulerReactivation = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.patch(`acces/${id}/`, {
            etat: false,
            encours: false,
            refus: true
        })
            .then((res) => {

            })
            .catch((error) => {
            })
    }


    const reactiver = (idA, idM) => {
        let id
        listAcces.map((val, key) => {
            if (val.apprenant === idA && val.module === idM) {
                return id = val.id
            }
        })
        axiosClient.patch(`acces/${id}/`, {
            encours: true,
        })
            .then((res) => {

            })
            .catch((error) => {
            })
    }





    const [listRatingwithIds, setListRatingwithIds] = useState([]);


    const getIDM = () => {
        {

            let id = 0
            listFormation.map((vf, kf) => {
                listModule.map((v, k) => {
                    moduleApprenant.map((val, key) => {
                        if (vf.id === v.formation) {
                            if (v.id === val.module) {

                                id = v.id
                            }
                        }
                    })
                })
            })
            return id;
        }
    }

    useEffect(() => {
        axiosClient
            .get(
                `/rating/getRatingsByIds/?idModule=${getIDM()}&idApprenant=${user.id}`
            )
            .then((res) => setListRatingwithIds(res.data));

    }, []);




    const filteredModules = listModule.filter((val) => {

        const ChapitresOfModules = listChapitres.filter((chapitre) => chapitre.module === val.id);

        return ChapitresOfModules.length > 0 && val.titre.toLowerCase().includes(searchQuery.toLowerCase());
    });


    const inputBg = useColorModeValue("white", "gray.700");
    function truncateDescription(description) {
        const words = description.split(' ');
        const truncatedWords = words.slice(0, 30);
        return truncatedWords.join(' ') + (words.length > 15 ? '...' : '');
    }

    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={2} mt={2} fontWeight={"bold"} fontSize={"28px"} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    // const isExistModule = listAcces.length > 0 && filteredModules.length > 0 ? (



    //     <Box height={"600px"} overflowY="auto" css={{
    //         "&::-webkit-scrollbar": {
    //             width: "9px",
    //             height: "6px",

    //         },
    //         "&::-webkit-scrollbar-thumb": {
    //             background: "#089bd7",
    //             borderRadius: "6px",

    //         },
    //         "&::-webkit-scrollbar-track": {
    //             background: "gray.50",
    //         },
    //     }} >

    //         <SimpleGrid mt={5} spacing={4} columns={{ base: 1, md: 2, lg: 3 }} >
    //             {listFormation.map((vf, kf) => {
    //                 return filteredModules.filter(val => (getAccesbyApprenant(apprenant.id, val.id) === "commencer" || getAccesbyApprenant(apprenant.id, val.id) === "reactiver" || getAccesbyApprenant(apprenant.id, val.id) === "en cours d'activation")).map((v, k) => {
    //                     {
    //                         return moduleApprenant.map((val, key) => {

    //                             if (vf.id === v.formation) {
    //                                 if (v.id === val.module) {


    //                                     return (

    //                                         <Card mx={5} >
    //                                             <CardBody >
    //                                                 <Image

    //                                                     src={v.image}
    //                                                     height="180px"
    //                                                     width="100%"
    //                                                     alt='Green double couch with wooden legs'
    //                                                     borderRadius='lg'
    //                                                 />

    //                                                 <Stack mt='3' spacing='3'>
    //                                                     {
    //                                                         getProgresbyApprenant(apprenant.id, v.id) === "error"
    //                                                             ? <Progres />
    //                                                             : getAccesbyApprenant(apprenant.id, v.id) === "reactiver" || getAccesbyApprenant(apprenant.id, v.id) === "en cours d'activation"
    //                                                                 ? <Progres color={'red'} value={getProgresbyApprenant(apprenant.id, v.id)} a={getAccesbyApprenant(apprenant.id, v.id)} />
    //                                                                 : getAccesbyApprenant(apprenant.id, v.id) === "commencer"
    //                                                                     ? <Progres color={'green'} value={getProgresbyApprenant(apprenant.id, v.id)} />
    //                                                                     : null
    //                                                     }
    //                                                     <Heading size='md'>{v.titre}</Heading>
    //                                                     <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDescription(v.description)}</Text>
    //                                                 </Stack>
    //                                             </CardBody>
    //                                             <CardFooter style={{ justifyContent: "end" }} >
    //                                                 <ButtonGroup spacing='1' >
    //                                                     {getAccesbyApprenant(apprenant.id, v.id) === "error"
    //                                                         ? <DemandeAcces idApprenant={apprenant.id} idModule={v.id} />
    //                                                         : getAccesbyApprenant(idA, v.id) === "en cours" || getAccesbyApprenant(apprenant.id, v.id) === "en cours d'activation"
    //                                                             ? <Stack direction='row' spacing={4} align='center'>
    //                                                                 {getAccesbyApprenant(apprenant.id, v.id) === "en cours"
    //                                                                     ? <Button style={{ fontSize: "22px", color: "red" }} onClick={() => annulerDamandeAcces(apprenant.id, v.id)}><ImCancelCircle /></Button>
    //                                                                     : <Button style={{ fontSize: "22px", color: "red" }} onClick={() => annulerReactivation(apprenant.id, v.id)}><ImCancelCircle /></Button>}

    //                                                                 <Button
    //                                                                     isLoading
    //                                                                     loadingText='Traitement en cours'
    //                                                                     colorScheme='teal'
    //                                                                     variant='outline'
    //                                                                     spinnerPlacement='start'
    //                                                                 >
    //                                                                 </Button>
    //                                                             </Stack>
    //                                                             : getAccesbyApprenant(apprenant.id, v.id) === "reactiver"
    //                                                                 ? <Button colorScheme='red' onClick={() => reactiver(apprenant.id, v.id)}>Reactiver</Button>
    //                                                                 : getAccesbyApprenant(apprenant.id, v.id) === "commencer"
    //                                                                     ? <Button onClick={() => openModContent(v.id, v.titre, vf.titre, v.description, v.formation, getProgresbyApprenant(apprenant.id, v.id))} colorScheme='green'>Commencer</Button>
    //                                                                     : null

    //                                                     }
    //                                                 </ButtonGroup>


    //                                             </CardFooter>
    //                                         </Card>
    //                                     )

    //                                 }
    //                             }

    //                         })

    //                     }


    //                 })
    //             })
    //             }


    //         </SimpleGrid>

    //     </Box>


    // ) : (

    //     <>
    //         <Box >
    //             <Flex mt={6}>
    //                 <Box display="flex" justifyContent="flex-start">


    //                 </Box>
    //                 <Spacer flex="1" />
    //             </Flex>
    //             <Lottie height={400} width={550} options={defaultOptions} />
    //             <Text fontSize={"2xl"} color={"#1A365D"} fontFamily={"mono"} textAlign="center" alignItems="center" justifyContent="center">Aucun module n'a été trouvé</Text>
    //         </Box>
    //     </>


    // );













    const noModulesFound = searchQuery.trim() !== "" && filteredModules.length === 0



    return (
        <>
            <Box>

                <Box display="flex" justifyContent="space-between">
                    <Box display="flex" justifyContent="flex-start">

                        <Flex alignItems="center">
                            <Lottie height={80} width={80} options={defaultOpt} />
                            <GradientText gradient="#ffd140, #089bd7">
                                Mon apprentissage</GradientText>                    </Flex>
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
                                {listFormation.map((vf, kf) => {

                                    return filteredModules.filter(val => (getAccesbyApprenant(apprenant.id, val.id) === "commencer" || getAccesbyApprenant(apprenant.id, val.id) === "reactiver" || getAccesbyApprenant(apprenant.id, val.id) === "en cours d'activation")).map((v, k) => {
                                        {
                                            return moduleApprenant.map((val, key) => {

                                                if (vf.id === v.formation) {
                                                    if (v.id === val.module) {

                                                        console.log("etttttttatatat", v);

                                                        return (

                                                            <Card mx={5} >
                                                                <CardBody >
                                                                    <Image

                                                                        src={v.image}
                                                                        height="180px"
                                                                        width="100%"
                                                                        alt='Green double couch with wooden legs'
                                                                        borderRadius='lg'
                                                                    />

                                                                    <Stack mt='3' spacing='3'>
                                                                        {
                                                                            getProgresbyApprenant(apprenant.id, v.id) === "error"
                                                                                ? <Progres />
                                                                                : getAccesbyApprenant(apprenant.id, v.id) === "reactiver" || getAccesbyApprenant(apprenant.id, v.id) === "en cours d'activation"
                                                                                    ? <Progres color={'red'} value={getProgresbyApprenant(apprenant.id, v.id)} a={getAccesbyApprenant(apprenant.id, v.id)} />
                                                                                    : getAccesbyApprenant(apprenant.id, v.id) === "commencer"
                                                                                        ? <Progres color={'green'} value={getProgresbyApprenant(apprenant.id, v.id)} />
                                                                                        : null
                                                                        }
                                                                        <Heading size='md'>{v.titre}</Heading>
                                                                        <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDescription(v.description)}</Text>
                                                                    </Stack>
                                                                </CardBody>
                                                                <CardFooter style={{ justifyContent: "end" }} >
                                                                    <ButtonGroup spacing='1' >
                                                                        {getAccesbyApprenant(apprenant.id, v.id) === "error"
                                                                            ? <DemandeAcces idApprenant={apprenant.id} idModule={v.id} />
                                                                            : getAccesbyApprenant(idA, v.id) === "en cours" || getAccesbyApprenant(apprenant.id, v.id) === "en cours d'activation"
                                                                                ? <Stack direction='row' spacing={4} align='center'>
                                                                                    {getAccesbyApprenant(apprenant.id, v.id) === "en cours"
                                                                                        ? <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerDamandeAcces(apprenant.id, v.id); window.location.reload() }}><ImCancelCircle /></Button>
                                                                                        : <Button style={{ fontSize: "22px", color: "red" }} onClick={() => { annulerReactivation(apprenant.id, v.id); window.location.reload() }}><ImCancelCircle /></Button>}

                                                                                    <Button
                                                                                        isLoading
                                                                                        loadingText='Traitement en cours'
                                                                                        colorScheme='teal'
                                                                                        variant='outline'
                                                                                        spinnerPlacement='start'
                                                                                    >
                                                                                    </Button>
                                                                                </Stack>
                                                                                : getAccesbyApprenant(apprenant.id, v.id) === "reactiver"
                                                                                    ? <Button colorScheme='red' onClick={() => { reactiver(apprenant.id, v.id); window.location.reload() }}>Reactiver</Button>
                                                                                    : getAccesbyApprenant(apprenant.id, v.id) === "commencer"
                                                                                        ? <Button onClick={() => openModContent(v.id, v.titre, vf.titre, v.description, v.formation, getProgresbyApprenant(apprenant.id, v.id))} colorScheme='green'>Commencer</Button>
                                                                                        : null

                                                                        }
                                                                    </ButtonGroup>


                                                                </CardFooter>
                                                            </Card>
                                                        )

                                                    }
                                                }

                                            })

                                        }


                                    })
                                })
                                }

                            </SimpleGrid>
                        </Box>
                    </>
                )}




            </Box>

        </>




    );

}
export default Modules_;