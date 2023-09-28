import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, CircularProgress, CircularProgressLabel, Flex, Icon, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Stack, Text, Toast, useColorModeValue, useToast } from '@chakra-ui/react'

import React, { useEffect, useState } from 'react'

import { FaCheckCircle, FaPaperPlane } from 'react-icons/fa'

import axiosClient from '../../../axios-client'

import { BiBadgeCheck } from 'react-icons/bi'

import { RiSlideshowFill } from 'react-icons/ri'

import { AiOutlineFileZip, AiOutlineLink } from 'react-icons/ai'

import { MdOndemandVideo, MdQuiz } from 'react-icons/md'

import Lottie from 'react-lottie'

import { useLocation, useNavigate } from 'react-router'

import bookData from '../../../assets/lot/book2.json'

import { useStateContext } from '../../../context/ContextProvider'

import { StarIcon } from '@chakra-ui/icons'


import rating from '../../../assets/lot/rating.json';



const defaultOption = {

    loop: true,

    autoplay: true,

    animationData: rating,

    rendererSettings: {

        preserveAspectRatio: 'xMidYMid slice'

    }

};

const itemsPerPage = 5;


const defaultOpt = {

    loop: true,

    autoplay: true,

    animationData: bookData,

    rendererSettings: {

        preserveAspectRatio: 'xMidYMid slice'

    }

};

