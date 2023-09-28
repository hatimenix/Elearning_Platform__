import { Fragment, useEffect, useState } from 'react';
import { useStateContext } from '../../context/ContextProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, useToast } from '@chakra-ui/react';
import axiosClient from '../../axios-client';

export const RequireAuth = ({ element }) => {
  const { token, setToken, setRefresh } = useStateContext();
  const navigate = useNavigate();
  const toast = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (localStorage.getItem("mutumApprenant") && localStorage.getItem("tsaroApprenant")) {
      setEmail(decryptString(localStorage.getItem("mutumApprenant"), 25))
      setPassword(decryptString(localStorage.getItem("tsaroApprenant"), 25))
    }
  }, [])



  //store actual time in second
  function storeActualTime() {
    const currentTime = new Date();
    const storedTime = currentTime.toISOString(); // Convert to ISO date-time format
    localStorage.setItem('refreshTimeApprenant', storedTime);
  }


  //check refresh expiration
  function getStoredTimeDifferenceInSeconds() {
    const storedTime = localStorage.getItem('refreshTimeApprenant');

    if (!storedTime) {
      console.log('No stored time found.');
      return null;
    }

    const currentTime = new Date();
    const storedTimeObject = new Date(storedTime);
    const timeDifferenceInSeconds = Math.floor((currentTime - storedTimeObject) / 1000);

    return timeDifferenceInSeconds;
  }




  //decryption function
  function decryptString(encryptedText, shift) {
    if (!Number.isInteger(shift) || shift < 1 || shift > 25) {
      throw new Error("Shift must be an integer between 1 and 25.");
    }

    const decryptedArray = [];
    for (let i = 0; i < encryptedText.length; i++) {
      let charCode = encryptedText.charCodeAt(i);

      // Decrypt uppercase letters
      if (charCode >= 65 && charCode <= 90) {
        charCode = ((charCode - 65 - shift + 26) % 26) + 65;
      }
      // Decrypt lowercase letters
      else if (charCode >= 97 && charCode <= 122) {
        charCode = ((charCode - 97 - shift + 26) % 26) + 97;
      }

      decryptedArray.push(String.fromCharCode(charCode));
    }

    return decryptedArray.join("");
  }




  const refreshToken = () => {
    toast.closeAll()
    // axiosClient.post('/token/apprenant/refresh/', { refresh: localStorage.getItem('REFRESH_TOKEN') })
    //   .then(({ data }) => {
    //     setToken(data.access)
    //     setRefresh(data.refresh)
    //     navigate(-1)

    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });


    const payload = {
      email,
      password,
    }
    // console.log('here is the time diffrence', getStoredTimeDifferenceInSeconds())


    //refresh time inferieur à 15 minutes
    if (getStoredTimeDifferenceInSeconds() < 900) {
      axiosClient.post('token/apprenant/', payload)
        .then(({ data }) => {
          // console.log("token dataaaaaaa", data)
          setToken(data.access)
          setRefresh(data.refresh)
          navigate(-1)
          //withdraw the stored refresh time
          localStorage.removeItem('refreshTimeApprenant');

        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  useEffect(() => {
    const tokenExpirationTime = localStorage.getItem('tokenExpirationTime');

    if (tokenExpirationTime && new Date().getTime() > tokenExpirationTime) {
      // Token has expired, remove it from state and localStorage
      setToken(null)
      localStorage.removeItem('tokenExpirationTime');

      //stocker le refresh time
      storeActualTime()

      toast({
        duration: 10000000,
        isClosable: true,
        position: "top",
        variant: "subtle",
        render: () => (
          <Alert
            status='warning'
            variant='subtle'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            height='200px'
          >
            <AlertIcon boxSize='20px' />
            <AlertTitle mt={4} mb={1} fontSize='md'>
              Session expiré !
            </AlertTitle>
            <AlertDescription maxWidth='sm'>
              Votre session a expiré. Veuillez vous reconnecter.
              <Button size={"sm"} mt={"4"} onClick={refreshToken}>Prolonger la session</Button>
            </AlertDescription>
          </Alert>
        )
      });
    } else if (token) {
      // Set timeout to remove token when expiration time is reached
      const expirationTime = 60 * 60 * 2000; // 2Hours in milliseconds
      // const expirationTime = 5 * 1000; // 5s in milliseconds
      const timeoutId = setTimeout(() => {
        setToken(null);
        localStorage.removeItem('tokenExpirationTime');


        //stocker le refresh time
        storeActualTime()

        toast({
          duration: 10000000,
          isClosable: true,
          position: "top",
          variant: "subtle",
          render: () => (
            <Alert
              status='warning'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='200px'
            >
              <AlertIcon boxSize='20px' />
              <AlertTitle mt={4} mb={1} fontSize='md'>
                Session expiré !
              </AlertTitle>
              <AlertDescription maxWidth='sm'>
                Votre session a expiré. Veuillez vous reconnecter.
                <Button size={"sm"} mt={"4"} onClick={refreshToken}>Prolonger la session</Button>
              </AlertDescription>
            </Alert>
          )
        });
      }, expirationTime);
      localStorage.setItem('tokenExpirationTime', new Date().getTime() + expirationTime);
      return () => clearTimeout(timeoutId);
    }
  }, [token, setToken, refreshToken, toast]);

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     setToken(null)
  //     setRefresh(null)
  //     localStorage.removeItem('tokenExpirationTime');
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);


  if (!token) {
    return <Navigate to="/index" replace />
  }

  return (
    <Fragment>
      {element}
    </Fragment>
  )
}

export default RequireAuth;