import logo from '../../assets/img/logo.png';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';
import signup from '../../assets/img/signup.png'
import MySelect from "react-select";
import countryData from '../../assets/dataJson/countries.json';


import {
  Box,
  FormControl,
  Flex,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Checkbox,
  Image,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Select,
  InputLeftElement,
} from '@chakra-ui/react';
import axiosClient from '../../axios-client';
import { TfiReload } from 'react-icons/tfi';

const linkStyle = {
  color: '#3C8DBC',
  textDecoration: "underline"
}


export default function Signup() {

  const toast = useToast()
  const emailRegex = /^\S+@\S+\.\S+$/;


  const [first_name, setFirstName] = useState("")
  const [last_name, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [pays, setPays] = useState("")
  const [rue, setRue] = useState("")
  const [ville, setVille] = useState("")
  const [codePostal, setCodePostal] = useState("")
  const [selection, setSelection] = useState('');
  const [company, setCompany] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChecked, setIsChecked] = useState(true);
  const [dataCompany, setDataCompany] = useState([]);
  const [dataApprenants, setDataApprenants] = useState([]);
  const [dataDemandes, setDataDemandes] = useState([]);

  const [pwd, setPwd] = useState('');
  const navigate = useNavigate();

  const [message, setMessage] = useState([])
  const [showPassword, setShowPassword] = useState(false);
  const { notification, setNotification, isLoading, setIsLoading } = useStateContext()

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

  //get the company data
  useEffect(() => {
    axiosClient.get('/company/')
      .then((response) => {
        setDataCompany(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosClient.get('/apprenants/')
      .then((response) => {
        setDataApprenants(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosClient.get('/demandes/')
      .then((response) => {
        setDataDemandes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
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

    if (!specialchar.test(pwd)) {
      missingRequirements.push("caractère spécial");
    } else if (!lowercaseRegex.test(pwd)) {
      missingRequirements.push("minuscule");
    } else if (!uppercaseRegex.test(pwd)) {
      missingRequirements.push("majuscule");
    } else if (!digitRegex.test(pwd)) {
      missingRequirements.push("chiffres");
    } else if (!minLengthRegex.test(pwd)) {
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
    return missingRequirements
  }

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

    setPwd(newPassword);
    setConfirmPassword(newPassword)
    setGeneretedPwd(newPassword)
    setDisableInputConfirm(true)
  };

  useEffect(() => {
    checkPasswordStrength();
  }, [pwd]);
  // check the password complexity
  const isFormValid = (password) => {
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


  const onSubmit = ev => {
    ev.preventDefault()
    setIsLoading(true)
    toast.closeAll()

    // Check if the email exists in the dataDemandes array
    const emailExistsInDemandes = dataDemandes.some((demande) => demande.email === email);
    console.log("Email exists in demandes:", emailExistsInDemandes);

    const emailExistsInApprenants = dataApprenants.some((apprenant) => apprenant.email === email);
    console.log("Email exists in apprenants:", emailExistsInApprenants);


    if (emailExistsInDemandes) {
      setMessage({
        alert: "Un utilisateur avec cette adresse email existe déjà dans les demandes d'inscription. Veuillez patienter pendant que nous traitons votre demande.",
        target: "email",
      });
      setIsLoading(false);
      return;
    }

    // Check if the email exists in the apprenants table (Assuming you also have dataApprenants fetched)
    else if (emailExistsInApprenants) {
      setMessage({
        alert: "Un utilisateur avec cette adresse email existe déjà parmi les apprenants.",
        target: "email",
      });
      setIsLoading(false);
      return;
    }
    const formData = new FormData()
    formData.append("first_name", first_name)
    formData.append("last_name", last_name)
    formData.append("email", email)
    formData.append("pays", selectedCountry.label)
    formData.append("ville", ville)
    formData.append("code_postal", codePostal)
    formData.append("rue", rue)
    formData.append("password", pwd)
    formData.append("company_type", selection)
    formData.append("etat", true)
    formData.append("isChecked", true)

    if (selection === "interne") {
      formData.append('company', company)
    }

    if (selection === "externe") {
      formData.append('companyext', company)
    }

    setMessage({})
    if (pwd !== confirmPassword) {
      setMessage({ alert: "Veuillez confirmer votre mot de passe", target: "password" })
      setIsLoading(false)
    } else if (passwordStrength !== 'Fort' && pwd.length > 0 && !isFormValid(pwd)) {
      setMessage({ alert: "Veuillez entrer un mot de passe valide.", target: "password" });
      setIsLoading(false)
      return;
    }

    else if (!emailRegex.test(email)) {
      setMessage({ alert: "Veuillez entrer un email valide.", target: "email" });
      setIsLoading(false)
    }

    else {
      axiosClient.post('demandes/', formData, {
        first_name: first_name,
        last_name: last_name
      })
        .then(() => {
          setIsLoading(false)
          toast({
            title: "Demande envoyée",
            description: "Votre demande a été envoyée avec succès, veuillez attendre la validation de votre compte.",
            status: "success",
            duration: 1000000000,
            isClosable: true,
            position: "top",
            variant: "subtle"
          });

          navigate('/login')

        })
        .catch((err) => {
          const response = err.response;
          // if (response.status === 400) {
          //   setMessage({ alert: "Ce mail existe déjà parmi les demandes d'inscription. Veuillez patienter pendant que nous traitons votre demande.", target: "email" });
          // } else {
          setMessage({ alert: response.data, target: "all" });
          // }
          setIsLoading(false);
        });
    }
  }

  const isFormFilled = first_name && last_name && email && company && confirmPassword && isChecked && selectedCountry.label;


  const { token } = useStateContext()

  if (token) {
    return <Navigate to="/" />
  }

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'stretch', md: 'center' }}
      justify={{ base: 'flex-start', md: 'space-between' }}
    >
      <Box
        align='center'
        justify='center'
        w={{ base: '100%', md: '50%' }}
      >
        <Image src={logo} w="250px" mb={3} ></Image>
        {notification &&
          <Alert status='success'>
            <AlertIcon />
            {notification}

          </Alert>
        }

        <Box p={6} rounded={'lg'} w="100%" ml={"20px"} borderWidth={1} borderRadius={8} boxShadow="lg">

          <Heading fontSize={'2xl'} mb='15px' >Inscription</Heading>
          <hr />
          {message.target &&
            <Alert status='error' rounded="md">
              <AlertIcon />
              {message.alert}
            </Alert>
          }
          <Stack spacing={2} mt="15px">
            <HStack spacing={2}>
              <Box w="30%">
                <FormControl id="firstName" isRequired isInvalid={message.target === "all"}>
                  <FormLabel>Nom</FormLabel>
                  <Input value={first_name} onChange={(e) => setFirstName(e.target.value)} name="first_name" type="text" placeholder='Tapez votre nom' maxLength={25} />
                </FormControl>
              </Box>
              <Box w="30%">
                <FormControl id="lastName" isRequired isInvalid={message.target === "all"}>
                  <FormLabel>Prénom</FormLabel>
                  <Input value={last_name} onChange={(e) => setLastName(e.target.value)} name="last_name" type="text" placeholder='Tapez votre prénom' maxLength={25} />
                </FormControl>
              </Box>
              <Box w={"40%"}>
                <FormControl id="email" isRequired isInvalid={message.target === "email"}>
                  <FormLabel>Adresse email</FormLabel>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder='Tapez votre adresse email' maxLength={50} />
                </FormControl>
              </Box>
            </HStack>

            <HStack spacing={2}>
              <Box w="50%">
                <FormControl id="rue" >
                  <FormLabel>Rue</FormLabel>
                  <Input value={rue} onChange={(e) => setRue(e.target.value)} name="rue" type="text" placeholder='Tapez votre rue' maxLength={50} />
                </FormControl>
              </Box>
              <Box w="50%">
                <FormControl id="ville" >
                  <FormLabel>Ville</FormLabel>
                  <Input value={ville} onChange={(e) => setVille(e.target.value)} name="ville" type="text" placeholder='Tapez votre ville' maxLength={30} />
                </FormControl>
              </Box>
            </HStack>

            <HStack spacing={2}>
              <Box w="50%">
                <FormControl id="codePostal" >
                  <FormLabel>Code postal</FormLabel>
                  <Input value={codePostal} onChange={(e) => setCodePostal(e.target.value)} name="codePostal" type="text" placeholder='Tapez votre code postal' maxLength={15} />
                </FormControl>
              </Box>
              <Box w="50%">
                {/* <FormControl id="pays" >
                  <FormLabel>Pays</FormLabel>
                  <Input value={pays} onChange={(e) => setPays(e.target.value)} name="pays" type="text" placeholder='Tapez votre pays' />
                </FormControl> */}
                <FormControl id="pays" isRequired>
                  <FormLabel ml={0.5}>Pays</FormLabel>
                  {/* <Input ref={pays} name="pays" type="text" placeholder='Tapez le pays' maxLength={30} /> */}
                  <MySelect

                    name="pays"
                    options={countries}
                    value={selectedCountry}
                    onChange={(selectedOption) => setSelectedCountry(selectedOption)}
                    isSearchable
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        textAlign: 'left',
                      }),
                      menu: (provided) => ({
                        ...provided,
                        textAlign: 'left',
                      }),
                    }}
                  />
                </FormControl>
              </Box>
            </HStack>

            <HStack spacing={2}>
              <Box w="50%">
                <FormControl id="password" isRequired isInvalid={message.target === "password" || message.target === "all"}>
                  <FormLabel>Mot de passe</FormLabel>
                  <InputGroup>
                    <InputLeftElement onClick={generatePassword} as={'Button'} >
                      <TfiReload color='gray.300' />
                    </InputLeftElement>
                    <Input value={pwd} name="password" type={showPassword ? 'text' : 'password'} onChange={(e) => setPwd(e.target.value)} onCopy={(e) => e.preventDefault()} placeholder='Tapez votre mot de passe' />
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
              </Box>

              <Box w={"50%"}>
                <FormControl id="password_confirmation" isRequired isInvalid={message.target === "password"}>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <InputGroup>
                    {(disableInputConfirm && pwd === generetedPwd) ?
                      <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' disabled />

                      :
                      <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} name="confirmPassword" type="password" placeholder='Confirmez votre mot de passe' />

                    }
                  </InputGroup>
                </FormControl>
              </Box>
            </HStack>
            {pwd.length > 0 ?
              <Text align="left" justify="left" fontSize="sm" mt={2} color={passwordColor}>{`${passwordStrength}`}</Text>

              : ""}
            {/*company field */}

            <HStack spacing={2}>

              <Box w="50%">
                <FormControl isRequired isInvalid={message.target === "all"}>
                  <FormLabel>Société </FormLabel>
                  <Select value={selection} onChange={(e) => setSelection(e.target.value)} >
                    <option value="">Vous appartenez à une société</option>
                    <option value="interne">Interne</option>
                    <option value="externe">Externe</option>
                  </Select>
                </FormControl>
              </Box>
              <Box w="50%">
                {selection === 'interne' && (
                  <FormControl isRequired >
                    <FormLabel ml={0.5} >Choisissez votre société</FormLabel>
                    <Select value={company} onChange={(e) => setCompany(e.target.value)}>
                      <option value="">Sélectionnez une société</option>
                      {dataCompany.map((company, key) => (
                        <option key={key} value={parseInt(company.id)}>
                          {company.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {selection === 'externe' && (
                  <FormControl id="company" isRequired >
                    <FormLabel ml={0.5}>Entrez le nom de votre société</FormLabel>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Tapez le nom de votre société"
                    />
                  </FormControl>
                )}
              </Box>
            </HStack>
            {/*company field */}


            <Checkbox isChecked={isChecked} onChange={(e) => setIsChecked(e.target.checked)}>Autoriser Päiperléck à conserver mes informations</Checkbox>
            <Stack spacing={10} pt={2} maxW={"150px"}>
              <Button
                type="submit" onClick={onSubmit} isLoading={isLoading}
                colorScheme='yellow' isDisabled={!isFormFilled}>
                {isLoading ? <Spinner size="sm" /> : "S'inscrire"}
              </Button>
            </Stack>
            <Stack pt={2}>
              <Text align={'start'}>
                Vous avez déja un compte ? &nbsp;
                <RouterLink to="/login" style={linkStyle} >
                  S'authentifier
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
        <Image display={{ base: 'none', md: 'flex' }} src={signup} />
      </Box>
    </Flex>
  )
}
