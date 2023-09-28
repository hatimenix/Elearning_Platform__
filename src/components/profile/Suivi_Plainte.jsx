import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { GrAdd } from 'react-icons/gr';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineEye } from 'react-icons/ai';
import { createRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../../assets/lot/suivi.json';
import React from 'react';
import { FcLock } from 'react-icons/fc';
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import MyPagination from "../MyPagination";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import img3 from '../../assets/img/3.png';
import empty from '../../assets/img/empty.png';



import {
    Box,
    Flex,
    useColorModeValue,
    Stack,
    Heading,
    Image,
    Text,
    Button,
    Badge,
    Spacer,
    InputGroup,
    InputLeftElement,
    Input,
    Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    IconButton,
    FormControl,
    Textarea,
    Toast,
    useToast,
    FormLabel,
    Select,
    Alert,
    AlertIcon

} from '@chakra-ui/react';
const PAGE_SIZE = 4;
const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};
function Suivi_Plainte() {
    // current user
    const { user } = useStateContext();

    //data
    const [plainteCategory, setPlainteCategory] = useState('')
    const [plainteSujet, setPlainteSujet] = useState('')
    const [plainteContent, setPlainteContent] = useState('')


    const [changeModal, setChangeModal] = useState(true);
    const [reponseApprenant, setReponseApprenant] = useState('')
    const [oldReponseApprenant, setOldReponseApprenant] = useState('')
    const [resUserByWho, setResUserByWho] = useState('')
    const [userTime, setUserTime] = useState('')
    const [resByWho, setResByWho] = useState('')
    const [time, setTime] = useState('')

    const [message, setmessage] = useState('')
    const handleCategoryChange = (ev) => {
        setPlainteCategory(ev.target.value)
    }

    const [selectedUrgence, setSelectedUrgence] = useState('');

    //search variable
    const [searchTerm, setSearchTerm] = useState('');
    const [plaintes, setPlaintes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const toast = useToast()
    const [selectedEtat, setSelectedEtat] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const myColor = useColorModeValue("gray.50", "gray.700");
    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [id, setId] = useState(null);
    const [reponse, setReponse] = useState('');


    // // current user data
    // useEffect(() => {
    //     axiosClient.get('auth/user/')
    //         .then(({ data }) => {
    //             setUser(data)
    //         })
    // }, [])
    //search method
    const filteredData = useCallback(() => {
        return plaintes.filter((row) => {
            const booleanField = row.etat ? "reglée" : "encours";
            return row.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booleanField.toLowerCase().includes(searchTerm.toLowerCase())

        });
    }, [plaintes, searchTerm ,user.id]);

    useEffect(() => {
        axiosClient.get(`plainte/?search=${user.id}`)
            .then((res) => {
                setPlaintes(res.data)
                let filteredData = res.data;
                if (selectedEtat !== null) {
                    filteredData = filteredData.filter((item) => item.etat === selectedEtat);
                }
                if (selectedCategory !== '') {
                    filteredData = filteredData.filter((item) => item.category === selectedCategory);
                }
                if (selectedUrgence !== '') {
                    filteredData = filteredData.filter((item) => item.urgence === selectedUrgence);
                }
                setPlaintes(filteredData.sort().reverse());
            })
    }, [selectedEtat, selectedCategory ,user.id, time,userTime])

    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={5} mb={5} fontWeight={"bold"} fontSize={{ base: '2xl', sm: '4xl' }} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    function formatDateToCustomFormat(dateString) {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }


    const sendResponse = (id) => {


        const formData = new FormData()
        formData.append('responseUser', reponseApprenant)
        formData.append("responseUserbywho", user.first_name + ' ' + user.last_name);
        function formatDateTime(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        formData.append("responseUsertime", formatDateTime(new Date()));

        if (reponseApprenant.trim() === "") {
            setmessage('Veuillez entrer une réponse')
            return
        }

        axiosClient.patch(`/plainte/${id}/`, formData)
            .then(() => {
                setPlaintes(rows => rows.map((row => {
                    if (row.id === id) {
                        return {
                            ...row,
                            responseUser: reponseApprenant,
                            responseUsertime: formatDateTime(new Date()),
                            responseUserbywho: user.first_name + ' ' + user.last_name,
                            responsetime : row.responsetime,  
                        }
                    }
                    return row
                })))
                toast({
                    description: "votre réponse est envoyée avec succès",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                setUserTime('')
            }
            )
            .catch(error => console.error(error));
        onClose()
    }
    const handleSubmit = (event) => {
        // if (!plainteData.content || !plainteData.sujet || !plainteCategory) {
        //   setMessage("Veuillez remplire les champs");
        //   return;
        // }
        event.preventDefault();

        const formData = new FormData();
        formData.append("content", plainteContent);
        formData.append("sujet", plainteSujet);
        formData.append("category", plainteCategory);



        axiosClient.put(`/plainte/`, formData)
            .then(() => {

                toast({
                    description: "votre message est modifié avec succès",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                })
                navigate("/tickets")
            }


            )
            .catch(error => console.error(error));
        
    };
    return (
        <Box >

            <Flex direction={{ base: 'column', md: 'row' }} justifyContent={'space-between'} >
                <Heading m={5} bgGradient='linear(to-l, #ffd140, #089bd7)' bgClip='text' fontSize={{ base: '2xl', sm: '4xl' }}>
                    Mes tickets
                </Heading>
                {/* Search input */}
                <Flex
                    alignItems="center"
                >
                    <InputGroup w='100%'>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input
                            placeholder="Recherche..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            bg={useColorModeValue('white', 'gray.700')}
                            sx={{
                                marginLeft: 'auto',
                            }}
                        />  </InputGroup>
                    <Box
                        justify={'end'}
                        align={'end'}
                    >
                        <Button
                            ml={'3'}
                            onClick={() => navigate('/suggestion')}
                            colorScheme="blue"
                            leftIcon={<AddIcon />}>
                            Ajouter un ticket
                        </Button>
                    </Box>
                </Flex>
            </Flex>
            {/* <Flex ml={5} justify={{base:'center',md :'left' , lg:'left'}} mt={{base:"5",lg:"0"}}>
                    <Select  fontSize={{ base: 13, lg: 16 }} w={{ base: '50%', lg: '20%' }} mb={4} 
                    value={selectedEtat} onChange={(e) => setSelectedEtat(e.target.value === '' ? null : e.target.value === 'true')} >
                        <option value="">Tout</option>
                        <option value="true">Reglée</option>
                        <option value="false">En cours</option>
                    </Select>
                </Flex> */}
            <Flex ml={5} w={"70%"}>
                <Select bg={useColorModeValue("gray.50", "gray.700")} fontSize={{ base: 13, lg: 16 }} w={{ base: '70%', lg: '40%' }} mr={5} mb={4} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    <option value="technical_support">Support technique</option>
                    <option value="account_assistance">Assistance pour le compte</option>
                    <option value="course_inquiries">Demandes de renseignements sur les cours</option>
                    <option value="feedback_suggestions">Commentaires et suggestions</option>
                    <option value="content_issues">Problèmes de contenu</option>
                    <option value="general_inquiries">Demandes générales</option>
                </Select>

                <Select bg={useColorModeValue("gray.50", "gray.700")} fontSize={{ base: 13, lg: 16 }} w={{ base: '30%', lg: '15%' }} mb={4} value={selectedEtat} onChange={(e) => setSelectedEtat(e.target.value === '' ? null : e.target.value === 'true')}>
                    <option value="">Tout</option>
                    <option value="true">Reglée</option>
                    <option value="false">En cours</option>
                </Select>
                <Select bg={useColorModeValue("gray.50", "gray.700")} fontSize={{ base: 13, lg: 16 }} w={{ base: '30%', lg: '15%' }} ml={5} mb={4} value={selectedUrgence} onChange={(e) => setSelectedUrgence(e.target.value)}>
                    <option value="">Tout</option>
                    <option value="élevée">élevée</option>
                    <option value="moyenne">moyenne</option>
                    <option value="faible">faible</option>
                </Select>
            </Flex>
            <Flex
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify={{ base: 'flex-start', md: 'space-between' }}
                p={5}
            >

                <Flex
                    direction="column"
                    width={{ base: "100%", lg: "80%" }}
                    justify={{ base: 'flex-start', md: 'space-between' }}

                >

                    {filteredData().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).filter((row) => (selectedEtat === null || row.etat === selectedEtat) && (selectedCategory === '' || row.category === selectedCategory) && (selectedUrgence === '' || row.urgence === selectedUrgence)).slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
                        .map((plainte) => (

                            <Stack
                                bg={myColor}
                                mb={2}
                                rounded={'lg'}
                                p={5}
                                boxShadow={'md'}
                                alignItems={'start'}
                                justify="space-between"
                                as={"Button"}

                            >
                                <Flex direction="row"
                                    justify="space-between"
                                    ml={'auto'}
                                    width="full">
                                    <Stack direction={'row'} align={'center'}>
                                        <Text fontSize={'lg'} fontWeight="semibold">{plainte.sujet}</Text>
                                        <Stack mt={1}>
                                            <Badge
                                                rounded={'lg'}
                                                colorScheme={'blue'}
                                            >
                                                {plainte.category === "technical_support" ? "Support technique" :
                                                    plainte.category === "account_assistance" ? "Assistance pour le compte" :
                                                        plainte.category === "course_inquiries" ? "Demandes de renseignements sur les cours" :
                                                            plainte.category === "feedback_suggestions" ? "Commentaires et suggestions" :
                                                                plainte.category === "content_issues" ? "Problèmes de contenu" :
                                                                    plainte.category === "general_inquiries" ? "Demandes générales" : ""}
                                            </Badge></Stack>
                                    </Stack>
                                    <Text mt={2} fontSize={'xs'} color={'gray.500'}>{new Date(plainte.created_at).toLocaleDateString('fr-FR')}</Text>

                                </Flex>

                                <Flex
                                    direction="row"
                                    width="full"
                                    ml={'auto'}
                                    justify="space-between">
                                    <Text fontSize={{ base: 'sm' }} textAlign={'left'} w={{ base: "80%", md: "80%", lg: "85%" }}>
                                        {plainte.content}

                                    </Text>

                                    <Flex align={'center'} mt={1} direction={'column'}>
                                        <Badge
                                            mb={2}
                                            rounded={'lg'}
                                            colorScheme={!plainte.etat ? 'red' : 'green'}
                                        >
                                            {plainte.etat ? 'reglée' : 'encours'}
                                        </Badge>
                                        <Flex direction={"row"} >
                                            <AiOutlineEye fontSize={18} style={{ marginRight: "10px" }} cursor='pointer' onClick={() => {
                                                setId(plainte.id);
                                                setReponse(plainte.response);
                                                setOldReponseApprenant(plainte.responseUser)
                                                setChangeModal(true)
                                                onOpen();

                                                setResUserByWho(plainte.responseUserbywho)
                                                setUserTime(plainte.responseUsertime)

                                                setResByWho(plainte.responsebywho)
                                                setTime(plainte.responsetime)
                                            }} />
                                            {/* <FiEdit fontSize={15} cursor='pointer' onClick={() => {
                                                setChangeModal(false)
                                                onOpen();
                                            }} /> */}
                                        </Flex>


                                    </Flex>
                                </Flex>
                            </Stack>
                        ))}
                    {filteredData().length === 0 && (
                        <Flex mb={'10'} align={'center'} justify={'center'}>
                            <Image
                                height={200} width={300}
                                rounded={'md'}
                                alt={'empty'}
                                src={
                                    empty
                                }
                                objectFit={'empty'}
                            />
                        </Flex>)}
                    <MyPagination data={filteredData()} PAGE_SIZE={PAGE_SIZE} currentPage={currentPage} setCurrentPage={setCurrentPage} />

                </Flex>

                <Flex
                    w={{ base: '100%', md: '70%' }}
                    justify="center"
                    alignItems="center"
                    p={{ base: '3', md: '5' }}
                >
                    {/* <Lottie height={400} width={500} display={{ base: 'none', md: 'flex' }} options={defaultOptions} /> */}
                    <Image
                        height={400} width={400}
                        rounded={'md'}
                        alt={'feature image'}
                        src={
                            img3
                        }
                        objectFit={'cover'}
                    />
                </Flex>

            </Flex>

            {changeModal ?
                <Modal closeOnOverlayClick={reponseApprenant ? false : true} onClose={()=>{
                    setmessage('')
                    setReponseApprenant('')
                    setUserTime('')
                    onClose()
                    }} isOpen={isOpen} isCentered>
                    <ModalOverlay />
                    <ModalContent >
                        <ModalHeader>Réponse</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {message &&
                                <Alert status='error' rounded="md">
                                    <AlertIcon />
                                    {message}
                                </Alert>
                            }
                            {reponse ?
                                <FormControl>
                                    {
                                        <>
                                            {formatDateToCustomFormat(time) < formatDateToCustomFormat(userTime) ?
                                            <>

                                                <Flex direction={"column"} >
                                                    <Text ml={2} fontSize={"xs"}>{resByWho} </Text>
                                                    <Flex bg="gray.100" color="black" rounded="2xl" padding={2} w="50%" justifyContent="start">{reponse}</Flex>
                                                    <Text w={"50%"} align={"end"} fontSize={10}>{formatDateToCustomFormat(time)} </Text>
                                                </Flex>
                                                {oldReponseApprenant ? <Flex w="100%" justifyContent="end" alignItems="right">

                                                    <Flex direction={"column"} justifyContent="end" w={"50%"} >
                                                        <Text ml={2} fontSize={"xs"}>{resUserByWho} </Text>
                                                        <Flex bg="green.100" color="black" rounded="2xl" padding={2} justifyContent="end">
                                                            <Text w="100%">{oldReponseApprenant}</Text>
                                                        </Flex>
                                                        <Text align={"end"} fontSize={10}>{formatDateToCustomFormat(userTime)}</Text>

                                                    </Flex>
                                                </Flex> : null}

                                            </> :
                                            
                                            <>

                                               
                                                {oldReponseApprenant ? <Flex w="100%" justifyContent="end" alignItems="right">

                                                    <Flex direction={"column"} justifyContent="end" w={"50%"} >
                                                        <Text ml={2} fontSize={"xs"}>{resUserByWho} </Text>
                                                        <Flex bg="green.100" color="black" rounded="2xl" padding={2} justifyContent="end">
                                                            <Text w="100%">{oldReponseApprenant}</Text>
                                                        </Flex>
                                                        <Text align={"end"} fontSize={10}>{formatDateToCustomFormat(userTime)}</Text>

                                                    </Flex>
                                                </Flex> : null}
                                                <Flex direction={"column"} >
                                                    <Text ml={2} fontSize={"xs"}>{resByWho} </Text>
                                                    <Flex bg="gray.100" color="black" rounded="2xl" padding={2} w="50%" justifyContent="start">{reponse}</Flex>
                                                    <Text w={"50%"} align={"end"} fontSize={10}>{formatDateToCustomFormat(time)} </Text>
                                                </Flex>

                                            </>}

                                        </>
                                    }
                                    <Input mt={5} maxLength={250}
                                        borderColor="gray.300"
                                        _hover={{
                                            borderRadius: 'gray.300',
                                        }}
                                        onChange={e => setReponseApprenant(e.target.value)}
                                        name="reponseApprenant"
                                        placeholder="Ecrivez votre réponse"></Input>

                                </FormControl>
                                : "il n'y a pas encore de réponse"}

                        </ModalBody>
                        <ModalFooter>

                            {reponse &&
                                (reponseApprenant ? <Button onClick={() => sendResponse(id)}>Envoyer</Button> : <Button isDisabled>Envoyer</Button>)
                            }
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                :

                <Modal
                    onClose={onClose} isOpen={isOpen} isCentered
                >
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modifier le ticket</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl id="sujet" isRequired >
                                <FormLabel > Sujet</FormLabel>

                                <Input borderColor="gray.300" type="text"
                                    onChange={(e) => setPlainteSujet(e.target.value)}
                                    name="sujet" size="md" placeholder='Ecrivez votre sujet' maxLength={100} />
                            </FormControl>
                            <FormControl id="name" isRequired >
                                <FormLabel >Message</FormLabel>
                                <Textarea
                                    maxLength={250}
                                    borderColor="gray.300"

                                    h="100px"
                                    name="content"
                                    onChange={(e) => setPlainteContent(e.target.value)}
                                    placeholder="Ecrivez votre message"
                                />
                            </FormControl>
                            <Box w={{ base: '100%', md: '100%' }}>
                                <FormControl id="category" isRequired >
                                    <FormLabel >Catégorie</FormLabel>
                                    <Select

                                        borderColor="gray.300"
                                        onChange={handleCategoryChange}
                                        name="category"
                                        placeholder="Sélectionner une catégorie"
                                        size="md"
                                    >
                                        <option value="technical_support">Support technique</option>
                                        <option value="account_assistance">Assistance pour le compte</option>
                                        <option value="course_inquiries">Demandes de renseignements sur les cours</option>
                                        <option value="feedback_suggestions">Commentaires et suggestions</option>
                                        <option value="content_issues">Problèmes de contenu</option>
                                        <option value="general_inquiries">Demandes générales</option>
                                    </Select>
                                </FormControl>

                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button onClick={handleSubmit} colorScheme='blue' mr={3}>
                                Modifier
                            </Button>
                            <Button onClick={onClose} >Annuler</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </Box>

    )
}

export default Suivi_Plainte