import { Badge } from '@chakra-ui/react'
import React from 'react'

export default function BadgeC() {
    return (
        <Badge rounded="full" position="absolute"
            top={2}
            left={2} fontSize="0.8em" colorScheme="green">
            Enrolled
        </Badge>
    )
}
