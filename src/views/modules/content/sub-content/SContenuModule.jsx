import React, { useEffect, useRef, useState } from 'react';
import { useColorModeValue, Flex, Box, Text, Progress, List, ListItem, Button, Stack, Spacer, Textarea, Icon, Input, IconButton, Wrap, WrapItem, useToast, Avatar, useMediaQuery, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/react';
import { Media, Video } from '@vidstack/player-react';
import poster from '../../../../assets/img/e-learn.jpg';

import { FaArrowCircleLeft, FaArrowLeft, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../../../axios-client';
import { StarIcon } from "@chakra-ui/icons";
import Moment from 'react-moment'
import _ from 'lodash';



import { useStateContext } from '../../../../context/ContextProvider';
import Lottie from 'react-lottie';
import feed from '../../../../assets/lot/feeds.json';
import rating from '../../../../assets/lot/rating.json';


const defaultOpt = {
    loop: true,
    autoplay: true,
    animationData: feed,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: rating,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};


function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const Submodcontent = React.memo(({ idmed, idmod, i, showButton }) => {
    const [selectedSection, setSelectedSection] = useState(null);

    const [isTerminated, setTerminated] = useState(false);

    const [videos, setVideos] = useState([])
    const [imagex, setImagex] = useState()

    const videoRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);

    const location = useLocation()

    const [pmc, setProgModContent] = useState([]);
    const [progres, setProgres] = useState([]);
    const [apprenants, setApprenants] = useState([]);
    const [media, setMedia] = useState([]);

    const [progressId, setProgressId] = useState()
    const [progvid, setProgressVideo] = useState()


    const [feedback, setFeedBack] = useState([])

    const { user, setUser } = useStateContext();

    const [isNotSmallerScreen] = useMediaQuery("(min-width: 600px)");


    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])



    const progress = 100 / location.state.chapcount



    useEffect(() => {
        axiosClient.get('videos/')
            .then((res) => {
                setVideos(res.data)
            })
    }, [])

    const { shuffle } = _; // destructure the shuffle method from lodash

    useEffect(() => {
        axiosClient.get('feedback/').then((res) => {
            // Shuffle the list of feedbacks
            const shuffledFeedbacks = shuffle(res.data);

            // Select the first 3 feedbacks from the shuffled list
            const randomFeedbacks = shuffledFeedbacks.slice(0, 4);

            setFeedBack(randomFeedbacks);
        });
    }, []);

    useEffect(() => {
        axiosClient.get('progressmodcontent/')
            .then((res) => {
                setProgModContent(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('apprenants/')
            .then((res) => {
                setApprenants(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('progres/')
            .then((res) => {
                setProgres(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('media/')
            .then((res) => {
                setMedia(res.data)
            })
    }, [])

    const [message, setMessage] = useState('')
    const [id_Module] = useState(location.state.idm)
    const [image, setImage] = useState(null);

    const [idApprenant] = useState(1)
    let show = []

    const toast = useToast()
    const positions = [
        'top',
        'top-right',
        'top-left',
        'bottom',
        'bottom-right',
        'bottom-left',
    ]



    useEffect(() => {
        axiosClient.get(`progres/geProgress/?idModule=${location.state.idmodule}&idApprennant=${user.id}`)
            .then((res) => {
                setProgressId(res.data)
            })
    }, [])

    const sendFeedback = () => {
        const formData = new FormData()
        formData.append('id_module', location.state.idmodule)
        formData.append('message', message)
        formData.append('apprenant', user.id)

        axiosClient.post('/feedback/', formData)

        toast({
            title: ` Envoyé avec succes !`,
            position: "bottom-right",
            isClosable: true,
        })
    }


    const handleProgress = (event) => {
        const video = event.target;
        // Use destructuring:
        const { currentTime, duration } = video;
        setProgressVideo((currentTime / duration) * 100);
        setCurrentTime(currentTime);

    };


    const handleSectionClick = (section) => {
        setSelectedSection(section);
        const video = document.querySelector('video');
        video.currentTime = section.timestamp;
    };


    useEffect(() => {
        const video = document.querySelector('video');

        const handleBeforeUnload = (event) => {
            if (video.currentTime > 0 && !video.paused && !video.ended) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    if (
        videos.id === location.state.idm
    ) {
    }


    function count() {
        const mediaCount = [];
        media.forEach((m) => {
            if (m.chapitre === location.state.idchapitre) {

                const index = mediaCount.findIndex((item) => item.id === media.id);
                if (index >= 0) {
                    mediaCount[index].count++;
                } else {
                    mediaCount.push({ id: m.id, count: 1 });
                }


            }
        });

        return mediaCount.length
    }

    const mediaCountLength = count();

    const navigate = useNavigate()


    const checkPassed = (idMedia, idApp, video_prog) => {

        const handleButtonClick = (val) => {
            axiosClient
                .put(`progressmodcontent/${val.id}/`, {
                    etat: true,
                    media: idMedia,
                    apprenant: user.id
                })
                .then(() => {


                    if ('status' in progressId) {
                        const formData = new FormData();
                        formData.append('progres', progress);
                        formData.append('module', location.state.idmodule);
                        formData.append('apprenant', user.id);

                        axiosClient
                            .post('progres/', formData)
                            .then((response) => {
                                toast({
                                    title: 'Terminé !',
                                    position: 'top-right',
                                    isClosable: true
                                });

                            })
                            .catch((error) => console.log(error));




                    }

                    setProgModContent((prevPmc) =>
                        prevPmc.map((item) => {
                            if (item.id === val.id) {
                                return { ...item, etat: true };
                            }
                            return item;
                        })
                    );
                })
                .catch((error) => console.log(error));

            progres.map((prog, key) => {
                if (prog.module === location.state.idmodule && prog.apprenant === user.id) {
                    prog.progres += progress;
                    const formData = new FormData();
                    formData.append('progres', prog.progres);

                    axiosClient
                        .patch(`/progres/${prog.id}/`, formData)
                        .then((response) => console.log(response))
                        .catch((error) => console.log(error));
                }
            });

            window.location.reload()



        };

        return pmc.map((val, key) => {
            if (val.apprenant === idApp && val.media === idMedia) {
                if (val.etat) {

                    return (

                        <>

                            <Button px={{ base: '4', md: '6' }} isDisabled bg={'green'}>
                                <Flex alignItems="center">
                                    <Icon color={'white'} as={FaCheckCircle} mr="2" />
                                    <Text color={'white'}>terminé</Text>
                                </Flex>
                            </Button>

                            {/* <Button ml={3} px={{ base: '4', md: '6' }} onClick={() => navigate(-1)} >
                                <Flex alignItems="center">
                                    <Icon as={FaArrowLeft} mr="2" />
                                    <Text>Retour</Text>
                                </Flex>
                            </Button> */}
                        </>

                    );




                }
                if (val.etat === false) {
                    return (
                        <>
                            <Button
                                px={{ base: '4', md: '6' }}
                                bg={'#FFD24C'}
                                onClick={() => handleButtonClick(val)}
                            >
                                Marquer comme terminé
                            </Button>



                        </>
                    );
                }
            }
            return null;
        });
    };


    function ChatMessage({ message, time, avt, sender, like }) {
        return (
            <Flex justify={"flex-start"} mb="3">

                <Box position="relative">
                    <Avatar size="sm" src={avt} position="absolute" top="0" left="0" />
                    <Text fontSize={"12px"} color={useColorModeValue("gray.400", "gray.500")} fontStyle={'oblique'} ml={"45px"}>{sender}</Text>
                    <Box
                        bg={useColorModeValue("gray.200", "gray.500")}
                        color={useColorModeValue("gray.700", "white.100")}
                        px="3"
                        py="2"
                        rounded="3xl"
                        shadow="md"
                        w={'100%'}
                        ml="8" // Add margin to push message to the right of the avatar
                    >
                        <Flex justify="space-between" direction="column">
                            <Box textAlign="right">
                                <Text fontSize="2xs" fontWeight="bold" color="gray.400">
                                    <Moment format='MMMM DD YYYY , h:mm:ss a'>
                                        {time}

                                    </Moment>

                                </Text>
                            </Box>
                            <Box>
                                <Text fontSize="sm" textAlign="left">
                                    {message}
                                </Text>
                            </Box>
                            <Box textAlign="right">
                                <Flex justify='end'>
                                    {like &&
                                        <AiFillHeart color={like && 'red'} fontSize="20" cursor='pointer' defaultValue={like} />
                                    }
                                    {!like &&
                                        <AiOutlineHeart fontSize="20" cursor='pointer' defaultValue={like} />
                                    }

                                </Flex>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        );
    }


    const [listRatingwithIds, setListRatingwithIds] = useState([]);


    useEffect(() => {

        axiosClient
            .get(
                `/rating/getRatingsByIds/?idModule=${location.state.idmodule}&idApprenant=${user.id}`
            )
            .then((res) => setListRatingwithIds(res.data));

    }, []);


    const [raiting, setRaiting] = useState('');



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



    const Rating = ({ defaultValue = 0, maxStars = 5, messages = [] }) => {
        const [rating, setRating] = useState(defaultValue);
        const [hovered, setHovered] = useState(-1);


        const handleStarClick = (index) => {
            setRating(index + 1);
            const hasUserRated = listRatingwithIds.some((rating) => rating.apprenant === user.id);

            if (messages[index]) {
                toast({
                    title: "Merci infiniment pour votre feedback ! Vos commentaires sont très précieux pour nous aider à améliorer notre service.",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right"
                });

                if (!hasUserRated) {
                    axiosClient.post("rating/", {
                        "apprenant": user.id,
                        "module": location.state.idmodule,
                        "rating": index + 1,
                    }).then(() => {
                        setListRatingwithIds([...listRatingwithIds, { apprenant: user.id }]);
                    });
                    setIsOpen(false)
                } else {
                    listRatingwithIds.map((val, key) => {
                        const formData = new FormData();
                        formData.append("rating", index + 1);
                        axiosClient.patch(`/rating/${val.id}/`, formData);
                    })

                    setIsOpen(false)
                }


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

        return <Box>{renderStars()}</Box>;
    };


    const handleRefresh = () => {
        axiosClient.get('feedback/').then((res) => {
            const shuffledFeedbacks = shuffle(res.data);
            const randomFeedbacks = shuffledFeedbacks.slice(0, 6);
            setFeedBack(randomFeedbacks);
        });
    };


    const [avatarUrl, setAvatarUrl] = useState([]);

    useEffect(() => {
        axiosClient.get(`/apprenants/${user.id}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, [user.id]);







    function getProgressOfModule() {
        let p
        progres.map((prog, k) => {
            if (prog.module === location.state.idmodule)
                p = prog.progres
        })
        return p
    }


    const ppx = getProgressOfModule()


    const inp_ = useColorModeValue('white', 'gray.800')



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
                        <Text fontWeight={'medium'} fontFamily={"cursive"}>
                            Si vous avez un moment, pourriez-vous nous donner une note en utilisant les étoiles ci-dessous ? Votre feedback nous aide à améliorer notre service pour vous et pour les autres clients. Merci d'avance pour votre contribution.

                        </Text>
                        <Flex justify={'center'} mt={2}>
                            <Rating defaultValue={3} maxStars={5} messages={[1, "2", "3", "4", "5"]} />
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={() => setIsOpen(false)}>
                            Plus tard
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >


            <Flex justifyContent={'flex-end'}>

                {/* 
                <Button bg={"#089bd7"} px={{ base: '4', md: '6' }} width={"10%"} onClick={() => navigate((-1))}>
                    <Flex alignItems="center">
                        <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                        <Text color={'#ffd140'}>Retour</Text>
                    </Flex>
                </Button> */}

            </Flex>
            <Flex mt="3" w="full" alignItems="center" justifyContent="center">
                <Box
                    width={{ base: "100%", sm: "80%", md: "70%", lg: "100%" }}
                    boxShadow="lg"
                    borderRadius="lg"
                    height="700px"
                    overflowY="auto"
                    css={{
                        "&::-webkit-scrollbar": {
                            width: "11px",
                            height: "6px",

                        },
                        "&::-webkit-scrollbar-thumb": {
                            background: "#10316B",
                            borderRadius: "6px",

                        },
                        "&::-webkit-scrollbar-track": {
                            background: "gray.50",
                        },
                    }}
                >
                    {/* || val.id === idmed */}
                    <Flex justifyContent="center">
                        {videos.map((val, key) => {
                            if (val.id === i) {
                                return (
                                    <>
                                        <Media >
                                            <Video
                                                loading="visible"
                                                poster={poster}

                                                controls
                                                preload="true"
                                                onTimeUpdate={handleProgress}
                                            >
                                                <video

                                                    loading="visible"
                                                    poster={poster}
                                                    src={val.file}
                                                    preload="none"
                                                    data-video="0"
                                                    controls
                                                    ref={videoRef}
                                                    controlsList="nodownload" // Disable download


                                                />


                                            </Video>


                                        </Media>
                                        {/* <div>
                                            <iframe src="
                                            
                                            https://drive.google.com/uc?id=1wFHWJMsOJ4jxd0GYK530y1pTwlydPn_O
                                            "></iframe>
                                        </div>                */}
                                        {/* <MediaPlayer
                                            src={val.file}
                                            poster={poster}
                                            controls
                                            onTimeUpdate={handleProgress}
                                            ref={videoRef}


                                        >
                                           
                                            <MediaOutlet />

                                        </MediaPlayer> */}

                                    </>
                                )
                            }
                        })}

                    </Flex>


                    <Box bg={useColorModeValue('white', 'gray.700')} p="4" >
                        {videos.map((val, key) => {
                            if (val.id === location.state.idm) {
                                return (
                                    <Text px="4" fontWeight="bold">{val.name}</Text>
                                )
                            }
                        })}
                        <Box px="4">
                            <Progress value={progvid} size='sm' bg={useColorModeValue('yellow.400', 'yellow.200')} />

                        </Box>
                        <Text px="4" fontSize="sm" fontWeight="bold">
                            {formatTime(currentTime)}
                        </Text>

                        {videos.map((val, key) => {
                            if (val.id === i) {
                                if (pmc.length > 0) {
                                    show = pmc.filter(
                                        (resultat) =>
                                            (resultat.apprenant === user.id && resultat.media === val.id));
                                }

                                return (
                                    <React.Fragment>
                                        {progvid === 100 || (pmc.length > 0 && show[0].etat)
                                            ? (
                                                <Flex justifyContent="end" mr="4">
                                                    {checkPassed(val.id, user.id, progress)}
                                                </Flex>
                                            ) : null}
                                    </React.Fragment>
                                );

                            }
                        })}

                        {/* <List mt="4">
                            <ListItem
                                fontWeight={selectedSection === 1 ? 'bold' : 'normal'}
                                onClick={() => handleSectionClick({ timestamp: 10, section: 'Introduction' })}
                                cursor="pointer"
                            >
                                React structure
                            </ListItem>
                            <ListItem
                                fontWeight={selectedSection === 2 ? 'bold' : 'normal'}
                                onClick={() => handleSectionClick({ timestamp: 45, section: 'Main Topic 1' })}
                                cursor="pointer"
                            >
                                React props
                            </ListItem>
                            <ListItem
                                fontWeight={selectedSection === 3 ? 'bold' : 'normal'}
                                onClick={() => handleSectionClick({ timestamp: 100, section: 'Main Topic 2' })}
                                cursor="pointer"
                            >
                                React js / React native
                            </ListItem>
                        </List> */}
                        <Box mt="4" p="4" >
                            {/* 
                            <Button onClick={() => verify()}>verify</Button>
                            <Text>{progress === 100 ? "terminated" : "non terminated"}</Text> */}
                            {/* <Icon as={FaCheckCircle} color={progress === 100 ? "green" : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} /> */}




                            {/* 
                            <Flex ml={1} mt={5}>
                                <Rating defaultValue={getRating} maxStars={5} messages={rate} />

                              
                            </Flex> */}

                            {/* <Flex justify="space-between" alignItems="center">

                                <Box mt={7} textAlign="left" w="40%">
                                    <Button bg={'transparent'} leftIcon={<RepeatIcon fontSize={25} />} onClick={handleRefresh}></Button>

                                    {feedback.map((feed, index) => {
                                        return apprenants.map((app, k) => {
                                            if (feed.id_module === location.state.idmodule && feed.apprenant === app.id) {

                                                let dt = new Date(feed.created_at).toLocaleTimeString('fr-FR')
                                                let dtd = new Date(feed.created_at).toLocaleDateString('fr-FR')

                                                return < ChatMessage key={index} message={feed.message} time={feed.created_at} avt={app.image} sender={app.first_name + " " + app.last_name} like={feed.like} />;
                                            }
                                        })
                                    })}
                                </Box>
                                <Box
                                    display={isNotSmallerScreen ? "block" : "none"}
                                    w="50%" h="auto">

                                    <Lottie height={'100%'} width={'100%'} options={defaultOpt} />
                                </Box>
                            </Flex> */}
                        </Box>
                    </Box>

                    {

                        progvid === 100 ? toast({
                            title: 'Terminé',
                            description: "Video completé avec succes !",
                            status: 'info',
                            position: 'top-right',
                            duration: 5000,
                            isClosable: true,
                        }) : null

                    }

                </Box>
            </Flex>

        </>

    );
})
