import {
  Box,
  Thead,
  Table,
  Flex,
  Tbody,
  Spacer,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Stack,
  useColorModeValue,
  Select,
  TagLabel,
  Tag,
} from "@chakra-ui/react";

import { FaFolderOpen, FaMedal } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import { CheckIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import axiosClient from "../../axios-client";
import MyPagination from "../../components/MyPagination";

function ListeCertificat() {
  const [globalResult, setGlobalResult] = useState([]);
  const [resultats, setResultats] = useState([]);
  const [score, setScore] = useState("");
  const [typeDip, setTypeDip] = useState("tous");
  const [date1, setDate1] = useState(
    format(new Date(2000, 11, 27), "yyyy-MM-dd")
  );
  const [date2, setDate2] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchValue, setSearchValue] = useState("");

  // control dark mode text color
  const mode = useColorModeValue("black", "white")

  //pagination
  const [currentPage, setCurrentPage] = useState(0);
  ////////////////////////////////the size of the table//////////////////////////////
  const PAGE_SIZE = 10;
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [User, setUser] = useState([]);

  //authentification
  useEffect(() => {
    axiosClient.get("/auth/user/").then(({ data }) => {
      // console.log(data);
      setUser(data);
    });
  }, []);

  useEffect(() => {
    axiosClient
      .get(`/certificat/?search=${User.id}`)
      .then(({ data }) => {
        // console.log(data);
        data.map((dat, index) => {
          //convertion de date en format "yyyy-mm-dd"
          const date = new Date(dat.date_obtention);
          date.setDate(date.getDate());
          const formattedDate = date.toISOString().slice(0, 10);
          data[index].date_obtention = formattedDate;
        });
        const sortedData = data.sort().reverse();
        setGlobalResult(sortedData);
        setResultats(sortedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [User]);

  // convertion du format de date
  function dateFormat(dateString) {
    const dateObj = new Date(dateString);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    // Output: "31/03/2023"
    return formattedDate;
  }

  function dateFront(dateF) {
    const [year, month, day] = dateF.split("-");
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    filtrage_search();
  }, [score, typeDip, date1, date2, searchValue]);

  //Filtrer les résultats en fonction de la propriété "tentative"
  const handleScore = (variable) => {
    if (variable === "") {
      setScore(variable);
    } else {
      variable = parseInt(variable);
      setScore(variable);
    }
  };

  //Filtrer les résultats en fonction du typeDiplome
  const handleTypeDiplome = (typeD) => {
    if (typeD === "tous") {
      setTypeDip("tous");
    } else if (typeD === "Attestation") {
      setTypeDip("Attestation");
    } else {
      setTypeDip("Certificat");
    }
  };

  //handle pagination
  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  //filtre date
  const handleDate1 = (dateString) => {
    setDate1(dateString);
  };

  const handleDate2 = (dateString) => {
    setDate2(dateString);
  };

  const filtrage_search = (event) => {
    if (event) event.preventDefault();

    // search
    const lowerCaseSearchString = searchValue.toLowerCase();
    const searchedResult = globalResult.filter(
      (result) =>
        result.formation.toLowerCase().includes(lowerCaseSearchString) ||
        result.module.toLowerCase().includes(lowerCaseSearchString)
    );

    // filtre
    const filteredResultats = searchedResult.filter(
      (resultat) =>
        (score === "" ? true : resultat.resultat >= score) &&
        (typeDip === "tous" ? true : resultat.typeDiplome === typeDip) &&
        resultat.date_obtention >= date1 &&
        resultat.date_obtention <= date2
    );
    setResultats(filteredResultats);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDownloadClick = (certification) => {
    window.open(certification, "_blank");
  };

  return (
    <Box w="100%" p={4} color={mode} borderRadius="xl">
      <Heading
        textAlign={"left"}
        fontSize={{ base: "2xl", sm: "3xl" }}
        fontWeight="bold"
        bgGradient="linear(to-l, #ffd140, #089bd7)"
        bgClip="text"
      >
        Mes diplômes
      </Heading>

      <Stack
        w={"full"}
        maxW="full"
        bg={useColorModeValue("white", "gray.700")}
        rounded={"lg"}
        p={6}
        my={5}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: "column", lg: "row" }}
          w={"100%"}
        >
          <form>
            <InputGroup
              w={{ base: "100%", lg: "100%" }}
              mt={{ base: 0, lg: 7 }}
              mb={{ base: 3, lg: 0 }}
            >
              <Input
                w={{ base: "100%", lg: "100%" }}
                type="search"
                color={useColorModeValue("black", "gray.300")}
                value={searchValue}
                onChange={handleSearchInputChange}
                pr="4.5rem"
                placeholder="Search"
              />
              <InputRightElement width="4.5rem">
                <Button
                  bgColor={"transparent"}
                  h="1.75rem"
                  size="sm"
                  onClick={filtrage_search}
                >
                  <Search2Icon color={useColorModeValue("black", "gray.300")} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </form>
          <Spacer />
          <Flex
            justifyContent="space-between"
            alignItems="center"
            direction={{ base: "column", lg: "row" }}
            w={{ base: "100%", lg: "50%" }}
            textAlign={"center"}
            fontSize={{ base: 9, md: 15 }}
            flex={25}
          >
            <Box w={"100%"} mr={{ base: 0, lg: 3 }}>
              <Text
                fontWeight={"bold"}
                // fontSize={{ base: 7, md: 12 }}
                mb={3}
                color={useColorModeValue("black", "gray.300")}
              >
                Score superieur à
              </Text>
              <form onChange={(e) => handleScore(e.target.value)}>
                <Input
                  mb={{ base: 3, lg: 0 }}
                  color={useColorModeValue("black", "gray.300")}
                  type="number"
                />
              </form>
            </Box>
            <Spacer />
            <Box w={"100%"} mr={{ base: 0, lg: 3 }}>
              <Text
                fontWeight={"bold"}
                mb={3}
                color={useColorModeValue("black", "gray.300")}
              >
                {" "}
                Type Diplôme:
              </Text>
              <Select
                mb={{ base: 3, lg: 0 }}
                color={useColorModeValue("black", "gray.300")}
                onChange={(e) => handleTypeDiplome(e.target.value)}
              >
                <option value="tous">Tous</option>
                <option value="Attestation">Attestation</option>
                <option value="Certificat">Certificat</option>
              </Select>
            </Box>
            <Spacer />
            <Box w={"100%"} mr={{ base: 0, lg: 5 }}>
              <Text
                fontWeight={"bold"}
                mb={3}
                color={useColorModeValue("black", "gray.300")}
              >
                Après le:
              </Text>
              <form onChange={(e) => handleDate1(e.target.value)}>
                <Input
                  mb={{ base: 3, lg: 0 }}
                  color={useColorModeValue("black", "gray.300")}
                  type="date"
                />
              </form>
            </Box>
            <Spacer />
            <Box w={"100%"}>
              <Text
                fontWeight={"bold"}
                color={useColorModeValue("black", "gray.300")}
                mb={3}
              >
                Avant le:
              </Text>
              <form onChange={(e) => handleDate2(e.target.value)}>
                <Input
                  color={useColorModeValue("black", "gray.300")}
                  type="date"
                />
              </form>
            </Box>
          </Flex>
        </Flex>
        <br />

        <TableContainer borderRadius="lg">
          <Table variant="striped">
            <Thead>
              <Tr fontWeight="bold" fontFamily="arial">
                <Th>Formation</Th>
                <Th>Module</Th>
                <Th>Type du diplôme</Th>
                <Th>Resultat</Th>
                <Th>Date d'obtention</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>

            <Tbody>
              {resultats
                .slice(
                  currentPage * pageSize,
                  currentPage * pageSize + pageSize
                )
                .map((result, index) => (
                  <Tr key={index}>
                    <Td fontFamily="serif" fontStyle="italic" fontWeight="bold">
                      {result.formation}
                    </Td>
                    <Td fontFamily="serif">{result.module}</Td>
                    <Td>
                      {result.typeDiplome === "Certificat" ? (
                        <Tag size="lg" colorScheme="teal" borderRadius="full">
                          <FaMedal />
                          <TagLabel ml={2}>{result.typeDiplome}</TagLabel>
                        </Tag>
                      ) : (
                        <Tag
                          size="lg"
                          colorScheme="messenger"
                          borderRadius="full"
                        >
                          <GrCertificate />
                          <TagLabel ml={2}>{result.typeDiplome}</TagLabel>
                        </Tag>
                      )}
                    </Td>
                    <Td size={13} color={"#1EB14C"} fontWeight="bold">
                      {result.resultat}%
                    </Td>
                    <Td>{dateFront(result.date_obtention)}</Td>
                    <Td color={"#1EB14C"}>
                      {" "}
                      <HStack>
                        <button
                          onClick={() =>
                            handleDownloadClick(result.certificat_file)
                          }
                        >
                          <DownloadIcon />
                        </button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}

              {resultats.length === 0 && (
                <Tr>
                  <Td colSpan={6}>
                    Aucune ligne correspondante n'a été trouvée.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex justify="space-between" align="center" w="100%">
          <Box flex="1">
            <MyPagination
              data={resultats}
              // searchInput={search}
              PAGE_SIZE={pageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Box>
          <Select w="70px" value={pageSize} onChange={handlePageSizeChange}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="150">150</option>
            {/* Add more options as needed */}
          </Select>
        </Flex>
      </Stack>
    </Box>
  );
}

export default ListeCertificat;