export default function Chapitre() {

    const [chapitres, setChapitres] = useState([])

    const [medias, setMedias] = useState([])

    const [link, setLink] = useState([])

    const [tests, setTests] = useState([])

    const [pmc, setProgModContent] = useState([]);

    const [listProgres, setListProgres] = useState([])

    const [progressId, setProgressId] = useState()

    const { user, setUser } = useStateContext();

    const [resultat, setResultat] = useState()

    const [certificat, setCertificat] = useState()

    const [isvalidate, setIsValidate] = useState([])

    const [listRatingwithIds, setListRatingwithIds] = useState([]);
    const [vds, setVds] = useState([])


    const [listefeeds, setListFeeds] = useState([]);
    const [listerates, setListRates] = useState([]);



    useEffect(() => {

        axiosClient

            .get(

                `/rating/getRatingsByIds/?idModule=${location.state.id}&idApprenant=${user.id}`

            )

            .then((res) => setListRatingwithIds(res.data));

    }, []);


    useEffect(() => {

        axiosClient.get('auth/user/')

            .then(({ data }) => {

                setUser(data)

                console.log()

            })

    }, [])



    useEffect(() => {

        axiosClient.get('test/')

            .then((res) => {

                setTests(res.data.filter(e => e.idModule === location.state.id))

            })


    }, [])



    useEffect(() => {
        //
        if (user.id !== undefined && tests) {




            axiosClient.get('resultat/')

                .then((res) => {

                    setResultat(res.data.filter(e => e.idModule === location.state.id && e.idUser === user.id))

                    console.log("filettr", res.data.filter(e => e.idModule === location.state.id && e.idUser === user.id));

                })

        }



    }, [tests, user])



    useEffect(() => {

        if (tests !== undefined && resultat !== undefined) {

            const validateMap = new Map();

            resultat.forEach((res) => {

                if (res.idTest === undefined) {

                    validateMap.set(res.idTest, false);

                } else {

                    validateMap.set(res.idTest, res.valider);

                }

            });

            const updatedValidate = tests.map((test) => {

                const validate = validateMap.get(test.id);

                return validate !== undefined ? validate : false;

            });

            setIsValidate(updatedValidate);

        }

    }, [tests, resultat]);




    useEffect(() => {

        if (chapitres.length === 0) {

            axiosClient.get(`chapitre/?search=${location.state.id}`)

                .then((res) => {

                    setChapitres(res.data)

                })

        }

    }, [chapitres])

    useEffect(() => {

        axiosClient.get('link/')

            .then((res) => setLink(res.data))

    }, [])

    useEffect(() => {

        axiosClient.get('media/')

            .then((res) => {

                setMedias(res.data)

            })

    }, [])




    useEffect(() => {

        axiosClient.get('certificat/')

            .then((res) => {

                setCertificat(res.data)

            })

    }, [])

    useEffect(() => {

        axiosClient.get('videos/')

            .then((res) => {

                setVds(res.data)

            })

    }, [])


    useEffect(() => {

        axiosClient.get('progressmodcontent/')

            .then((res) => {

                setProgModContent(res.data)

            })

    }, [])

    useEffect(() => {

        axiosClient.get('progres/')

            .then((res) => {

                setListProgres(res.data)

            })

    }, [])


    useEffect(() => {




        if (user.id !== undefined) {
            axiosClient.get('rating/')

                .then((res) => {

                    setListRates(res.data.filter(

                        (val) => val.module === location.state.id &&
                            val.apprenant === user.id


                    ))

                })
        }
    }, [user])

    useEffect(() => {

        if (user.id !== undefined) {
            axiosClient.get('feedback/')

                .then((res) => {

                    setListFeeds(res.data.filter(

                        (val) => val.id_module === location.state.id &&
                            val.apprenant === user.id


                    ))

                })
        }

    }, [user])






    const location = useLocation()

    const navigate = useNavigate()



    function openModuleSubContentDoc(ids, idmod, idchap, titre, titreFormation, idMedia, chapitreCount) {

        navigate('/submodcontentdoc', {

            state: {

                id: ids,

                idmodule: idmod,

                idchapitre: idchap,

                tm: titre,

                tf: titreFormation,

                idm: idMedia,

                chapcount: chapitreCount

            }

        })

    }

    function openModuleSubContentPPt(ids, idmod, idchap, titre, titreFormation, idMedia, chapitreCount) {

        navigate('/ppt', {

            state: {

                id: ids,

                idmodule: idmod,

                idchapitre: idchap,

                tm: titre,

                tf: titreFormation,

                idm: idMedia,

                chapcount: chapitreCount

            }

        })

    }


    function LinkButton({ href, children }) {

        const handleClick = () => {

            window.open(href, "_blank");

        };

        return (

            <Button color="#fff" bg="#089bd7" onClick={handleClick}>

                {children}

            </Button>

        );

    }

    function LinkButtondb({ href, children }) {



        return (

            <Button isDisabled color="#fff" bg="#089bd7" >

                {children}

            </Button>

        );

    }

    const bg = useColorModeValue('#089bd7', 'gray.700');

    const sortedMedias = medias.sort((a, b) => {

        if (a.type === 'Video' && b.type !== 'Video') {

            return -1;

        } else if (a.type !== 'Video' && b.type === 'Video') {

            return 1;

        } else if (a.type === 'Video' && b.type === 'Video') {

            return 0;

        } else if (a.type === 'Link' && b.type !== 'Link') {

            return 1;

        } else if (a.type !== 'Link' && b.type === 'Link') {

            return -1;

        } else {

            return 0;

        }

    });


    const [finalProgres, setFinalProgres] = useState(0);

    const testActivated = listProgres.map((progress, cle) => {



        return tests.map((test, key) => {

            if (test.module === location.state.titre && progress.module === location.state.id && progress.module === test.idModule

                && progress.apprenant === user.id) {

                if ((finalProgres >= 100 && isvalidate[key - 1]) || (finalProgres >= 100 && key === 0)) {

                    console.log("le progress du module     =====================================>>>>>>>>>   " + progress.progres);
                    console.log("le  final progress du module       =====================================>>>>>>>>>   " + finalProgres);



                    return (

                        <Stack key={key}

                            h={{ base: "90px", md: "60px" }}

                            w={{ base: "100%", md: "100%" }}

                            borderRadius="lg"

                            border="1px solid rgba(0, 0, 0, 0.25)"

                            p={4}

                            mb={3}

                            direction="row"

                            alignItems="center" >




                            <Icon as={FaCheckCircle} color={isvalidate[key] === true ? " green" : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                            <Icon as={MdQuiz} color="black" h="32px" w="32px" />

                            <Box flexGrow={1} display="flex" >

                                <Box ml={{ base: "10px", md: "30px" }}>      Test  -- Niveau :   {test.difficulter}

                                </Box>

                            </Box>

                            <Button w="80px" color="#fff" bg="#089bd7" onClick={() =>

                                navigate(`/test/${test.id}`, {

                                    state: {

                                        mediac: mediasOfChapitresOfModules

                                    }

                                })

                            }>Acces</Button>

                        </Stack>

                    )

                } else {
                    console.log("le progress du module  else     =====================================>>>>>>>>>   " + progress.progres + "bloquéé!!!!!!!!!!!!");
                    console.log("le  final progress du module   else       =====================================>>>>>>>>>   " + finalProgres + "bloquéé!!!!!!!!!!!!");

                    return (

                        <Stack

                            key={key}

                            h={{ base: "90px", md: "60px" }}

                            w={{ base: "100%", md: "100%" }}

                            borderRadius="lg"

                            border="1px solid rgba(0, 0, 0, 0.25)"

                            p={4}

                            mb={3}

                            direction="row"

                            alignItems="center"

                            bg="gray.100"

                            opacity={0.5}

                            cursor="not-allowed"

                        >

                            <Icon as={FaCheckCircle} color="gray.400" h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                            <Icon as={MdQuiz} color="gray.400" h="32px" w="32px" />

                            <Box flexGrow={1} display="flex" >

                                <Box ml={{ base: "10px", md: "30px" }}>

                                    Test -  Difficulté : {test.difficulter}

                                </Box>

                            </Box>

                            <Button w="80px" isDisabled color="gray.400" bg="gray.500" cursor="not-allowed">Acces</Button>

                        </Stack>






                    )

                }

            }

        })

    });




    function mediasInsideChapitres() {

        let total = 0

        chapitres.map((val, key) => {

            if (val.module === location.state.id) {

                sortedMedias.map((media) => {

                    if (val.id === media.chapitre) {

                        total = total + 1

                    }


                })

            }

        })

        return total



    }







    const mediasOfChapitresOfModules = mediasInsideChapitres();



    const [currentPage, setCurrentPage] = useState(1);


    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;



    // useEffect(() => {

    //     const fetchProgress = async () => {

    //         try {

    //             const response = await axiosClient.get(

    //                 `progres/geProgress/?idModule=${location.state.id}&idApprennant=${user.id}`

    //             );

    //             const resData = response.data;

    //             const totalMedias = sortedMedias.length;

    //             let trueProgress = 0;

    //             chapitres.forEach((val) => {

    //                 if (val.module === location.state.id) {

    //                     sortedMedias.forEach((media) => {

    //                         if (media.chapitre === val.id) {

    //                             pmc.forEach((p) => {

    //                                 if (media.id === p.media && p.apprenant === user.id && p.etat === true) {

    //                                     trueProgress += 1;

    //                                 }

    //                             });

    //                         }

    //                     });

    //                 }

    //             });

    //             const newProgress = (trueProgress / totalMedias) * 100;

    //             if (newProgress !== resData.progres && resData.progres !== undefined) {

    //                 const formData = new FormData();

    //                 formData.append("progres", newProgress);

    //                 await axiosClient.patch(`/progres/${resData.id}/`, formData);

    //             }

    //             setProgressId(resData);

    //             setFinalProgres(newProgress);

    //         } catch (error) {

    //             console.log(error);

    //         }

    //     };

    //     if (chapitres.length && sortedMedias.length && pmc.length && location.state.id) {

    //         fetchProgress();

    //     }

    // }, [chapitres, sortedMedias, pmc, location.state.id]);



    useEffect(() => {

        const fetchData = async () => {

            try {

                const res = await axiosClient.get(

                    `progres/geProgress/?idModule=${location.state.id}&idApprennant=${user.id}`

                );

                let trueProgress = 0;

                const chapitresForModule = chapitres.filter(

                    (val) => val.module === location.state.id

                );

                chapitresForModule.forEach((chapitre) => {

                    const mediasForChapitre = sortedMedias.filter(

                        (media) => media.chapitre === chapitre.id

                    );

                    mediasForChapitre.forEach((media) => {

                        const progress = pmc.find(

                            (p) =>

                                p.media === media.id &&

                                p.apprenant === user.id &&

                                p.etat

                        );

                        if (progress) {

                            trueProgress += 1;

                        }

                    });

                });


                const mediasOfChapitresOfModules = sortedMedias.filter(

                    (media) =>

                        chapitresForModule.find((chapitre) => chapitre.id === media.chapitre)

                ).length;

                let newProgress = location.state.prog;


                if (trueProgress !== 0) {

                    newProgress = (trueProgress / mediasOfChapitresOfModules) * 100;

                }

                if (

                    res.data.progres !== undefined &&

                    newProgress !== res.data.progres

                ) {

                    const formData = new FormData();

                    formData.append("progres", newProgress);

                    axiosClient

                        .patch(`/progres/${res.data.id}/`, formData)

                        .then((response) => {

                            // console.log("Progress updated successfully.");

                        })

                        .catch((error) => {

                            console.log("Failed to update progress:", error);

                        });

                }

                setProgressId(res.data);

                setFinalProgres(newProgress);

            } catch (error) {

                console.log("Error fetching progress:", error);

            }

        };

        fetchData();

    }, [chapitres, sortedMedias, pmc, location.state.id, user.id, axiosClient]);

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

    const ic = useColorModeValue('black', 'gray.200')

    const ic_ = useColorModeValue('green', 'green.200')


    const [states, setStates] = useState([])

    let chapiterState = []

    function mediasCp() {

        let etats = []



        chapitres.map((val, key) => {

            if (val.module === location.state.id) {

                sortedMedias.map((media) => {

                    pmc.map((p, k) => {

                        if (p.media === media.id && media.chapitre === val.id && p.apprenant === user.id) {

                            etats.push(p.etat)

                        }


                    })

                })

                if (etats.length > 0) {

                    if (etats.includes(false)) {

                        chapiterState.push(false);

                    }

                    else {

                        chapiterState.push(true);

                    }

                    etats = []

                }

            }

        })


    }
    const mediasOfC = mediasCp();// Very strange : I neevr use this variable , but when i remove it , it stuck displaying of incompleted chapters


    function idsVideosAPp(chap) {

        let videos = []


        chapitres.map((val, key) => {

            if (val.module === location.state.id) {

                sortedMedias.map((media) => {

                    vds.map((v) => {


                        if (media.chapitre === val.id && media.type === "Video" && media.chapitre === chap) {

                            if (media.id === v.id)

                                videos.push(v.id)



                        }
                    })




                })
            }
        })


        return videos
    }

    const ids_vid = idsVideosAPp();//problem

    function openModuleSubContent(ids, idmod, idchap, titre, titreFormation, idMedia, chapitreCount, idvideos) {

        navigate('/tabbed', {

            state: {

                id: ids,

                idmodule: idmod,

                idchapitre: idchap,

                tm: titre,

                tf: titreFormation,

                idm: idMedia,

                chapcount: chapitreCount,
                idv: idvideos

            }

        })

    }






    const [progres, setProgres] = useState([]);

    useEffect(() => {

        axiosClient.get('progres/')

            .then((res) => {

                setProgres(res.data)

            })

    }, [])


    const progress = 100 / mediasOfChapitresOfModules


    const checkPassed = (idMedia, idApp, url) => {

        const formData = new FormData();


        return pmc.map((val, key) => {

            if (val.apprenant === idApp && val.media === idMedia) {

                if (val.etat) {

                    return (

                        <Button px={{ base: "4", md: "6" }} isDisabled bg={"green"} > <Flex alignItems="center">

                            <Icon color={"white"} as={FaCheckCircle} mr="2" />

                            <Text color={"white"}>terminé</Text>

                        </Flex></Button>

                    )

                }

                if (val.etat === false) {

                    return (

                        <IconButton

                            width={"78px"}

                            aria-label="Button with Icon"

                            icon={<BiBadgeCheck color='#fff' fontSize={"25px"} />}

                            variant="solid"

                            bg="#FFD24C"

                            onClick={(e) => {

                                axiosClient.put(`progressmodcontent/${val.id}/`, {

                                    etat: true,

                                    media: idMedia,

                                    apprenant: user.id

                                })

                                Toast({

                                    title: ` Terminé !`,

                                    position: "top-right",

                                    isClosable: true,

                                }

                                )

                                if (('status' in progressId)) {

                                    formData.append("progres", progress);

                                    formData.append("module", location.state.idmodule);

                                    formData.append("apprenant", user.id);


                                    axiosClient.post(`progres/`, formData)

                                        .then((response) => console.log())

                                        .catch((error) => console.log());


                                }

                                progres.map((prog, key) => {

                                    if (prog.module === location.state.idmodule && prog.apprenant === user.id) {

                                        prog.progres = prog.progres + progress

                                        formData.append("progres", prog.progres);

                                        axiosClient.patch(`/progres/${prog.id}/`, formData)

                                            .then((response) => console.log())

                                            .catch((error) => console.log());

                                    }

                                })

                                e.preventDefault(); window.open(url, '_blank');
                                //                                e.preventDefault(); window.open(`http://${url}`, '_blank');


                                window.location.reload()



                            }

                            }> </IconButton >)

                }

            }


        })

    }


    const getRating = () => {

        let a

        listRatingwithIds.map((val, key) => {

            a = val.rating

        })

        return a

    }

    const rt = getRating()

    const [isOpen, setIsOpen] = useState(false);


    const OverlayOne = () => (

        <ModalOverlay

            bg='none'

            backdropFilter='auto'

            backdropBlur='4px'

        />

    )

    const [overlay, setOverlay] = React.useState(<OverlayOne />)
    const [isRatingVisible, setIsRatingVisible] = useState(true);


    const toast = useToast()

    const Rating = ({ defaultValue = 0, maxStars = 5, messages = [], isRatingVisible }) => {
        const [rating, setRating] = useState(defaultValue);
        const [hovered, setHovered] = useState(-1);
        const [isClicked, setIsClicked] = useState(false);

        const handleStarClick = (index) => {
            setRating(index + 1);
            setIsClicked(true);

            setIsRatingVisible(false);


            const hasUserRated = listRatingwithIds.some((rating) => rating.apprenant === user.id);

            if (messages[index]) {
                toast({
                    title: "Merci infiniment pour votre feedback ! Vos commentaires sont très précieux pour nous aider à améliorer notre service.",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right",
                });

                if (!hasUserRated) {
                    axiosClient
                        .post("rating/", {
                            apprenant: user.id,
                            module: location.state.id,
                            rating: index + 1,
                        })
                        .then(() => {
                            setListRatingwithIds([...listRatingwithIds, { apprenant: user.id }]);
                        });
                }

                listRatingwithIds.map((val, key) => {
                    const formData = new FormData();
                    formData.append("rating", index + 1);
                    axiosClient.patch(`/rating/${val.id}/`, formData);
                });
            }
        };

        const handleStarHover = (index) => {
            setHovered(index);
        };

        const renderStars = () => {
            const stars = [];

            for (let i = 0; i < maxStars; i++) {
                stars.push(
                    <Box
                        key={i}
                        onClick={() => handleStarClick(i)}
                        onMouseEnter={() => handleStarHover(i)}
                        onMouseLeave={() => handleStarHover(-1)}
                    >
                        <StarIcon
                            color={i <= (hovered - 1) || i <= (rating - 1) ? "yellow.400" : "gray.200"}
                            boxSize={9}
                            p={1}
                        />
                    </Box>
                );
            }

            return <Flex direction="row">{stars}</Flex>;
        };

        return (
            <>
                {isRatingVisible && (!isClicked || rating !== defaultValue) && (
                    <Box>
                        {renderStars()}
                    </Box>
                )}
            </>
        );
    };

    const [isInputFocused, setIsInputFocused] = useState(false);


    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleInputBlur = () => {
        setIsInputFocused(false);
    };


    function getProgressOfModule() {

        let p

        progres.map((prog, k) => {

            if (prog.module === location.state.id && prog.apprenant === user.id)

                p = prog.progres

        })

        return p

    }





    const ppx = getProgressOfModule()



    useEffect(() => {

        if (ppx === 100 && (listefeeds.length == 0 || listerates.length == 0) &&
            tests.every((test, index) => isvalidate[index])) {




            // const randomTime = Math.floor(Math.random() * 10000) + 5000;

            const timeoutId = setTimeout(() => {

                setIsOpen(true);

                setOverlay(<OverlayOne />)

            }, 2000);

            return () => clearTimeout(timeoutId);

        } else {

        }


    }, [ppx, listefeeds, listerates, tests, isvalidate]);

    const [message, setMessage] = useState('')

    const inp_ = useColorModeValue('white', 'gray.800')

    const progressLabel = isNaN(finalProgres) ? "0%" : `${Math.round(finalProgres)}%`;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isFeedbackModified, setIsFeedbackModified] = useState(false);


    const sendFeedback = () => {

        const formData = new FormData()

        formData.append('id_module', location.state.id)

        formData.append('message', message)

        formData.append('apprenant', user.id)

        axiosClient.post('/feedback/', formData)

        toast({

            title: ` Envoyé avec succes !`,

            position: "bottom-right",

            isClosable: true,

        })

        setIsSubmitted(true);


    }


    let counter = 1

    return (

        <>


            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>

                {overlay}

                <ModalContent style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>

                    <ModalBody rounded='md'  >

                        <Lottie width={'75%'} options={defaultOption} />

                    </ModalBody>

                    <ModalBody h={'55%'}>

                        <Text color={'blue.600'} fontSize={'xl'} align={"center"} fontWeight={"bold"} fontFamily={"revert-layer"}>

                            Votre avis nous intéresse !

                        </Text>




                        {!isSubmitted ? (
                            <Text fontWeight={'medium'} fontFamily={"cursive"}>
                                Si vous avez un moment, pourriez-vous nous donner une note en utilisant les étoiles ci-dessous ? Votre feedback nous aide à améliorer notre service pour vous et pour les autres clients. Merci d'avance pour votre contribution.
                            </Text>
                        ) : (
                            <Text fontWeight={'medium'} fontFamily={"cursive"}>
                                Merci d'avoir envoyé votre feedback ! Votre contribution est précieuse pour nous.
                            </Text>
                        )}


                        <Flex justify={'center'} mt={2}>

                            <Rating isRatingVisible={isRatingVisible}
                                defaultValue={3} maxStars={5} messages={[1, "2", "3", "4", "5"]} />

                        </Flex>


                        {!isSubmitted && (<Flex mt="8">

                            <Input name='message' bg={inp_} p={4} mr={2} width="90%" onChange={e => { setMessage(e.target.value); setIsFeedbackModified(true); }
                            } placeholder="Saisir votre commentaire" ></Input>

                            <Button

                                width={{ base: "100%", md: "auto" }}

                                colorScheme='yellow'

                                onClick={() => sendFeedback()}

                                px={{ base: "4", md: "6" }}

                                fontSize={{ base: "sm", md: "md" }}

                            >

                                <Flex alignItems="center">

                                    <Icon as={FaPaperPlane} mr="2" />

                                    Envoyer

                                </Flex>

                            </Button>

                        </Flex>)}



                    </ModalBody>

                    <ModalFooter>

                        <Button width={{ base: "100%", md: "110px" }} colorScheme="blue" onClick={() => setIsOpen(false)}>

                            Fermer

                        </Button>

                    </ModalFooter>

                </ModalContent>

            </Modal >


            <Box>

                <Flex justifyContent={"space-between"} mt={2}>

                    <Box display="flex" justifyContent="flex-start">

                        <Flex alignItems="center">

                            <Lottie height={60} width={60} options={defaultOpt} />

                            <GradientText gradient="#FFD140, #089bd7">Module {location.state.titre}</GradientText>

                        </Flex>

                    </Box>



                    <Box>

                        <CircularProgress size="60px" value={finalProgres} color="green.400">

                            <CircularProgressLabel>{`${progressLabel}`}</CircularProgressLabel>

                        </CircularProgress>

                    </Box>

                </Flex>

                <Accordion mt="50px" allowToggle maxW="100%" mx="auto">

                    {chapitres.map((val, ckey) => {
                        let chapitreNumber = ckey + 1
                        //problem is in ckey wihen i  switch to other module it start with order of chapitre ckey = 0

                        if ((val.module === location.state.id && chapiterState[ckey - 1]) || (val.module === location.state.id && ckey === 0)) {

                            return (

                                <AccordionItem key={val.id}>

                                    <h2>

                                        <AccordionButton

                                            bg={bg}

                                            color="#fff"

                                            borderRadius="md"

                                            h="70px"

                                            mb={2}

                                            _hover={{ bg: 'gray.300' }}

                                            _focus={{ boxShadow: 'none' }}

                                            _active={{ bg: 'gray.400' }}

                                        >

                                            <Box flex="1" textAlign="left" fontWeight="semibold">

                                                Chapitre {chapitreNumber}:  {val.name}

                                            </Box>

                                            <AccordionIcon />

                                        </AccordionButton>

                                    </h2>

                                    <AccordionPanel

                                        borderTopWidth="1px"

                                        borderTopColor="gray.200"

                                        borderBottomWidth="1px"

                                        borderBottomColor="gray.200"

                                        pb={4}

                                    >

                                        <Accordion allowToggle>

                                            {sortedMedias.map((media) => {

                                                return pmc.map((p, key) => {

                                                    if (media.id === p.media && p.apprenant === user.id) {

                                                        const smallestItem = chapitres.reduce((acc, curr) => {

                                                            if (curr.id < acc.id || acc.id === undefined) {

                                                                return curr;

                                                            }

                                                            return acc;

                                                        }, {});

                                                        return (

                                                            media.chapitre === val.id && (

                                                                (media.type === "PDF" || media.type === "PPT" || media.type === "Video") ? (


                                                                    <Stack key={media.id} h={{ base: "90px", md: "60px" }} w={{ base: "100%", md: "100%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center">

                                                                        <Icon as={FaCheckCircle} color={p.etat === true ? ic_ : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                                                                        <Icon as={media.type === 'Video' ? MdOndemandVideo : media.type === 'Link' ? AiOutlineLink : media.type === 'PPT' ? RiSlideshowFill : AiOutlineFileZip} color={ic} h="32px" w="32px" />

                                                                        <Box flexGrow={1} display="flex" >

                                                                            <Box ml={{ base: "10px", md: "30px" }}>

                                                                                {media.name}

                                                                            </Box>

                                                                        </Box>

                                                                        <Button w="80px" onClick={() => media.type === "Video" ? openModuleSubContent(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules, idsVideosAPp(val.id)) : media.type === "PDF" ? openModuleSubContentDoc(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules) : openModuleSubContentPPt(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules)} color="#fff" bg="#089bd7">Access</Button>

                                                                    </Stack>

                                                                ) : null

                                                            )

                                                        )

                                                    }

                                                })

                                            })}

                                            {link.map((l, key) => {

                                                if (l.chapitre === val.id) {


                                                    return (

                                                        <Stack key={key} h={{ base: "90px", md: "60px" }} w={{ base: "100%", md: "100%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center">




                                                            {pmc.map((p, key) => {

                                                                if (l.id === p.media && p.apprenant === user.id)

                                                                    return (

                                                                        <>

                                                                            <Icon as={FaCheckCircle} color={p.etat === true ? ic_ : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                                                                            <Icon as={AiOutlineLink} color={ic} h="32px" w="32px" />

                                                                            <Box flexGrow={1} display="flex" >

                                                                                <Box ml={{ base: "10px", md: "30px" }}>

                                                                                    <Text>{l.link.substring(0, 38)}</Text>

                                                                                </Box>

                                                                            </Box>


                                                                            {!p.etat ? checkPassed(l.id, user.id, l.link)

                                                                                : <LinkButton href={l.link} >

                                                                                    Access

                                                                                </LinkButton>}



                                                                        </>)

                                                            })}



                                                        </Stack>

                                                    )

                                                }

                                            })}



                                        </Accordion>

                                    </AccordionPanel>

                                </AccordionItem>

                            )

                        } else {

                            return (

                                <AccordionItem key={val.id}>

                                    <h2>

                                        <AccordionButton

                                            bg={bg}

                                            color="#fff"

                                            borderRadius="md"

                                            h="70px"

                                            mb={2}

                                            _hover={{ bg: 'gray.300' }}

                                            _focus={{ boxShadow: 'none' }}

                                            _active={{ bg: 'gray.400' }}

                                        >

                                            <Box flex="1" textAlign="left" fontWeight="semibold">

                                                Chapitre {chapitreNumber} :  {val.name}

                                            </Box>

                                            <AccordionIcon />

                                        </AccordionButton>

                                    </h2>

                                    <AccordionPanel

                                        borderTopWidth="1px"

                                        borderTopColor="gray.200"

                                        borderBottomWidth="1px"

                                        borderBottomColor="gray.200"

                                        pb={4}

                                    >

                                        <Accordion allowToggle>

                                            {sortedMedias.map((media) => {

                                                return pmc.map((p, key) => {

                                                    if (media.id === p.media && p.apprenant === user.id) {

                                                        const smallestItem = chapitres.reduce((acc, curr) => {

                                                            if (curr.id < acc.id || acc.id === undefined) {

                                                                return curr;

                                                            }

                                                            return acc;

                                                        }, {});

                                                        return (

                                                            media.chapitre === val.id && (

                                                                (media.type === "PDF" || media.type === "PPT" || media.type === "Video") ? (


                                                                    <Stack key={media.id} h={{ base: "90px", md: "60px" }} w={{ base: "100%", md: "100%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center" bg="gray.100"

                                                                        opacity={0.5}

                                                                        cursor="not-allowed">

                                                                        <Icon as={FaCheckCircle} color={p.etat === true ? ic_ : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                                                                        <Icon as={media.type === 'Video' ? MdOndemandVideo : media.type === 'Link' ? AiOutlineLink : media.type === 'PPT' ? RiSlideshowFill : AiOutlineFileZip} color={ic} h="32px" w="32px" />

                                                                        <Box flexGrow={1} display="flex" >

                                                                            <Box ml={{ base: "10px", md: "30px" }}>

                                                                                {media.name}

                                                                            </Box>

                                                                        </Box>

                                                                        <Button isDisabled w="80px" onClick={() => media.type === "Video" ? openModuleSubContent(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules) : media.type === "PDF" ? openModuleSubContentDoc(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules) : openModuleSubContentPPt(location.state.idf, location.state.id, val.id, location.state.titreF, location.state.titre, media.id, mediasOfChapitresOfModules)} color="#fff" bg="#089bd7">Access</Button>

                                                                    </Stack>

                                                                ) : null

                                                            )

                                                        )

                                                    }

                                                })

                                            })}

                                            {link.map((l, key) => {

                                                if (l.chapitre === val.id) {


                                                    return (

                                                        <Stack key={key} h={{ base: "90px", md: "60px" }} w={{ base: "100%", md: "100%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center" bg="gray.100"

                                                            opacity={0.5}

                                                            cursor="not-allowed">




                                                            {pmc.map((p, key) => {

                                                                if (l.id === p.media && p.apprenant === user.id)

                                                                    return (

                                                                        <>

                                                                            <Icon as={FaCheckCircle} color={p.etat === true ? ic_ : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />

                                                                            <Icon as={AiOutlineLink} color={ic} h="32px" w="32px" />

                                                                            <Box flexGrow={1} display="flex" >

                                                                                <Box ml={{ base: "10px", md: "30px" }}>

                                                                                    <a style={{ cursor: 'pointer' }}>{l.link.substring(0, 20)}</a>

                                                                                </Box>

                                                                            </Box>


                                                                            {!p.etat ? checkPassed(l.id, user.id, l.link)

                                                                                : <LinkButtondb >

                                                                                    Access

                                                                                </LinkButtondb>}



                                                                        </>)

                                                            })}



                                                        </Stack>

                                                    )

                                                }

                                            })}



                                        </Accordion>

                                    </AccordionPanel>

                                </AccordionItem>

                            )


                        }

                    })}




                    <AccordionItem >

                        <h2>

                            <AccordionButton

                                bg={bg}

                                color="#fff"

                                borderRadius="md"

                                h="70px"

                                mb={2}

                                _hover={{ bg: 'gray.300' }}

                                _focus={{ boxShadow: 'none' }}

                                _active={{ bg: 'gray.400' }}

                            >

                                <Box flex="1" textAlign="left" fontWeight="semibold">

                                    Test

                                </Box>

                                <AccordionIcon />

                            </AccordionButton>

                        </h2>

                        <AccordionPanel

                            borderTopWidth="1px"

                            borderTopColor="gray.200"

                            borderBottomWidth="1px"

                            borderBottomColor="gray.200"

                            pb={4}

                        >

                            <Accordion allowToggle>

                                {testActivated}


                            </Accordion>

                        </AccordionPanel>

                    </AccordionItem>


                </Accordion>



            </Box>

        </>

    )

}

