import { Box, Flex, Text, Button, useColorModeValue } from "@chakra-ui/react";
import {useNavigate} from 'react-router-dom';
  
export default function NotFound() {
    const navigate = useNavigate();

    const bg = useColorModeValue("gray.200", "gray.800");
    const textColor = useColorModeValue("black.600", "gray.300");

    return (
        <Box bg={bg} h="100vh">
            <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                h="100%"
                textAlign="center"
            >
                <Text fontSize="5xl" fontWeight="bold" color={textColor} mb="4">
                    Oops! 404 Not Found
                </Text>
                <Text fontSize="xl" color={textColor} mb="8">
                    La page que vous recherchez n'existe pas.
                </Text>

                <Button
                    colorScheme='yellow'
                    onClick={() => navigate(-1)}>
                    Retourner
                </Button>

            </Flex>
        </Box>
    )
}
