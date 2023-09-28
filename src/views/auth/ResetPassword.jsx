import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import axiosClient from '../../axios-client';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {

  const [email, setEmail] = useState("")
  const toast = useToast()
  const navigate = useNavigate()

  const { token } = useParams();
  
  const onSubmit = ev => {
    toast.closeAll()
    ev.preventDefault();
    if(email === "") {
      toast({
        description: "Veuillez entrer votre adresse email",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle"
      });
    } else {
      axiosClient.get('reset_email/', { params: { email: email } })
      .then((response) => {
        if(response.status === 203) {
          toast({
            description: response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
            variant: "subtle"
          });
        } else {
          toast({
            description: "Un email de réinitialisation de mot de passe a été envoyé avec succès.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
            variant: "subtle"
          });
          navigate('/login')
        }
      
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };
  
  return (
    <Flex
      minH={'100vh'}

      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Mot de passe oublié ?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          Entrez votre adresse email
        </Text>
        <FormControl id="email">
          <Input
            name='email'
            placeholder="votre-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <Stack spacing={6}>
          <Button 
          name='submit'
            type='submit'
            onClick={onSubmit}
            colorScheme='yellow'>
            Demander une réinitialisation
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default ResetPassword