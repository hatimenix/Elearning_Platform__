import { Text } from '@chakra-ui/react';

export default function Test() {

    function GradientText({ children, gradient }) {
        const gradientBg = {
            background: `linear-gradient(to right, ${gradient})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        };

        return (
            <Text fontWeight={'medium'} fontSize="80px" as="span" sx={gradientBg}>
                {children}
            </Text>
        );
    }

    return (
        <GradientText gradient="blue, yellow">Chakra Text</GradientText>

    )
}