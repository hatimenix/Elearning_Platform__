import logo from '../../assets/img/logo.png';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';
import login from '../../assets/img/login.png'

import {
    Flex,
    Text,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Image,
    InputGroup,
    InputRightElement,
    Alert,
    AlertIcon,
    Spinner,
    useToast,
} from '@chakra-ui/react';


const linkStyle = {
    color: '#3C8DBC',
    textDecoration: "underline"
}


export default function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { token, setToken, setRefresh, isLoading, setIsLoading } = useStateContext()
    const [message, setMessage] = useState([])
    const toast = useToast()



    //encryption function
    function encryptString(plainText, shift) {
        if (!Number.isInteger(shift) || shift < 1 || shift > 25) {
            throw new Error("Shift must be an integer between 1 and 25.");
        }

        const encryptedArray = [];
        for (let i = 0; i < plainText.length; i++) {
            let charCode = plainText.charCodeAt(i);

            // Encrypt uppercase letters
            if (charCode >= 65 && charCode <= 90) {
                charCode = ((charCode - 65 + shift) % 26) + 65;
            }
            // Encrypt lowercase letters
            else if (charCode >= 97 && charCode <= 122) {
                charCode = ((charCode - 97 + shift) % 26) + 97;
            }

            encryptedArray.push(String.fromCharCode(charCode));
        }

        return encryptedArray.join("");
    }


    const onSubmit = async ev => {
        toast.closeAll()
        ev.preventDefault()
        setIsLoading(true)

        
        const payload = {
            email,
            password,
        }
       
        axiosClient.post('token/apprenant/', payload)
            .then(({ data }) => {
                setToken(data.access);
                setRefresh(data.refresh)
                setIsLoading(false)
               
            })
            .catch((err) => {
                const response = err.response;
                console.log(response.data.message)
                if (response.data.message === "Mot de passe incorrect") {
                    setMessage({ alert: response.data.message, target: "password" });
                }
                else if (response.data.message === "votre compte est désactivé") { setMessage({ alert: response.data.message, target: "" }); }
                else {
                    setMessage({ alert: "Email incorrect", target: "email" });
                }

                setIsLoading(false)
            })

    }

    const [showPassword, setShowPassword] = useState(false);

    if (token) {
        return <Navigate to="/" />
    }

    const isFormFilled = email && password;

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'stretch', md: 'center' }}
            justify={{ base: 'flex-start', md: 'space-between' }}
            p={5} >
            <Box
                align='center'
                justify='center'
                py="50px"
                w={{ base: '100%', md: '50%' }}

            >

                <Image src={logo} w="250px" ></Image>
                <Text fontSize={'2xl'} mb='15px'>Bienvenue à PäiperLearning</Text>
                <Box p={6} rounded={'lg'} w="100%" maxW="450px" borderWidth={1} borderRadius={8} boxShadow="lg">
                    <Text fontSize={'2xl'} mb='15px'>S'authentifier</Text>
                    <hr />
                    {message.alert &&
                        <Alert status='error' rounded="md">
                            <AlertIcon />
                            {message.alert}
                        </Alert>
                    }
                    <Stack spacing={2} mt='15px'>
                        <FormControl id="email" isRequired isInvalid={message.target === "email"}>
                            <FormLabel>Adresse E-mail</FormLabel>
                            <Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Tapez votre adresse e-mail' />
                        </FormControl>
                        <FormControl id="password" isRequired isInvalid={message.target === "password"}>
                            <FormLabel>Mot de passe</FormLabel>
                            <InputGroup>
                                <Input defaultValue={localStorage.getItem('password')} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} placeholder='Tapez votre mot de passe' />
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
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                
                                <Link href='/reset_password' color={'blue.400'}> mot de passe oublié?</Link>
                            </Stack>
                            <Button
                                type="submit" onClick={onSubmit} isLoading={isLoading}
                                colorScheme='yellow' isDisabled={!isFormFilled}>
                                {isLoading ? <Spinner size="sm" /> : "Connexion"}
                            </Button>
                        </Stack>
                        <Stack pt={2}>
                            <Text align={'center'}>
                                Vous n'avez pas un compte ? &nbsp;
                                <RouterLink to="/signup" style={linkStyle} >
                                    Créer le
                                </RouterLink>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
            <Box w="50%"
                justify="left"
                alignItems="left"
                p={20}
            >
                <Image display={{ base: 'none', md: 'flex' }} src={login} />
            </Box>
        </Flex>
    )
}