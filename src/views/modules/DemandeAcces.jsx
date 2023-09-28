

import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import axiosClient from '../../axios-client'


function DemandeAcces({ idApprenant, idModule }) {

    const demandeAcces = (idA, idM) => {
        axiosClient.post('/acces/', {
            module: idM,
            apprenant: idA
        })
    }

    return (
        <>
            <Stack direction='row' spacing={4} align='center'>
                <Button colorScheme='teal' variant='outline' onClick={() => { demandeAcces(idApprenant, idModule); window.location.reload() }}>
                    Demandez l'acces
                </Button>
            </Stack>
        </>
    )
}

export default DemandeAcces
