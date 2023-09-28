import { Box, Button, Flex, Icon, Spacer, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'


import { AiOutlineFileZip } from 'react-icons/ai'
import { MdOndemandVideo } from 'react-icons/md'

import { GrChapterAdd } from 'react-icons/gr'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosClient from '../../../../axios-client'
import { useStateContext } from '../../../../context/ContextProvider'
import { Submodcontent } from './SContenuModule'
import SContenuModuleDocs from './SContenuModuleDocs'
import { FaArrowCircleLeft, FaArrowCircleRight, FaCheckCircle } from 'react-icons/fa'

export default function TabbedContent() {

    const { user, setUser } = useStateContext();

    const [chaps, setChaps] = useState([])
    const [meds, setMeds] = useState([])
    const [pmc, setPmc] = useState([])
    const nav = useNavigate()
    const [indexMedia, setIndexMedia] = useState(0)
    const [currentTabs, setCurrentTabs] = useState({});
    const location = useLocation()

    console.log("mod id", location.state.idmodule);
    const allTabPanels = chaps.flatMap((val) => {
        if (val.module === location.state.idmodule && val.id === location.state.idchapitre) {
            const videoTabs = [];
            const docTabs = [];
            let index_video = -1;
            meds.forEach((media) => {
                pmc.forEach((p) => {
                    if (media.id === p.media && p.apprenant === user.id && media.chapitre === val.id) {
                        if (media.type === 'Video') {
                            index_video++;
                            videoTabs.push(
                                <TabPanel key={media.id}>
                                    <Submodcontent showButton={true} i={location.state.idv[index_video]} />
                                </TabPanel>
                            );
                        } else if (media.type === 'PDF') {
                            docTabs.push(
                                <TabPanel key={media.id}>
                                    <SContenuModuleDocs goBack={false} showButton={true} idmed={media.id} idmod={location.state.idmodule} />
                                </TabPanel>
                            );
                        }
                    }
                });
            });

            // Concatenate videoTabs and docTabs arrays to maintain the desired order
            return [...videoTabs, ...docTabs];
        } else {
            return [];
        }
    });

    const currentTab = currentTabs[location.state.idmodule] || indexMedia;



    const handleNextButtonClick = () => {
        const totalTabs = allTabPanels.length;

        // Check if it's the last tab for the current module
        if (currentTab === totalTabs - 1) {
            return
        } else {
            // If it's not the last tab, navigate to the next tab
            setCurrentTabs((prevTabs) => ({
                ...prevTabs,
                [location.state.idmodule]: currentTab + 1,
            }));
        }
    };


    const handleGoBackButtonClick = () => {


        // Check if it's the first tab for the current module
        if (currentTab === 0) {
            // If it's the first tab, show an alert instead of going back
            return;
        }

        // If it's not the first tab, navigate to the previous tab
        setCurrentTabs((prevTabs) => ({
            ...prevTabs,
            [location.state.idmodule]: currentTab - 1,
        }));
    };

    // Check if it's the last tab for the current module
    const isLastTab = currentTab === allTabPanels.length - 1;

    useEffect(() => {
        if (isLastTab) {
            // Perform your desired action when in the last tab
            console.log('Last tab reached!');
        }
    }, [isLastTab]);



    useEffect(() => {
        if (chaps.length === 0) {
            axiosClient.get('chapitre/')
                .then((res) => {
                    setChaps(res.data)
                })

        }
    }, [])

    useEffect(() => {
        axiosClient.get('progressmodcontent/')
            .then((res) => {
                setPmc(res.data)
            })
    }, [])

    useEffect(() => {
        axiosClient.get('media/')
            .then((res) => {
                setMeds(res.data)
            })
    }, [])



    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])






    const [isReady, setIsReady] = useState(false);


    useEffect(() => {
        chaps.forEach((val, ckey) => {
            if (val.module === location.state.idmodule && val.id === location.state.idchapitre) {
                let j = -1;

                meds.forEach((media) => {
                    pmc.forEach((p, key) => {
                        if (media.id === p.media && p.apprenant === user.id && media.chapitre === val.id) {
                            if (media.type === "Video") {
                                j++;
                                // console.log("j++", j);

                                if (p.media === location.state.idm) {
                                    // console.log("j", location.state.idm, j);
                                    setIndexMedia(j);
                                    setIsReady(true);
                                }
                            }
                        }
                    });
                });
            }
        });
    }, [chaps, meds, pmc, location, user]);



    if (!isReady) {
        return null; // Render a loading state or placeholder if the indexMedia is not ready yet
    }


    function getChapitreName() {
        let chap_name
        chaps.map((c, k) => {
            if (c.id === location.state.idchapitre)
                chap_name = c.name
        })
        return chap_name
    }



    function mediasCp() {

        let medias = []
        chaps.map((val, key) => {
            if (val.module === location.state.idmodule) {
                meds.map((media) => {
                    pmc.map((p, k) => {
                        if (p.media === media.id && media.chapitre === val.id && val.id === location.state.idchapitre) {

                            medias.push(media.name)
                        }
                    })



                })
            }
        })
        return medias

    }






    return (
        <Stack>


            {/* <Flex justifyContent={'flex-end'}>
                <Button bg={"#089bd7"} px={{ base: '4', md: '6' }} width={"10%"} onClick={() => nav((-1))}>
                    <Flex alignItems="center">
                        <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                        <Text color={'#ffd140'}>Retour</Text>
                    </Flex>
                </Button>
            </Flex> */}


            <Tabs >
                <TabList>
                    {chaps.map((val, ckey) => {
                        if (val.module === location.state.idmodule && val.id === location.state.idchapitre) {
                            return (
                                <Tab _selected={{ color: "white", bg: "#089bd7" }}>
                                    <Box display="flex" alignItems="center">
                                        <GrChapterAdd size={18} style={{ marginRight: "0.5rem" }} />
                                        Chapitre : {val.name}
                                    </Box>


                                </Tab>

                            )
                        }
                    })}
                </TabList>

                <Box display="flex" justifyContent="flex-end">


                    <Button mt={"5px"} mr={"8px"} bg={'#089bd7'} px={{ base: '2', md: '2' }} onClick={() => nav((-1))}>
                        <Flex alignItems="center">
                            <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                            <Text color={'#ffd140'}>Retour</Text>
                        </Flex>
                    </Button>
                </Box>



                {/* 
                <Box mt="6" px="4" justifyContent="center" display="flex">
                    <Button
                        onClick={handleNextButtonClick}
                        bg="blue.500"
                        color="white"
                        _hover={{ bg: 'blue.600' }}
                        _active={{ bg: 'blue.700' }}
                        disabled={currentTab === allTabPanels.length - 1}
                    >
                        Suivant
                    </Button>
                </Box> */}

                <TabPanels>
                    <TabPanel>
                        {/* {console.log("Index media hh", indexMedia)
                        } */}
                        <Tabs defaultIndex={indexMedia} // Set the initial active tab when the component mounts
                            index={currentTab} // Control the active tab dynamically
                            onChange={(index) =>
                                setCurrentTabs((prevTabs) => ({
                                    ...prevTabs,
                                    [location.state.idmodule]: index,
                                }))
                            } isLazy>
                            <TabList
                                as={Box}
                                overflowX="auto"
                                whiteSpace="nowrap"
                                py="2"
                                px="4"
                                borderBottom="1px solid"
                                borderColor="gray.200"

                                sx={{
                                    "&::-webkit-scrollbar": {
                                        height: "6px",
                                        borderRadius: "6px",
                                        backgroundColor: "gray.300",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                        backgroundColor: "#089bd7",
                                        borderRadius: "6px",
                                    },
                                }}
                            >
                                {chaps.map((val, ckey) => {
                                    if (val.module === location.state.idmodule && val.id === location.state.idchapitre) {
                                        const videoTabs = [];
                                        const docTabs = [];

                                        meds.forEach((media) => {
                                            pmc.forEach((p, key) => {
                                                if (media.id === p.media && p.apprenant === user.id && media.chapitre === val.id) {
                                                    if (media.type === "Video") {
                                                        videoTabs.push(
                                                            <Tab key={media.id} _selected={{ color: "white", bg: "#089bd7" }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <MdOndemandVideo size={18} style={{ marginRight: "0.5rem" }} />
                                                                    {media.name}
                                                                </Box>
                                                            </Tab>
                                                        );
                                                    } else if (media.type === "PDF") {
                                                        docTabs.push(
                                                            <Tab key={media.id} _selected={{ color: "white", bg: "#3182ce" }}>
                                                                <Box display="flex" alignItems="center">
                                                                    <AiOutlineFileZip size={18} style={{ marginRight: "0.5rem" }} />
                                                                    {media.name}
                                                                </Box>
                                                            </Tab>
                                                        );
                                                    }
                                                }
                                            });
                                        });

                                        // Concatenate videoTabs and docTabs arrays to maintain the desired order
                                        const allTabs = [...videoTabs, ...docTabs];

                                        return allTabs;
                                    }
                                })}
                            </TabList>

                            <Box display="flex" justifyContent="flex-end">

                                {currentTab > 0 && (
                                    <Button mt={"5px"} mr={"8px"} bg={'#089bd7'} px={{ base: '2', md: '2' }} onClick={handleGoBackButtonClick} disabled={currentTab === 0} >
                                        <Flex alignItems="center">
                                            <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                                            <Text color={'#ffd140'}>Précedent</Text>
                                        </Flex>
                                    </Button>
                                )}

                                {!isLastTab && (
                                    <Button mt={"5px"} bg={'#089bd7'} px={{ base: '2', md: '2' }} onClick={handleNextButtonClick} disabled={currentTab === allTabPanels.length - 1} >
                                        <Flex alignItems="center">
                                            <Text color={'#ffd140'}>Suivant  </Text>
                                            <p>&nbsp;&nbsp;&nbsp;</p>
                                            <Icon color={'#ffd140'} as={FaArrowCircleRight} mr="2" />

                                        </Flex>
                                    </Button>


                                )}
                            </Box>





                            <TabPanels>
                                {chaps.map((val, ckey) => {
                                    if (val.module === location.state.idmodule && val.id === location.state.idchapitre) {
                                        const videoTabs = [];
                                        const docTabs = [];
                                        let index_video = -1
                                        meds.forEach((media) => {
                                            pmc.forEach((p, key) => {
                                                if (media.id === p.media && p.apprenant === user.id && media.chapitre === val.id) {
                                                    if (media.type === "Video") {
                                                        index_video++
                                                        videoTabs.push(
                                                            <TabPanel key={media.id}>

                                                                <Submodcontent showButton={true} i={location.state.idv[index_video]} />
                                                            </TabPanel>
                                                        );
                                                    } else if (media.type === "PDF") {
                                                        docTabs.push(
                                                            <TabPanel key={media.id}>

                                                                <SContenuModuleDocs goBack={false} showButton={false} idmed={media.id} idmod={location.state.idmodule} />
                                                            </TabPanel>
                                                        );
                                                    }
                                                }
                                            });
                                        });

                                        // Concatenate videoTabs and docTabs arrays to maintain the desired order
                                        const allTabPanels = [...videoTabs, ...docTabs];

                                        return allTabPanels;
                                    }
                                })}
                            </TabPanels>



                        </Tabs>


                    </TabPanel>

                </TabPanels>
            </Tabs>


        </Stack>
    )
}
