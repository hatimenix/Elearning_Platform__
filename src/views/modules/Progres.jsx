import { Flex, Progress, Stack, Text } from '@chakra-ui/react'
import React from 'react'

function Progres({ color, value, a }) {
    const myAlert = (a) => {

        if (a === "en cours d'activation") {
            return (
                "Traitement d'activation en cours..."
            )
        }
        if (a === "en cours") {
            return (
                "demande en cours..."
            )
        }
    }

    return (
        <Stack spacing={5}>
            <Progress
                style={{ borderRadius: "5px", backgroundColor: "#bec1c470" }}
                hasStripe
                colorScheme={color}
                size='sm'
                value={value}
            />
            <Flex alignItems="center" justifyContent="space-between" style={{ marginTop: "2px" }}>
                <Text fontSize='15px' color='tomato'>
                    {myAlert(a)}
                </Text>
                <Text></Text>
                <Text fontSize='lg' style={{ marginTop: 0, justifyContent: "end", display: "flex" }}>{isNaN(value) ? '0%' : `${Math.round(value)}%`}</Text>
            </Flex>
        </Stack>
    )
}

export default Progres