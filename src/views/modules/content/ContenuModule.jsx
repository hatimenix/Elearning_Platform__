import { Box, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { AiFillFileZip, AiOutlineLink } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdOndemandVideo, MdQuiz } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";

import Lottie from "react-lottie";
import bookData from '../../../assets/lot/book2.json';

const defaultOpt = {
    loop: true,
    autoplay: true,
    animationData: bookData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

function ContenuModule() {

    const location = useLocation()


    const [listModule, setListModule] = useState([])
    const [listAcces, setListAcces] = useState([])
    const [listApprenant, setListApprenant] = useState([])
    const [listProgres, setListProgres] = useState([])

    const [idApprenant, setIdApprenant] = useState('')

    const [formation, setFormation] = useState([])
    const [docs, setDocs] = useState([])
    const [videos, setVideos] = useState([])
    const [tests, setTests] = useState([])

    const [medias, setMedias] = useState([])
    const [listModuleOfFormation, setListModuleOfFormation] = useState([])


    const [currentModule, setCurrentModule] = useState("")
    const [pmc, setProgModContent] = useState([]);


    const navigate = useNavigate();

    const [prog, setProg] = useState(0)
    const [link, setLink] = useState([])


    useEffect(() => {
        axiosClient.get('formation/')
            .then((res) => {
                setFormation(res.data)

            })

    }, [])








    useEffect(() => {
        axiosClient.get('module/')
            .then((res) => {
                setListModuleOfFormation(res.data)
            })
    }, [])


    useEffect(() => {
        axiosClient.get('media/')
            .then((res) => {
                setMedias(res.data)
            })
    }, [])


    useEffect(() => {
        axiosClient.get('docs/')
            .then((res) => {
                setDocs(res.data)
            })
    }, [])


    useEffect(() => {
        axiosClient.get('videos/')
            .then((res) => {
                setVideos(res.data)
            })
    }, [])


    useEffect(() => {
        axiosClient.get('test/')
            .then((res) => {
                setTests(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('progres/')
            .then((res) => setListProgres(res.data))
    }, [])


    useEffect(() => {
        axiosClient.get('link/')
            .then((res) => setLink(res.data))
    }, [])

    useEffect(() => {
        axiosClient.get('progressmodcontent/')
            .then((res) => {
                setProgModContent(res.data)
            })
    }, [])


    function openModuleSubContent(ids, idmod, titre, titreFormation, idMedia) {
        navigate('/submodcontent', {
            state: {
                id: ids,
                idmodule: idmod,
                tm: titre,
                tf: titreFormation,
                idm: idMedia
            }
        })
    }
    function openModuleSubContentDoc(ids, idmod, titre, titreFormation, idMedia) {
        navigate('/submodcontentdoc', {
            state: {
                id: ids,
                idmodule: idmod,
                tm: titre,
                tf: titreFormation,
                idm: idMedia
            }
        })
    }

    function openModuleSubContentPPT(ids, idmod, titre, titreFormation, idMedia) {
        navigate('/submodcontentppt', {
            state: {
                id: ids,
                idmodule: idmod,
                tm: titre,
                tf: titreFormation,
                idm: idMedia
            }
        })
    }

    function setProgresValue(progress) {
        setProg(progress)
    }


    const testActivated = listProgres.map((progress, key) => {
        return tests.map((test, key) => {
            if (progress.module === location.state.id && progress.module === test.idModule) {
                if (progress.progres === 100) {
                    return (
                        <Stack key={key}
                            h={{ base: "90px", md: "60px" }}
                            w={{ base: "90%", md: "80%" }}
                            borderRadius="lg"
                            border="1px solid rgba(0, 0, 0, 0.25)"
                            p={4}
                            mb={3}
                            direction="row"
                            alignItems="center" >




                            <Icon as={FaCheckCircle} color={test.checked === true ? " green" : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />
                            <Icon as={MdQuiz} color="black" h="32px" w="32px" />
                            <Box flexGrow={1} display="flex" >

                                <Box ml={{ base: "10px", md: "30px" }}>                                            {test.titre}
                                </Box>
                            </Box>
                            <Button w="80px" color="#fff" bg="#10316B" onClick={() => navigate(`/test/${test.id}`)}>Acces</Button>
                        </Stack>
                    )
                } else {
                    return (
                        <Stack
                            key={key}
                            h={{ base: "90px", md: "60px" }}
                            w={{ base: "90%", md: "80%" }}
                            borderRadius="lg"
                            border="1px solid rgba(0, 0, 0, 0.25)"
                            p={4}
                            mb={3}
                            direction="row"
                            alignItems="center"
                            bg="gray.100" // set the background color to a light gray
                            opacity={0.5} // set the opacity to 0.5 to make it semi-transparent
                            cursor="not-allowed" // set the cursor to 'not-allowed' to indicate that it's disabled
                        >
                            <Icon as={FaCheckCircle} color="gray.400" h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />
                            <Icon as={MdQuiz} color="gray.400" h="32px" w="32px" />
                            <Box flexGrow={1} display="flex" >
                                <Box ml={{ base: "10px", md: "30px" }}>
                                    {test.titre}
                                </Box>
                            </Box>
                            <Button w="80px" isDisabled color="gray.400" bg="gray.500" cursor="not-allowed">Acces</Button>
                        </Stack>






                    )
                }
            }
        })
    });


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

    function LinkButton({ href, children }) {
        const handleClick = () => {
            window.open(href, "_blank");
        };

        return (
            <Button color="#fff" bg="#10316B" onClick={handleClick}>
                {children}
            </Button>
        );
    }




    return (
        <>

            <Box>
                <Flex mt={6}>
                    <Box display="flex" justifyContent="flex-start">

                        <Flex alignItems="center">
                            <Lottie height={90} width={90} options={defaultOpt} />
                            <Text ml={2} color={"#1A365D"} mt={2} fontWeight={"bold"} fontSize={"28px"}>Module {location.state.titre}</Text>
                        </Flex>
                    </Box>
                </Flex>
                <Flex
                    flexDirection="column" w="full" align="center" justify="center" >


                    {sortedMedias.map((media, key) => {
                        return pmc.map((p, key) => {
                            if (media.id === p.media) {
                                if (media.module === location.state.id) {

                                    if (media.type === "Video") {
                                        return (
                                            <Stack key={key} h={{ base: "90px", md: "60px" }} w={{ base: "90%", md: "80%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center">
                                                <Icon as={FaCheckCircle} color={p.etat === true ? "green" : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />
                                                <Icon as={media.type === 'Video' ? MdOndemandVideo : media.type === 'Link' ? AiOutlineLink : AiFillFileZip} color="black" h="32px" w="32px" />
                                                <Box flexGrow={1} display="flex" >
                                                    <Box ml={{ base: "10px", md: "30px" }}>
                                                        {media.name}
                                                    </Box>
                                                </Box>
                                                <Button w="80px" onClick={() => openModuleSubContent(location.state.idf, location.state.id, location.state.titreF, location.state.titre, media.id)} color="#fff" bg="#10316B">Acces</Button>

                                            </Stack>
                                        )
                                    }
                                    if (media.type === "PDF") {
                                        return (
                                            <Stack key={key} h={{ base: "90px", md: "60px" }} w={{ base: "90%", md: "80%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center">
                                                <Icon as={FaCheckCircle} color={p.etat === true ? "green" : "grey"} h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />
                                                <Icon as={media.type === 'Video' ? MdOndemandVideo : media.type === 'Link' ? AiOutlineLink : AiFillFileZip} color="black" h="32px" w="32px" />
                                                <Box flexGrow={1} display="flex" >
                                                    <Box ml={{ base: "10px", md: "30px" }}>
                                                        {media.name}
                                                    </Box>
                                                </Box>
                                                <Button w="80px" onClick={() => openModuleSubContentDoc(location.state.idf, location.state.id, location.state.titreF, location.state.titre, media.id)} color="#fff" bg="#10316B">Acces</Button>


                                            </Stack>
                                        )
                                    }




                                }
                            }
                        })
                    })}

                    {link.map((l, key) => {
                        if (l.module === location.state.id) {
                            return (
                                <Stack key={key} h={{ base: "90px", md: "60px" }} w={{ base: "90%", md: "80%" }} borderRadius="lg" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" border="1px solid rgba(0, 0, 0, 0.25)" p={4} mb={3} direction="row" alignItems="center">




                                    <Icon as={FaCheckCircle} color="grey" h="32px" w="32px" mr={{ base: "20px", md: "60px" }} />
                                    <Icon as={AiOutlineLink} color="black" h="32px" w="32px" />
                                    <Box flexGrow={1} display="flex" >
                                        <Box ml={{ base: "10px", md: "30px" }}>
                                            {l.link}
                                        </Box>
                                    </Box>
                                    <LinkButton href={`http://${l.link}`} onClick={(e) => { e.preventDefault(); window.open(`http://${l.link}`, '_blank'); }}>
                                        Access
                                    </LinkButton>
                                </Stack>

                            )
                        }
                    })}

                    {testActivated}


                </Flex>
            </Box>
        </>

    );
}

export default ContenuModule;
