import {
    Flex,

    Box,
    Image,
    useColorModeValue,

    Button,

    SimpleGrid,

    Text,
    CardFooter,
    CardBody,
    Card,
    Stack,
    Heading,
    Input,
    InputGroup,

    InputLeftElement,
    Spacer,
    filter,

} from '@chakra-ui/react';


import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

import Lottie from 'react-lottie';



import React, { ReactNode } from 'react';


import {

    useDisclosure,




} from '@chakra-ui/react';

import { SearchIcon } from '@chakra-ui/icons';




import animationData from '../../assets/lot/learning.json';
import userData from '../../assets/lot/login.json';
import { useStateContext } from '../../context/ContextProvider';




const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


const defaultOpt = {
    loop: false,
    autoplay: true,
    animationData: userData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


function Formation_() {

    const [searchQuery, setSearchQuery] = useState('');

    const [medias, setMedias] = useState([])


    const navigate = useNavigate();

    const [formation, setFormation] = useState([])
    const [listModuleOfFormation, setListModuleOfFormation] = useState([])

    const [listChapitre, setListChapitres] = useState([])
    const [listTests, setTests] = useState([])


    const [isLoading, setIsLoading] = useState(true); // Add isLoading state

    // ... (other useEffect hooks)

    useEffect(() => {
        axiosClient.get('formation/?search=1')
            .then((res) => {
                setFormation(res.data);
                setIsLoading(false); // Set isLoading to false when data is fetched
            })
            .catch((error) => {
                setIsLoading(false); // Set isLoading to false even if there's an error
            });
    }, []);

    useEffect(() => {

        axiosClient.get('test/')

            .then((res) => {

                setTests(res.data)

            })


    }, [])

    useEffect(() => {

        axiosClient.get('media/')

            .then((res) => {

                setMedias(res.data)

            })

    }, [])



    useEffect(() => {
        axiosClient.get('module/')
            .then((res) => {
                setListModuleOfFormation(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('chapitre/')
            .then((res) => setListChapitres(res.data))
    }, [])

    const { user, setUser } = useStateContext();

    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    console.log("user", user.id);


    function openModules(ids, titre, user) {
        navigate('/modules', {
            state: {
                id: ids,
                titre: titre,
                us: user

            }
        })
    }
    const filteredFormations = formation.filter((val) => {
        const modulesInFormation = listModuleOfFormation.filter((module) => module.formation === val.id);
        const formationHasModules = modulesInFormation.length > 0;

        if (formationHasModules) {
            // If the formation has modules, check if any module has chapters with media
            const hasModuleWithChaptersAndMedia = modulesInFormation.some((module) => {
                const chapitresInModule = listChapitre.filter((chapitre) => chapitre.module === module.id);

                // Check if any chapter in the module has media
                const hasMediaInChapters = chapitresInModule.some((chapitre) => {
                    const mediaInChapter = medias.filter((media) => media.chapitre === chapitre.id);
                    return mediaInChapter.length > 0;
                });

                return chapitresInModule.length > 0 && hasMediaInChapters;
            });

            return hasModuleWithChaptersAndMedia;
        } else {
            // If the formation does not have modules, exclude it from the filtered formations
            return false;
        }
    });

    // Apply search query filter on filtered formations
    const filteredFormationsWithSearch = filteredFormations.filter((val) =>
        val.titre.toLowerCase().includes(searchQuery.toLowerCase())
    );



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
    const inputBg = useColorModeValue("white", "gray.700");



    const MAX_WORDS = 30; // Maximum number of words to display

    function truncateDesc(address) {
        const words = address.split(' ');
        if (words.length > MAX_WORDS) {
            return words.slice(0, MAX_WORDS).join(' ') + '...';
        }
        return address;
    }
    sessionStorage.setItem('userid', user.id);


    const noFormationsFound = searchQuery.trim() !== "" && filteredFormationsWithSearch.length === 0;

    // const isExistFormation = isLoading ? ( // Show loading indicator while data is loading
    //     <>
    //         <Text>Loading...</Text>
    //     </>
    // ) : filteredFormationsWithSearch.length === 0 ? (

    //     <>






    //         <Lottie height={400} width={550} options={defaultOptions} />
    //         <Text fontSize={"2xl"} color={"#1A365D"} fontFamily={"mono"} textAlign="center" alignItems="center" justifyContent="center">Aucune formation n'a été trouvé !</Text>
    //     </>








    // ) : (

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
    //             <SimpleGrid mt={37} columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, lg: 3 }} >
    //                 {filteredFormationsWithSearch.map((val, key) => {

    //                     return (

    //                         <Card mx={5} key={key}>

    //                             <CardBody  >
    //                                 <Image

    //                                     src={val.image}
    //                                     height="180px"
    //                                     width="100%"
    //                                     alt={val.titre}
    //                                     borderRadius='lg'
    //                                 />

    //                                 <Stack mt='3' spacing='3'>

    //                                     <Heading size='md'>{val.titre}</Heading>
    //                                     <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDesc(val.description)}</Text>
    //                                 </Stack>
    //                             </CardBody>
    //                             <CardFooter style={{ justifyContent: "end" }} >

    //                                 <Button onClick={() => openModules(val.id, val.titre, user.id)} bg={"#FFD24C"}>Commencer</Button>


    //                             </CardFooter>
    //                         </Card>

    //                     )




    //                 })}


    //             </SimpleGrid></Box>
    //     </>


    // );





    return (
        <>
            <Box >

                <Box display="flex" justifyContent="space-between">
                    <Box display="flex" justifyContent="flex-start">

                        <Flex alignItems="center">
                            <Lottie height={80} width={80} options={defaultOpt} />
                            <GradientText gradient="#ffd140, #089bd7">
                                Bienvenue {user.first_name}</GradientText>                    </Flex>
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
                ) : noFormationsFound ? (
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
                                {filteredFormationsWithSearch.map((val, key) => {

                                    return (

                                        <Card mx={5} key={key}>

                                            <CardBody  >
                                                <Image

                                                    src={val.image}
                                                    height="180px"
                                                    width="100%"
                                                    alt={val.titre}
                                                    borderRadius='lg'
                                                />

                                                <Stack mt='3' spacing='3'>

                                                    <Heading size='md'>{val.titre}</Heading>
                                                    <Text fontSize='xs' style={{ color: "#809fb8" }}>{truncateDesc(val.description)}</Text>
                                                </Stack>
                                            </CardBody>
                                            <CardFooter style={{ justifyContent: "end" }} >

                                                <Button onClick={() => openModules(val.id, val.titre, user.id)} bg={"#FFD24C"}>Commencer</Button>


                                            </CardFooter>
                                        </Card>

                                    )




                                })}
                            </SimpleGrid>
                        </Box>
                    </>
                )}




            </Box>
        </>
    );
}

export default Formation_;


