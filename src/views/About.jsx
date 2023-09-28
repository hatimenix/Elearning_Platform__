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
    IconProps,
    useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import logo from '../assets/img/logo.png';
import animationData from '../assets/lot/about.json';

import about from '../assets/img/About.jpg';
import elearning from '../assets/img/e-learn.jpg';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export default function Index() {

    const navigate = useNavigate()
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

    return (

        <Container maxW={'6xl'} mt="5" bg="transparent" >

            <Stack

                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 10, md: 18 }}
                direction={{ base: 'column', md: 'row' }}>

                <Stack flex={1} spacing={{ base: 5, md: 10 }}>

                    <Heading
                        lineHeight={1.1}
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}>
                        <Flex spacing={0}>

                            <Text
                                as={'span'}
                                color="#089bd7"
                                position={'relative'}
                                _after={{
                                    content: "''",
                                    width: 'full',
                                    height: '30%',
                                    position: 'absolute',
                                    bottom: 1,
                                    left: 0,
                                    bg: '#ffd140',
                                    zIndex: -1,
                                    bgGradient: 'linear(to-l, #1a365d, #ffd140)'

                                }}>
                                Päiperléck E-learning

                            </Text>
                            <Stack justifyItems={'left'}>
                                <Lottie height={60} width={60} options={defaultOptions} />
                            </Stack>
                        </Flex>
                        <Text as={'span'} color={'yellow.400'} fontSize={{ base: '1xl', sm: '2xl', lg: '3xl' }}>
                            Bienvenue sur notre plateforme!
                        </Text>
                    </Heading>
                    <Text color={useColorModeValue('gray.500', 'gray.400')} fontSize={"lg"} textAlign={'justify'} >
                        Nous sommes déterminés à vous aider à acquérir les compétences nécessaires pour rester en sécurité dans votre travail. Notre plateforme propose une variété de cours de sécurité en ligne qui sont adaptés à vos besoins professionnels. Avec notre interface conviviale, vous pouvez facilement parcourir notre catalogue de cours, vous inscrire aux cours, suivre votre progression et interagir avec les instructeurs. Rejoignez-nous dès maintenant et commencez à renforcer votre sécurité professionnelle.
                    </Text>

                </Stack>
                <Flex
                    flex={1}
                    justify={'center'}
                    align={'center'}
                    position={'relative'}
                    w={'full'}
                >
                <div class="blob-wobble">
                <img src={about} alt="Random image" />
                </div>
                                
                </Flex>
            </Stack>
        </Container>
    );
}

export const Blob = ({ ...rest }) => {
    return (
        <Icon
            width={'100%'}
            viewBox="0 0 578 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <defs>
                <linearGradient id="gradient" x1="80%" y1="100%" x2="35%" y2="40%">
                    <stop offset="50%" stopColor="#fcd96a" />
                    <stop offset="100%" stopColor="#1a365d" />
                </linearGradient>
            </defs>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
                fill="url(#gradient)"
            />
        </Icon>
    );
};    