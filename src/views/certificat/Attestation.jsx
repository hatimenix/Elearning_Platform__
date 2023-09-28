import {
  Box,
  Heading,
  Center,
  Text,
  Flex,
  HStack,
  Spacer,
} from "@chakra-ui/react";

import React from "react";
import cachet from "../../assets/img/cachet.png";
import cadre_attestation from "../../assets/img/attestation.png";

const Attestation = React.forwardRef((props, ref) => {
  const date = new Date();
  date.setDate(date.getDate());
  const formattedDate = date.toISOString().slice(0, 10);

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

  // bg="#ECF0F1"
  return (
    <Center w="100%" h="100%" ref={ref}>
      <Center
        bg={`url(${cadre_attestation})`}
        bgSize="cover"
        bgPos="center"
        w="100%"
        h="100%"
        color="black"
        maxWidth="900px"
        height={"600px"}
      >
        <Box>
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"}>
              ATTESTATION DE REUSSITE
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"} size={"md"}>
              L'entreprise PAIPERLECK certifie que
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" size={"md"}>
              Mr/Mme {props.UserData.first_name} {props.UserData.last_name}
            </Heading>
          </Center>

          <br />
          <Center>
            <Text fontFamily="serif" fontSize={20}>
              a obtenue cette attestation prouvant sa reussite à l'examen
            </Text>
          </Center>
          <Center>
            <Heading fontFamily="serif" as="h2" size={"lg"}>
              "{props.ModuleData.module}"
            </Heading>
          </Center>
          <br />
          <br />
          <Center>
            <Text fontFamily="serif" fontSize={20}>
              Attestation valide jusqu'au:{" "}
              <span style={{ fontWeight: "bold" }}>19/06/2025</span>
            </Text>
          </Center>

          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Box>
              DATE:{" "}
              <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
                {dateFormat(formattedDate)}
              </span>
            </Box>
            <Spacer />
            <Box
              w="100px"
              h="100px"
              bg={`url(${cachet})`}
              bgSize="cover"
              bgPos="center"
            ></Box>
            <Spacer />
            <Flex alignItems={"center"}>
              <Box>SIGNATURE:</Box>
              <Box>
                <Box style={{ fontWeight: "bold" }}>Mr Teddy Tuzo</Box>

                <Text
                  style={{ textDecoration: "underline" }}
                  fontFamily="serif"
                  fontStyle={"italic"}
                  fontSize="xs"
                >
                  Directeur Paiperleck
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Center>
    </Center>
  );
});

export default Attestation;
