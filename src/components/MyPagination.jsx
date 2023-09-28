import React,{useEffect} from 'react' 
import {
    Box,
    HStack,
    Button,
} from "@chakra-ui/react";

function MyPaginantion({data,PAGE_SIZE,currentPage,setCurrentPage}) {

    /////////////////////// Pagination/////////////////////////
    const pageCount = Math.ceil(data.length / PAGE_SIZE);

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };
    useEffect(() => {
        setCurrentPage(0);
    }, []);

    return (
        <Box mt="4">
            <HStack justify="center" align="center">
                <Button

                size="xs"
                    rounded="full"
                    colorScheme="yellow"
                    onClick={() => handlePageClick({ selected: currentPage - 1 })}
                    isDisabled={currentPage === 0}
                    className="pagination-button"
                >

                    Précédent

                </Button>
                {Array.from({ length: pageCount }, (_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = currentPage === index;
                    return (
                        <Button
                            
                            rounded="full"
                            key={index}
                            size="xs"
                            colorScheme={isCurrentPage ? "yellow" : "gray"}
                            onClick={() => handlePageClick({ selected: index })}
                            className="pagination-button"
                        >
                            {pageNumber}
                        </Button>
                    );
                })}
                <Button

                    size="xs"

                    rounded="full"
                    colorScheme="yellow"
                    onClick={() => handlePageClick({ selected: currentPage + 1 })}
                    isDisabled={currentPage === pageCount - 1}
                    className="pagination-button"
                >

                    Suivant

                </Button>
            </HStack>
        </Box>
    )
}

export default MyPaginantion