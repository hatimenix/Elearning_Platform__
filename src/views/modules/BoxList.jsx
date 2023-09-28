import { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

const BoxList = ({ boxes }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleClick = () => {
    setIsCollapsed(!isCollapsed);
  }

  const renderedBoxes = isCollapsed ? boxes?.slice(0, 3) : boxes;

  return (
    <Flex direction="column">
      {renderedBoxes?.map((box, index) => (
        <Box key={index} bg="blue.500" p="4" color="white" mb="4">
          {box}
        </Box>
      ))}
      {boxes?.length > 3 && (
        <Box onClick={handleClick} cursor="pointer" textAlign="center">
          {isCollapsed ? `Show ${boxes?.length - 3} more` : 'Show less'}
        </Box>
      )}
    </Flex>
  );
};

export default BoxList;