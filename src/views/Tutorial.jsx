import React, { useEffect, useState } from 'react';
import { AspectRatio } from '@chakra-ui/react'
// import paiperleck from '../assets/video/paiperleck.mp4';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";
import {
    Box,
    Heading,
    Link,
    Image,
    Text,
    Divider,
    HStack,
    Stack,
    Tag,
    Wrap,
    WrapItem,
    SpaceProps,
    useColorModeValue,
    Container,
    VStack,
} from '@chakra-ui/react';
import { Autoplay, Navigation } from "swiper";


function Tutorial() {

    const [slidesPerView, setSlidesPerView] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const isLaptop = window.innerWidth >= 1024; // Adjust the breakpoint as per your needs
            const newSlidesPerView = isLaptop ? 3 : 1;
            setSlidesPerView(newSlidesPerView);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial calculation

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    console.log("access tokennnnnnnnnnnnnnn", localStorage.getItem("ACCESS_TOKEN"))
    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to left, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text ml={{ base: 0, lg: 5 }} mt={5} fontWeight={"bold"} fontSize={{ base: '3xl', sm: '3xl', lg: '4xl' }} as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }
    return (
        <Container maxW={'7xl'} p="10">
            <Heading bgGradient='linear(to-l,  #ffd140, #089bd7)' bgClip='text' fontSize={{ base: '2xl', sm: '4xl' }}>
                Guide d'utlisation
            </Heading>
            <Box
                marginTop={{ base: '1', sm: '5' }}
                display={{ base: "block", lg: "flex" }}
                alignItems="center"
                flexDirection={{ base: 'column', sm: 'row' }}
                justifyContent="space-between">
                <Box
                    display="flex"
                    flex="1"
                    marginRight="5"
                    position="relative"
                    alignItems="center"
                >
                    <Box
                        width={{ base: '100%', sm: '100%' }}
                        zIndex="2"
                        marginLeft={{ base: '0', sm: '6.9%' }}
                        marginTop="6%"
                    >
                        <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
                            <AspectRatio ratio={16 / 9} borderRadius="lg">
                                <iframe
                                    title="tutoriel"

                                    src="https://drive.google.com/file/d/1LFSVzvNbG5U2rZv8-y2hIAC503aRvs3p/preview"
                                    allowFullScreen
                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                            </AspectRatio>
                        </Link>

                    </Box>
                    <Box zIndex="1" width="90%" position="absolute" height="100%">
                        <Box
                            bgGradient={useColorModeValue(
                                'radial(blue.600 1px, transparent 1px)',
                                'radial(yellow.500 1px, transparent 1px)'
                            )}
                            backgroundSize="15px 15px"
                            opacity="2"
                            height="90%"
                        />
                    </Box>

                </Box>

                <Box
                    display="flex"
                    flex="1"

                    flexDirection="column"
                    marginTop={{ base: '3', sm: '0' }}>
                    <Box p={'5'}></Box>
                    <Heading color={'yellow.400'} fontSize={{ base: '2xl', sm: '2xl', lg: '3xl' }} marginTop="1">
                        Guide de démarrage
                    </Heading>
                    <Text
                        as="p"
                        marginTop="2"

                        color={useColorModeValue('gray.700', 'gray.200')}
                        fontSize="lg">
                        Bienvenue sur notre plateforme d'apprentissage de la sécurité !
                        Dans ce tutoriel, nous allons vous guider à travers les bases de l'utilisation de notre plateforme et vous aider à tirer le meilleur parti de votre expérience d'apprentissage.
                    </Text>
                </Box>
            </Box>
            <Heading marginTop="5">
            </Heading>
            <Box flexWrap="wrap" justifyContent="center" >
                <Divider marginTop="5" height={2} />
                <Wrap p={{ base: 0, lg: 5 }} spacing={{ base: '10px', md: '30px' }} marginTop={{ base: '2', md: '5' }} direction='row'>
                    <Swiper

                        slidesPerView={slidesPerView}
                        spaceBetween={30}
                        centeredSlides={false}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}

                        pagination={{
                            clickable: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        <SwiperSlide >
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%" >
                                    <Stack
                                        minH={{ base: "270px", lg: "250px" }}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={{ base: 6, lg: 3 }}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={useColorModeValue('blue.700', 'blue.500')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Navigation
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                            Une fois connecté, vous serez redirigé vers le tableau de bord. À partir de là, vous pouvez accéder à différentes sections de la plateforme, y compris les cours, les quiz et les certificats. Vous pouvez également accéder à votre profil et suivre votre progression.</Text>

                                    </Stack>

                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        minH={{ base: "270px", lg: "250px" }}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={{ base: 6, lg: 3 }}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={useColorModeValue('blue.700', 'blue.500')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Structure du cours
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                            Nos cours sont divisés en modules qui couvrent des sujets spécifiques. Chaque module contient des vidéos, des articles et des exercices interactifs pour vous aider à apprendre. Pour vous inscrire à un cours, il suffit de cliquer sur le nom du cours et de suivre les instructions.            </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        minH={{ base: "270px", lg: "250px" }}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={{ base: 6, lg: 3 }}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={useColorModeValue('blue.700', 'blue.500')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Ressources d'apprentissage
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                            Nous offrons une variété de ressources d'apprentissage, y compris des vidéos, des articles et des modules interactifs. Vous pouvez accéder à ces ressources à partir des pages de cours ou de l'onglet Ressources dans la barre de navigation.

                                        </Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        minH={{ base: "270px", lg: "250px" }}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={{ base: 6, lg: 3 }}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={useColorModeValue('blue.700', 'blue.500')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Suivi de la progression
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                            Nous suivons votre progression à mesure que vous terminez des cours et des tests. Vous pouvez voir votre progression et voir quels cours vous avez terminés et lesquels vous devez encore terminer.</Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>
                        <SwiperSlide>
                            <WrapItem height={'full'} width={'100%'}>
                                <Box w="100%">
                                    <Stack
                                        minH={{ base: "270px", lg: "250px" }}
                                        bg={useColorModeValue('gray.50', 'gray.800')}
                                        boxShadow={'lg'}
                                        p={{ base: 6, lg: 3 }}
                                        rounded={'xl'}
                                        align={'center'}
                                        pos={'relative'}
                                        _after={{
                                            content: `""`,
                                            w: 0,
                                            h: 0,
                                            borderLeft: 'solid transparent',
                                            borderLeftWidth: 16,
                                            borderRight: 'solid transparent',
                                            borderRightWidth: 16,
                                            borderTop: 'solid',
                                            borderTopWidth: 16,
                                            borderTopColor: useColorModeValue('gray.50', 'gray.800'),
                                            pos: 'absolute',
                                            bottom: '-16px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                        }}>
                                        <Heading fontSize="xl" marginTop="2">
                                            <Link color={useColorModeValue('blue.700', 'blue.500')} textDecoration="none" _hover={{ textDecoration: 'none' }}>
                                                Support technique
                                            </Link>
                                        </Heading>
                                        <Text as="p" fontSize="md" marginTop="2">
                                            Si vous avez besoin d'un support technique, vous pouvez nous contacter en utilisant le formulaire de contact ou par par téléphone. Nous sommes là pour vous aider pour tout problème que vous pourriez rencontrer.</Text>

                                    </Stack>
                                </Box>
                            </WrapItem>
                        </SwiperSlide>

                    </Swiper>



                </Wrap>
            </Box>

        </Container>
    );
};

export default Tutorial;