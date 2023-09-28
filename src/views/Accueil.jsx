import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  useBreakpointValue,
  IconProps,
  useColorModeValue,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import img1 from '../assets/img/1.jpg';
import img2 from '../assets/img/2.jpg';
import img3 from '../assets/img/3.jpg';
import img4 from '../assets/img/4.jpg';
import img5 from '../assets/img/5.jpg';
import img6 from '../assets/img/6.jpg';
import img7 from '../assets/img/7.jpg';
import img8 from '../assets/img/8.jpg';
import homepage from '../assets/img/acc.png';


import animationData from '../assets/lot/about.json';

import accueil from '../assets/img/accueil.jpg';
import elearning from '../assets/img/e-learn.jpg';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export default function SplitScreen() {

  const navigate = useNavigate()
  function GradientText({ children, gradient }) {
    const gradientBg = {
      background: `linear-gradient(to left, ${gradient})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    };
  }
  function GradientText({ children, gradient }) {
    const gradientBg = {
      background: `linear-gradient(to left, ${gradient})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    };

    return (
      <Text mt={5} fontWeight={"bold"} fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }} as="span" sx={gradientBg}>
        {children}
      </Text>
    );
  }

  return (

    <Stack maxH={{base:'100%',md:'100%',lg:'100%'}} direction={{ base: 'column', md: 'column' , lg:'row' }}>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Stack w={'full'} maxW={'lg'} h={'50%'}>
          <Heading align={'center'} justify={'center'} fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>

            <GradientText
              as={'span'}
              position={'relative'}
              gradient="#ffd140, #089bd7"
              align={'center'} justify={'center'}
            >
              Päiperléck E-learning</GradientText>
            <br />{' '}
            <Text align={'center'} justify={'center'} fontSize={{ base: '2xl', lg: '3xl' }} color={'#089bd7'} as={'span'}>
              Bienvenue sur notre plateforme
            </Text>{' '}
          </Heading>
          <Text align={'center'} justify={'center'} fontSize={{ base: 'md', lg: 'lg' }} color={useColorModeValue("gray.500","gray.400")}>
            Découvrez notre catalogue de cours en cliquant sur le bouton ci-dessous.
          </Text>
          <Stack align={'center'} justify={'center'} direction={{ base: 'column', md: 'row' }} spacing={4} >
            <Button
              mt={{ base: '10px', lg: '30px' }}
              rounded={'full'}
              colorScheme='yellow'
              onClick={() => navigate('/formation_')}>
              Commencer
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}  overflowY={'hidden'} css={{
      "&::-webkit-scrollbar":{
        display:'none'
      },
      scrollbarWidth:'none',
      msOverflowStyle:'none'
    }} >
       <Image
            h={{base:'100%',md:'100%',lg:'700px'}}
            w={{base:'100%',md:'100%',lg:'700px'}}
            p={{base:0,md:0,lg:5}}
            rounded={'md'}
            alt={'feature image'}
            src={
              homepage
            }
            objectFit={{base:'contain',md:'contain',lg:'cover'}}
          />
        {/* <Box as="svg" className="image-grid animation" viewBox="0 0 556.5 546">
 <defs>
    <clipPath id="image-clip1">
      <rect
        x="243"
        y="96.4"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -50.7598 329.9303)"
        fill="#ffee99"
        width="259.7"
        height="259.7"
        className="image-swipe-1"
        style={{ transformOrigin: "0px 0px" }}
      />
    </clipPath>
    <clipPath id="image-clip2">
      <rect
        x="342"
        y="369.7"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -191.5121 423.1241)"
        fill="#ccd5ff"
        width="146"
        height="146"
        className="image-swipe-2"
      />
    </clipPath>
    <clipPath id="image-clip3">
      <rect
        x="210.8"
        y="374.5"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -232.3811 329.4576)"
        fill="#ffee99"
        width="141.4"
        height="141.4"
        style={{ transformOrigin: "0px 0px" }}
      />
    </clipPath>
    <clipPath id="image-clip4">
      <rect
        x="39.2"
        y="237"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -195.3262 191.916)"
        fill="#ccd5ff"
        width="189.5"
        height="189.5"
        style={{ transformOrigin: "0px 0px" }}
      />
    </clipPath>
    <clipPath id="image-clip5">
      <rect
        x="96.5"
        y="30.2"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -23.3546 150.0922)"
        fill="#ccd5ff"
        width="146"
        height="146"
        style={{ transformOrigin: "0px 0px" }}
      />
    </clipPath>
  </defs>

  <g clip-path="url(#image-clip)">
  <rect
    x="243"
    y="96.4"
    fill="#ffee99"
    width="259.7"
    height="259.7"
    className="image-swipe-1"
    transform="rotate(45 373.55 226.75)"
  />
  <rect
    x="342"
    y="369.7"
    fill="#d5d7df"
    width="146"
    height="146"
    className="image-swipe-2"
    transform="rotate(45 415 443)"
  />
  <rect
    x="210.8"
    y="374.5"
    fill="#ffee99"
    width="141.4"
    height="141.4"
    transform="rotate(45 281.5 445.75)"
  />
  <rect
    x="39.2"
    y="237"
    fill="#d5d7df"
    width="189.5"
    height="189.5"
    transform="rotate(45 133.95 331.75)"
  />
  <rect
    x="96.5"
    y="30.2"
    fill="#d5d7df"
    width="146"
    height="146"
    transform="rotate(45 169 103.75)"
  />
</g>


<image
    clipPath="url(#image-clip1)"
    href={img2}
    preserveAspectRatio="xMidYMid slice"
    x="190"
    y="45"
    width="370"
    height="370"
  />
  <image
    clipPath="url(#image-clip2)"
    href={img3}
    preserveAspectRatio="xMidYMid slice"
    x="310"
    y="340"
    width="210"
    height="210"
  />
  <image
    clipPath="url(#image-clip3)"
    href={img8}
    preserveAspectRatio="xMidYMid slice"
    x="180.8"
    y="344.5"
    width="200"
    height="200"
  />
  <image
    clipPath="url(#image-clip4)"
    href={img1}
    preserveAspectRatio="xMidYMid slice"
    x="0"
    y="190"
    width="280"
    height="280"
  />
  <image
    clipPath="url(#image-clip5)"
    href={img3}
    preserveAspectRatio="xMidYMid slice"
    x="80"
    y="0"
    width="215"
    height="215"
  /></Box> */}
      </Flex>
    </Stack>


  );
}