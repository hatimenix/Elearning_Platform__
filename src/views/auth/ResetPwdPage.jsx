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
    useToast,
    Heading,
    Alert,
    AlertIcon
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import React, { useState, useEffect, useRef } from 'react';
import { EditIcon, ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { TfiReload } from 'react-icons/tfi';
import Select from "react-select";
import countryData from '../../assets/dataJson/countries.json';
const ResetPwdPage = () => {
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { userId ,token,expires } = useParams();
    const navigate=useNavigate();
    const [isExpired, setIsExpired] = useState(false);
     //toast variable
     const toast = useToast()
    ////////////////////////// VALIDATION DE MOT DE PASSE /////////////////////////////////////////
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordColor, setPasswordColor] = useState('');
    useEffect(() => {
        const expirationTime = new Date(expires);
        const currentTime = new Date();
      
        if (expirationTime > currentTime) {
          setIsExpired(false);
        } else {
          setIsExpired(true);
        }
      }, [expires]);


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

    // reset password 
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isPasswordValid(newPassword)) {
            return;
        }
        try {
            const response = await axiosClient.put(`/reset_password/${userId}/`, {
                new_password: newPassword,
                confirm_password: confirmPassword,
              });
            if (response.data.success) {
                toast({
                    description: "le mot de passe est modifié avec succes",
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
                navigate('/login')

            }
            setMessage(response.data.error);
        } catch (err) {
            setError(err.response.data.error);
        }
    };
    const colorModeValue = useColorModeValue('gray.50', 'gray.800');
    const colorModeValue1 = useColorModeValue('white', 'gray.700');

    return (
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={colorModeValue}
        >
          {isExpired ? (
            <Box>
              <Alert status="error" rounded="md">
                <AlertIcon />
                Le lien a expiré . Vous avez dépasser le temps imparti
              </Alert>
            </Box>
          ) : (
            <Stack
              spacing={4}
              w={'full'}
              maxW={'md'}
              bg={colorModeValue1}
              rounded={'xl'}
              boxShadow={'lg'}
              p={6}
              my={12}
            >
              <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '2xl' }}>
                Réinitialisation de mot de passe
              </Heading>
              {message && (
                <Alert status='error' rounded="md">
                  <AlertIcon />
                  {message}
                </Alert>
              )}
              <FormControl mt={4}>
                <FormLabel>Nouveau mot de passe</FormLabel>
                <InputGroup>
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
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {newPassword.length > 0 && (
                <Text align="left" justify="left" fontSize="sm" mt={2} color={passwordColor}>
                  {`${passwordStrength}`}
                </Text>
              )}
              <FormControl mt={4}>
                <FormLabel>Confirmer mot de passe</FormLabel>
                <Input
                  type="password"
                  id="confirm_password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={6}>
                <Button
                  name='submit'
                  type='submit'
                  onClick={handleFormSubmit}
                  colorScheme='yellow'
                >
                  Réinitialiser
                </Button>
              </Stack>
            </Stack>
          )}
        </Flex>
      );
}

export default ResetPwdPage
