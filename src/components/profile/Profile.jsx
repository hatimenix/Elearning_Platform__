import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    InputGroup,
    InputRightElement,
    useColorModeValue,
    Text,
    HStack,
    Avatar,
    VStack,
    AvatarBadge,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Divider,
    Alert,
    AlertIcon,
    useToast,
    InputLeftElement
} from '@chakra-ui/react';
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import React, { useState, useEffect, useRef } from 'react';
import { EditIcon, ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { TfiReload } from 'react-icons/tfi';
import Select from "react-select";
import countryData from '../../assets/dataJson/countries.json';

export const Profile = () => {

    function update() {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
                setInitialUserData(data);
            })
        axiosClient.get(`/apprenants/${user.id}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }
    const navigate = useNavigate()
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._-]*@[a-zA-Z]+(?:-[a-zA-Z]+)?\.[a-zA-Z]{2,}$/;
    const codepRegex = /^(\d{3})$|(\d{6})$|([A-Z]\d{4}[A-Z]{3})$|(\d{4})$|(\d{4})$|(?:FI)*(\d{5})$|(?:AZ)*(\d{4})$|(\d{5})$|(?:BB)*(\d{5})$|(\d{4})$|(\d{4})$|(\d{4})$|(\d{3}\d?)$|([A-Z]{2}\d{2})$|([A-Z]{2}\d{4})$|(\d{8})$|(\d{6})$|([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]) ?(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$|(\d{4})$|(\d{7})$|(\d{6})$|(\d{4})$|(?:CP)*(\d{5})$|(\d{4})$|(\d{4})$|(\d{4})$|(\d{5})$|(\d{5})$|(?:FI)*(\d{5})$|(\d{5})$|(\d{4})$|(\d{6})$|(?:SEOUL)*(\d{6})$|(\d{5})$|(\d{6})$|(\d{5})$|(\d{4})$|(\d{5})$|(\d{5})$|(\d{10})$|(\d{3})$|(\d{5})$|(\d{5})$|([A-Z]\d{2}[A-Z]{2})|([A-Z]\d{3}[A-Z]{2})|([A-Z]{2}\d{2}[A-Z]{2})|([A-Z]{2}\d{3}[A-Z]{2})|([A-Z]\d[A-Z]\d[A-Z]{2})|([A-Z]{2}\d[A-Z]\d[A-Z]{2})|(GIR0AA)$|(\d{5})$|(\d{7})$|([A-Z]\d{2}[A-Z]{2})|([A-Z]\d{3}[A-Z]{2})|([A-Z]{2}\d{2}[A-Z]{2})|([A-Z]{2}\d{3}[A-Z]{2})|([A-Z]\d[A-Z]\d[A-Z]{2})|([A-Z]{2}\d[A-Z]\d[A-Z]{2})|(GIR0AA)$|(\d{5})$|(\d{4}(\d{4})?)$|(\d{4})$|(\d{5})$|(\d{6})$|(\d{5})$|(\d{6})$|(?:SEOUL)*(\d{6})$|(\d{5})$|(\d{5})$|(\d{5})$|(\d{6})$|(\d{4})$|(\d{7})$|(97500)$|(\d{9})$|(\d{7})$|(96940)$|(\d{4})$|((97|98)(4|7|8)\d{2})$|(\d{6})$|(\d{6})$|(\d{6})$|(\d{5})$|(\d{5})$|(?:SE)*(\d{5})$|(\d{6})$|(STHL1ZZ)$|(?:SI)*(\d{4})$|(\d{5})$|4789\d$|(\d{5})$|(?:CP)*(\d{4})$|([A-Z]\d{3})$|(TKCA 1ZZ)$|(\d{5})$|(\d{6})$|(\d{6})$|(\d{4})$|(\d{5})$|(\d{5})$|(986\d{2})$|(\d{5})$|(\d{4})$|(\d{5})$|(\d{5})$|([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2})$/i;

    const { setToken, setRefresh } = useStateContext();

    //user picture
    const [avatarUrl, setAvatarUrl] = useState('');

    //toast variable
    const toast = useToast()

    // current user
    const { user, setUser } = useStateContext();
    const [initialUserData, setInitialUserData] = useState({});

    //modal variables
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const [imageData, setImageData] = useState(null);

    //password variables
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    const [listApprenants, setListApprenants] = useState([])

    const initialForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    };
    const resetForm = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordStrength('');
        setPasswordColor('gray.500');
        setShowPassword(false);
        setShowPasswords(false);
    };
    // current user data
    useEffect(() => {
        axiosClient.get('auth/user/')
            .then(({ data }) => {
                setUser(data)
                setInitialUserData(data);
            })
        axiosClient
            .get("/apprenants/")
            .then((res) => setListApprenants(res.data));
    }, [])

    const handleCancel = () => {
        setUser(initialUserData);
    };
    const handlepwdCancel = () => {
        resetForm();
        onClose();
    };
    //stocking the user image
    useEffect(() => {
        axiosClient.get(`/apprenants/${user.id}/image`)
            .then(response => {
                setAvatarUrl(response.request.responseURL);
            })
            .catch(error => {
                console.error(error);
            });
    }, [user.id]);


    ////////////////////////// VALIDATION DE MOT DE PASSE /////////////////////////////////////////
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordColor, setPasswordColor] = useState('');

    const checkPasswordStrength = () => {
        const specialchar = /[@#$%^&+=!*_|èàç()/."';:,?ù]/;
        const minLengthRegex = /^.{8,}$/;
        const startLength = /^.{2,}$/;
        const digitRegex = /\d/;
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;

        let missingRequirements = [];

        if (!specialchar.test(newPassword)) {
            missingRequirements.push("caractère spécial");
        } else if (!lowercaseRegex.test(newPassword)) {
            missingRequirements.push("minuscule");
        } else if (!uppercaseRegex.test(newPassword)) {
            missingRequirements.push("majuscule");
        } else if (!digitRegex.test(newPassword)) {
            missingRequirements.push("chiffres");
        } else if (!minLengthRegex.test(newPassword)) {
            missingRequirements.push("longueur minimale de 8 caractères");
        }

        if (missingRequirements.length > 0) {
            const missingText = `Vous avez besoin de ${missingRequirements.join(", ")} dans votre mot de passe.`;
            setPasswordStrength(missingText);
            setPasswordColor('red.500');
        } else {
            setPasswordStrength('Le mot de passe est correct!');
            setPasswordColor('green');
        }
    }

    useEffect(() => {
        checkPasswordStrength();
    }, [newPassword]);


    // check the password complexity
    const isPasswordValid = (password) => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*_|èàç()/."';:,?ù])[0-9a-zA-Z@#$%^&+=!*_|èàç()/."';:,?ù]{8,}$/;
        const specialchar = /[@#$%^&+=!*_|èàç()/."';:,?ù]/;
        const minLengthRegex = /^.{8,}$/;
        const digitRegex = /\d/;
        const lowercaseRegex = /[a-z]/;
        const uppercaseRegex = /[A-Z]/;

        let errors = [];

        if (!minLengthRegex.test(password)) {
            errors.push('Le mot de passe doit comporter au moins 8 caractères.');
        }

        if (!digitRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins un chiffre.');
        }

        if (!lowercaseRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
        }

        if (!uppercaseRegex.test(password)) {
            errors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
        }
        if (!specialchar.test(password)) {
            errors.push('Le mot de passe doit contenir au moins un caractère spécial (@#$%^&+=).');
        }
        if (password.length > 20) {
            errors.push('Le mot de passe ne doit pas dépasser 20 caractères.');
        }

        if (errors.length > 0) {
            setMessage(errors[0]);
            return false;
        }

        return passwordRegex.test(password);
    };


    // change password 
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid(newPassword)) {
            return;
        }
        try {
            const response = await axiosClient.put(`/change_password/${user.id}/`, {
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
                useradd: user.first_name + ' ' + user.last_name
            });
            if (response.data.success) {
                toast({
                    description: "le mot de passe est modifié avec succes",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                onClose();
                resetForm();
                setTimeout(() => {
                    setUser({});
                    setToken(null);
                    setRefresh(null);
                    localStorage.removeItem("tokenExpirationTime");
                }, 2000);

            }
            setMessage(response.data.error);
        } catch (err) {
            setError(err.response.data.error);
        }
    };

    //get the inputs values
    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.type === "file" ? target.files[0] : target.value;
        setUser({ ...user, [name]: value });
    };

    const isEmpty = () => {
        return !user.last_name || !user.first_name || !user.email || selectedCountry.label;
    };
    //get the image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser((prevUserData) => ({
                ...prevUserData,
                image: file,
                imageUrl: imageUrl,
            }));
        }
    };

    const [oldEmail, setOldEmail] = useState(user.email)

    const [uploaded, setUploaded] = useState(null);
    //edit form submit
    const handleSubmit = async (event) => {
        if (!emailRegex.test(user.email)) {
            setMessage("Veuillez entrer un email valide.");
            return;
        }
        if (user.code_postal && !codepRegex.test(user.code_postal)) {
            setMessage("Veuillez entrer un code postal valide.");
            return;
        }
        event.preventDefault();

        const formData = new FormData();
        //formData.append("password", user.password);
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        if (user.email) formData.append("email", user.email);
        if (selectedCountry.label) { formData.append("pays", selectedCountry.label); }
        formData.append("ville", user.ville);
        formData.append("rue", user.rue);
        formData.append("code_postal", user.code_postal);
        if (typeof user.image === 'object') {
            formData.append("image", user.image);
        }

        if (user.first_name.trim() === "" || user.first_name.trim() === "" || (user.ville && user.ville.trim() === "") || (user.rue && user.rue.trim() === "") || (user.code_postal && user.code_postal.trim() === "")) {
            setMessage("Veuillez remplir les champs correctement");
            return;
        }

        const newList = listApprenants.filter((e) => e.id !== user.id);
        if (newList.length > 0) {
            const check = newList.find((obj) => {
                return obj.email === user.email.trim();
            });
            if (check) {
                window.scrollTo(0, 0);
                return setMessage("Ce mail existe déjà !");
            }
        }
        // Send the updated user data to the API

        try {
            const response = await axiosClient.put(`/user_update/${user.id}/`, formData, {
                onUploadProgress: (data) => {
                    setUploaded(Math.round((data.loaded / data.total) * 100))
                }
            });
            if (response.data.message) {
                toast({
                    description: "votre profile est modifié avec succès",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                onClose();
                update()
                setMessage('')
                setUploaded(null)
                //    setTimeout(() => {
                //         window.location.reload();
                //     }, 2000);
            }
        } catch (err) {
            toast({
                description: "erreur",
                status: 'warning',
                duration: 2000,
                isClosable: true,
            })
        }

    };
    const [disableInputConfirm, setDisableInputConfirm] = useState(false)
    const [generetedPwd, setGeneretedPwd] = useState()
    const generatePassword = () => {
        const length = 10; // Length of the generated password
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialCharacters = '[@#$%^&+=!*_|èàç()/.";:,?ù]';

        let newPassword = '';
        let characterSet = '';

        // Include at least one character from each set
        newPassword += uppercaseLetters[Math.floor(Math.random() * uppercaseLetters.length)];
        newPassword += lowercaseLetters[Math.floor(Math.random() * lowercaseLetters.length)];
        newPassword += numbers[Math.floor(Math.random() * numbers.length)];
        newPassword += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

        characterSet = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

        // Generate remaining characters randomly
        for (let i = newPassword.length; i < length; i++) {
            newPassword += characterSet[Math.floor(Math.random() * characterSet.length)];
        }

        setNewPassword(newPassword);
        setConfirmPassword(newPassword)
        setGeneretedPwd(newPassword)
        setDisableInputConfirm(true)

    };
    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={5} mt={5} fontWeight={"bold"} fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState({});

    useEffect(() => {
        const Mycountries = [];
        const data = countryData;
        for (let index = 0; index < data.countries.length; index++) {
            Mycountries.push({
                value: data.countries[index].value,
                label: data.countries[index].label.substring(5, 50)
            });
        }
        setCountries(Mycountries);
    }, []);



    function pays(p) {
        let t
        t = {
            value: 1,
            label: p
        }

        return t
    }
    const colorbg = useColorModeValue('white', '#2d3748')
    const txtcolor = useColorModeValue('black', 'white')
    const colorbghover = useColorModeValue('#e2e8f0', '#171923')
    return (
        <Box mt="5px" >

            <GradientText gradient="#ffd140, #089bd7">
                Modifier votre profil</GradientText>
            <Flex
                align={'center'}
                justify={'center'}

            >

                <Stack

                    w={{ base: '90%', md: '90%', lg: '80%' }}
                    maxW='full'

                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'lg'}
                    p={{ base: 4, md: 6, lg: 2 }}
                    my={{ base: 4, md: 8 }}>

                    <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4, md: 8 }} p={{ base: 4, md: 6, lg: 8 }}>
                        <Box flex={{ base: '0 0 auto', md: 'auto 0 0' }} w={{ base: '100%', md: '30%' }} >
                            <Flex justifyContent="center" alignItems="center" h="100%" direction={'column'}>
                                <FormControl id="img" mb={{ base: '5', md: '5', lg: '10' }} >
                                    <Center>
                                        <label htmlFor="imageInput">
                                            <input
                                                id="imageInput"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <Avatar boxSize={['150px', '150px', '150px', '250px']} maxBlockSize={250} src={user.imageUrl || avatarUrl}>
                                                <AvatarBadge
                                                    boxSize={{ base: '2em', sm: '2.5em', md: '4em' }}
                                                    rounded="full"
                                                    bg="#ffd140"
                                                    _hover={{
                                                        bg: '#ffc50f',
                                                    }}
                                                    position="absolute"
                                                    top="20%"
                                                    right={{ base: '-10px', sm: '-12px', md: '-16px' }}
                                                    transform="translateY(-20%)"
                                                    aria-label="remove Image"
                                                    icon={<EditIcon />}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <EditIcon />
                                                </AvatarBadge>
                                            </Avatar>

                                        </label>
                                    </Center>
                                </FormControl>
                                <Stack mb={{ base: '0', md: '5', lg: '10' }} w="100%" direction={['column', 'row']} justify={'center'} align={'center'}>

                                    <Flex align={'center'} w={{ base: '100%', md: '100%' }}>
                                        <Button
                                            onClick={onOpen}

                                            w="100%"
                                            colorScheme="green"

                                        >
                                            modifier le mot de passe
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Flex>
                        </Box>
                        <Center display={{ base: 'none', md: 'flex' }} height={{ base: 0, md: '400px' }}>
                            <Divider orientation='vertical' />
                        </Center>
                        <Box flex={{ base: '0 0 auto', md: '1 0 0' }} w={{ base: '100%', md: '70%' }} >
                            <VStack align={{ base: 'stretch', md: 'start' }} spacing={4} p={2} >
                                {message &&
                                    <Alert status='error' rounded="md">
                                        <AlertIcon />
                                        {message}
                                    </Alert>
                                }
                                <HStack spacing={3} w="100%">
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="last_name" >
                                            <FormLabel>Nom</FormLabel>
                                            <Input
                                                maxLength={25}
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                id="last_name"
                                                name="last_name"
                                                value={user.last_name}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="first_name" >
                                            <FormLabel>Prénom</FormLabel>
                                            <Input
                                                maxLength={25}
                                                id="first_name"
                                                name="first_name"
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                value={user.first_name}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <FormControl id="email" >
                                    <FormLabel>Address Email</FormLabel>
                                    <Input
                                        isDisabled
                                        maxLength={50}
                                        id="email"
                                        name="email"
                                        _placeholder={{ color: 'gray.500' }}
                                        type="email"
                                        value={user.email}
                                        onChange={handleInputChange}

                                    />

                                </FormControl>
                                <HStack spacing={3} w="100%">
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="rue" >
                                            <FormLabel>Rue</FormLabel>
                                            <Input
                                                maxLength={50}
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                id="rue"
                                                name="rue"
                                                value={user.rue}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="ville" >
                                            <FormLabel>Ville</FormLabel>
                                            <Input
                                                maxLength={30}
                                                id="ville"
                                                name="ville"
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                value={user.ville}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>
                                <HStack spacing={3} w="100%">

                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="code_postal" >
                                            <FormLabel>Code postale</FormLabel>
                                            <Input
                                                maxLength={15}
                                                id="code_postal"
                                                name="code_postal"
                                                _placeholder={{ color: 'gray.500' }}
                                                type="text"
                                                value={user.code_postal}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box w={{ base: '100%', md: '50%' }}>
                                        <FormControl id="pays" >
                                            <FormLabel>Pays</FormLabel>
                                            <Select
                                                id="pays"
                                                name="pays"
                                                options={countries}
                                                value={selectedCountry.label ? selectedCountry : pays(user.pays)}
                                                onChange={(selectedOption) => setSelectedCountry(selectedOption)}
                                                isSearchable
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        textAlign: 'left',
                                                        backgroundColor: colorbg,
                                                        color: txtcolor
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        textAlign: 'left',
                                                        backgroundColor: colorbg,
                                                        cursor: "pointer"
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        color: txtcolor,
                                                        backgroundColor: state.isSelected ? colorbg : 'inherit',
                                                        '&:hover': {
                                                            backgroundColor: colorbghover,
                                                        },
                                                        cursor: "pointer"
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: txtcolor
                                                    }),
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                </HStack>


                            </VStack>
                            <Stack spacing={2} direction={['column', 'row']} justifyContent="end" >
                                <Button
                                    colorScheme="red"
                                    onClick={() => navigate(-1)}
                                >
                                    Annuler
                                </Button>
                                {isEmpty() ? (
                                    <Button
                                        type='submit'
                                        isDisabled
                                        onClick={handleSubmit}
                                        colorScheme="blue">
                                        Enregistrer
                                    </Button>
                                ) : uploaded ?
                                    <Button
                                        isLoading
                                        loadingText="En cours"
                                        colorScheme='blue'
                                        justifyContent="end"
                                    /> :
                                    <Button
                                        type='submit'
                                        onClick={handleSubmit}
                                        colorScheme="blue">
                                        Enregistrer
                                    </Button>

                                }
                            </Stack>
                        </Box>
                    </Stack>


                </Stack>
                <>


                    <Modal
                        closeOnOverlayClick={false}
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={handlepwdCancel}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Modifier le mot de passe</ModalHeader>
                            <ModalCloseButton />
                            <hr />
                            {message &&
                                <Alert status='error' rounded="md">
                                    <AlertIcon />
                                    {message}
                                </Alert>
                            }
                            <ModalBody pb={6}>
                                <FormControl>
                                    <Text align={'left'} fontSize="sm" color='yellow.600'>Le mot de passe doit comporter au moins 8 caractères et contenir au moins un chiffre, une lettre minuscule , une lettre majuscule et un chiffre special.</Text>
                                    <Text color={"red.300"}>Tout changement d'adresse e-mail entraînera automatiquement la déconnexion de votre compte.</Text>

                                    <FormLabel>Ancien mot de passe</FormLabel>
                                    <InputGroup>
                                        <Input

                                            type={showPasswords ? 'text' : 'password'}
                                            id="old_password"
                                            onChange={(e) => setOldPassword(e.target.value)}

                                        />
                                        <InputRightElement h={'full'}>
                                            <Button
                                                variant={'ghost'}
                                                onClick={() =>
                                                    setShowPasswords((showPasswords) => !showPasswords)
                                                }>
                                                {showPasswords ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>

                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <InputGroup>

                                        <InputLeftElement onClick={generatePassword} as={'Button'} >
                                            <TfiReload color='gray.300' />
                                        </InputLeftElement>
                                        <Input

                                            type={showPassword ? 'text' : 'password'}
                                            id="new_password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onCopy={(e) => e.preventDefault()}

                                        />

                                        <InputRightElement h={'full'}>
                                            <Button
                                                variant={'ghost'}
                                                onClick={() =>
                                                    setShowPassword((showPassword) => !showPassword)
                                                }>
                                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>

                                </FormControl>
                                {newPassword.length > 0 ?
                                    <Text align="left" justify="left" fontSize="sm" mt={2} color={passwordColor}>{`${passwordStrength}`}</Text>

                                    : ""}

                                <FormControl mt={4}>
                                    <FormLabel>Confirmer mot de passe</FormLabel>
                                    {(disableInputConfirm && newPassword === generetedPwd) ?
                                        <Input
                                            type="password"
                                            id="confirm_password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled
                                        />
                                        :
                                        <Input
                                            type="password"
                                            id="confirm_password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    }
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button onClick={handleFormSubmit} type="submit" colorScheme='blue' mr={3}>
                                    Enregistrer
                                </Button>
                                <Button onClick={handlepwdCancel}>Annuler</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            </Flex>
        </Box>
    )
}
