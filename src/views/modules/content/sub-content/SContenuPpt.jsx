import { Box, Button, Flex, IconButton, Text, useToast, Stack, Icon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import Embed from 'react-embed';

import { Document, Page, pdfjs } from 'react-pdf';
import file from '../../../../assets/file.pdf';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from '../../../../axios-client';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaArrowCircleLeft, FaCheckCircle } from 'react-icons/fa';
import { useStateContext } from '../../../../context/ContextProvider';

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";





export default function SContenuPpt() {

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

            })
    }, [])
    const [idA, setIdA] = useState(null)

    useEffect(() => {
        if (user && user.id) {
            setIdA(user.id)
        }
    }, [user])

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



    useEffect(() => {
        axiosClient.get(`progres/geProgress/?idModule=${location.state.idmodule}&idApprennant=${user.id}`)
            .then((res) => {
                setProgressId(res.data)
            })
    }, [])














    const checkPassed = (idMedia, idApp) => {
        const handleButtonClick = (val) => {
            axiosClient
                .put(`progressmodcontent/${val.id}/`, {
                    etat: true,
                    media: idMedia,
                    apprenant: user.id
                })
                .then(() => {
                    toast({
                        title: 'Terminé!',
                        position: 'top-right',
                        isClosable: true
                    });

                    const promises = [];

                    if ('status' in progressId) {
                        const formData = new FormData();
                        formData.append('progres', progress);
                        formData.append('module', location.state.idmodule);
                        formData.append('apprenant', user.id);

                        promises.push(axiosClient.post('progres/', formData));
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
                        <Button isDisabled bg={"green"}>
                            <Flex alignItems="center">
                                <Icon color={"white"} as={FaCheckCircle} mr="2" />
                                <Text color={"white"}>terminé</Text>
                            </Flex>
                        </Button>
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



    const docss = [
        {
            uri: "https://api.paiperleckelearning.com/media/uploads/docs/industry_4.0-Revolution-PowerPoint-Templates.pptx"
            ,
            fileType: "ppt"
        } // Remote file
    ];

    const nav = useNavigate()

    return (



        <>

            <Flex justifyContent={'flex-end'}>
                <Button bg={"#089bd7"} px={{ base: '4', md: '6' }} width={"10%"} onClick={() => nav((-1))}>
                    <Flex alignItems="center">
                        <Icon color={'#ffd140'} as={FaArrowCircleLeft} mr="2" />
                        <Text color={'#ffd140'}>Retour</Text>
                    </Flex>
                </Button>
            </Flex>

            <Box mt={"10px"} w="100%" h="630px">

                {docs.map((val, key) => {


                    if (val.id === location.state.idm) {

                        return (
                            <>
                                {val.typeDoc === "fichier" ? (
                                    <>
                                        <DocViewer documents={[{
                                            // uri: val.file
                                            uri: val.file,

                                            fileType: "ppt"
                                        }]} pluginRenderers={DocViewerRenderers} />
                                    </>
                                ) : val.typeDoc === "lien" ? (
                                    <>
                                        <iframe
                                            src={val.lienPPT}
                                            title="PDF Viewer"
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                        ></iframe>


                                    </>
                                ) : null}
                                <Flex justifyContent="end" mr="3" mt="10px">
                                    {checkPassed(val.id, user.id)}
                                </Flex>
                            </>
                        );

                    }

                })}
            </Box>
        </>
    )
}
