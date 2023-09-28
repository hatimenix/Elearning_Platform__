import { Badge, Stack } from '@chakra-ui/react'
import React from 'react'

function BadgeComponent({ statut, color }) {
    return (
        <>
            <Stack direction='row'>
                <Badge position="absolute" style={{ left: "22px", top: "25px" }} rounded="full" fontSize={10} px={3} py={1} colorScheme={color} >{statut}</Badge>
            </Stack>
        </>
    )
}

export default BadgeComponent