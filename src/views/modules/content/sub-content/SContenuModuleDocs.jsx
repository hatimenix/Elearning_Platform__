import { Box, Button, Flex, Icon, Text, useToast } from '@chakra-ui/react';


import React, { useEffect, useState } from 'react';



import { FaArrowCircleLeft, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';


import { pdfjs } from 'react-pdf';


import { useLocation, useNavigate } from 'react-router-dom';


import axiosClient from '../../../../axios-client';


import { useStateContext } from '../../../../context/ContextProvider';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;






export default function SContenuModuleDocs({ idmed, idmod, showButton, goBack }) {


    const toast = useToast()


    const [numPages, setNumPages] = useState(null);


    const [pageNumber, setPageNumber] = useState(1);


    const location = useLocation()


    const [docs, setDocs] = useState([]);


    const [media, setMedia] = useState([]);


    const [pmc, setProgModContent] = useState([]);


    const [progres, setProgres] = useState([]);


    const [progressId, setProgressId] = useState()


    const { user, setUser } = useStateContext();


    const progress = 100 / location.state.chapcount


    useEffect(() => {


        axiosClient.get('auth/user/')


            .then(({ data }) => {


                setUser(data)


                console.log()


            })


    }, [])


    const [idA, setIdA] = useState(null)


    useEffect(() => {


        if (user && user.id) {


            setIdA(user.id)


        }


    }, [user])


    function onDocumentLoadSuccess({ numPages }) {


        setNumPages(numPages);


    }


    function goToPreviousPage() {


        if (pageNumber > 1) {


            setPageNumber(pageNumber - 1);


        }


    }


    function goToNextPage() {


        if (pageNumber < numPages) {


            setPageNumber(pageNumber + 1);


        }


    }


    useEffect(() => {


        axiosClient.get('docs/')


            .then((res) => {


                setDocs(res.data)


            })


    }, [])


    useEffect(() => {


        axiosClient.get('media/')


            .then((res) => {


                setMedia(res.data)


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


                setProgres(res.data)


            })


    }, [])


    const mod = location.state.idmodule || idmod



    useEffect(() => {


        axiosClient.get(`progres/geProgress/?idModule=${location.state.idmodule}&idApprennant=${user.id}`)


            .then((res) => {


                setProgressId(res.data)


            })


    }, [])


    const mediaCountLength = count();












    function count() {


        const mediaCount = [];


        media.forEach((m) => {


            if (m.module === location.state.idchapitre) {



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


    const checkPassed = (idMedia, idApp) => {
        const handleButtonClick = (val) => {
            axiosClient
                .put(`progressmodcontent/${val.id}/`, {
                    etat: true,
                    media: idMedia,
                    apprenant: user.id
                })
                .then(() => {

                    const promises = [];

                    if ('status' in progressId) {
                        const formData = new FormData();
                        formData.append('progres', progress);
                        formData.append('module', location.state.idmodule);
                        formData.append('apprenant', user.id);

                        promises.push(axiosClient.post('progres/', formData));

                        toast({
                            title: 'Terminé!',
                            position: 'top-right',
                            isClosable: true
                        });

                    }

                    progres.forEach((prog) => {
                        if (prog.module === location.state.idmodule && prog.apprenant === user.id) {
                            prog.progres += progress;
                            const formData = new FormData();
                            formData.append('progres', prog.progres);

                            promises.push(axiosClient.patch(`/progres/${prog.id}/`, formData));
                        }
                    });

                    Promise.all(promises)
                        .then((responses) => {
                            console.log(responses);
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        };


        return pmc.map((val, key) => {
            if (val.apprenant === idApp && val.media === idMedia) {
                if (val.etat) {
                    return (
                        <>
                            <Button isDisabled bg={"green"}>
                                <Flex alignItems="center">
                                    <Icon color={"white"} as={FaCheckCircle} mr="2" />
                                    <Text color={"white"}>terminé</Text>
                                </Flex>
                            </Button>


                            {/* {goBack ? (
                                <Button ml={3} px={{ base: '4', md: '6' }} onClick={() => nav(-1)} >
                                    <Flex alignItems="center">
                                        <Icon as={FaArrowLeft} mr="2" />
                                        <Text>Retour</Text>
                                    </Flex>
                                </Button>) : (
                                <Text></Text>)} */}
                        </>
                    );
                }
                if (val.etat === false) {
                    return (
                        <Button bg={"#FFD24C"} onClick={() => handleButtonClick(val)}>
                            Marquer comme terminé
                        </Button>
                    );
                }
            }
            return null;
        });
    };






    const nav = useNavigate()


    return (

        <>

            <Flex justifyContent={'flex-end'}>



                {showButton ? (
                    <Button mt={"5px"} bg={"#089bd7"} px={{ base: '4', md: '6' }} width={"10%"} onClick={() => nav((-1))}>
                        <Flex alignItems="center">
                            <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                            <Text color={'#ffd140'}>Retour</Text>
                        </Flex>
                    </Button>) : (
                    <Text></Text>
                )}
            </Flex>




            <Flex mt={"10px"} w="100%" h="100%">


                {docs.map((val, key) => {



                    if (val.id === location.state.idm || val.id === idmed) {


                        return (


                            <>










                                <Flex w="full" direction="column">


                                    <Box height="600px" >


                                        {val.typeDoc === "fichier" &&


                                            <iframe


                                                src={val.file}


                                                title="PDF Viewer"


                                                width="100%"


                                                height="100%"


                                                frameBorder="0"


                                            >


                                            </iframe>


                                        }


                                        {val.typeDoc === "lien" &&


                                            <iframe


                                                src={val.lienPPT}


                                                title="PDF Viewer"


                                                width="100%"


                                                height="100%"


                                                frameBorder="0"


                                            >


                                            </iframe>


                                        }




                                    </Box>


                                    <Flex justifyContent="end" mr="3" mt="40px">


                                        {checkPassed(val.id, user.id)}



                                    </Flex>



                                </Flex>




                            </>


                        )


                    }


                })}


            </Flex>
        </>

    )


}
