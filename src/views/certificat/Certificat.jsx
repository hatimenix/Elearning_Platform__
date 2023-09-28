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
import cadre_certificat from "../../assets/img/certificat.png";

const Certificat = React.forwardRef((props, ref) => {
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

  // {{ width: "595pt", height: "842pt" }}
  // style={{ width: "595pt", height: "842pt" }}

  return props.ModuleData.typeDiplome === "Certificat" ? (
    <Center w="100%" h="100%" ref={ref}>
      <Center
        bg={`url(${cadre_certificat})`}
        // bgSize="cover"
        bgSize="100% 100% "
        bgPos="center"
        w="100%"
        h="100%"
        color="black"
        maxWidth="850pt"
        height="550pt"
      >
        <Box>
          <br />
          <Center>
            <Heading size="2xl" fontFamily="serif" fontStyle={"italic"}>
              CERTIFICAT DE REUSSITE
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"} size={"xl"}>
              Ce certificat atteste que
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" size={"xl"}>
              Mr/Mme {props.UserData.first_name} {props.UserData.last_name}
            </Heading>
          </Center>

          <br />
          <Center>
            <Text fontFamily="serif" fontSize={30}>
              a validé avec succés le module
            </Text>
          </Center>
          <Center>
            <Heading fontFamily="serif" as="h2" size={"xl"}>
              "{props.ModuleData.module}"
            </Heading>
          </Center>
          <br />
          <br />
          <Center>
            <Text fontFamily="serif" fontSize={30}>
              Certificat valide jusqu'au:{" "}
              <span style={{ fontWeight: "bold" }}>19/06/2025</span>
            </Text>
          </Center>
          <br />
          <br />

          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Box fontSize={20}>
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
              <Box fontSize={20}>SIGNATURE : </Box>
              <Box ml={3}>
                <Box fontSize={15} style={{ fontWeight: "bold" }}>
                  Mr/Mme Teddy Tuzo
                </Box>

                <Text
                  style={{ textDecoration: "underline" }}
                  fontFamily="serif"
                  fontStyle={"italic"}
                  // fontSize="xs"
                  fontSize={15}
                >
                  Directeur Paiperleck
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Center>
    </Center>
  ) : (
    <Center w="100%" h="100%" ref={ref}>
      <Center
        bg={`url(${cadre_attestation})`}
        // bgSize="cover"
        bgSize="100% 100% "
        bgPos="center"
        w="100%"
        h="100%"
        color="black"
        maxWidth="850pt"
        height="550pt"
      >
        <Box>
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"} size={"2xl"}>
              ATTESTATION DE REUSSITE
            </Heading>
          </Center>
          <br />
          <br />
          <Center>
            <Heading fontFamily="serif" fontStyle={"italic"} size={"xl"}>
              L'entreprise PAIPERLECK certifie que
            </Heading>
          </Center>
          <br />
          <Center>
            <Heading fontFamily="serif" size={"xl"}>
              Mr/Mme {props.UserData.first_name} {props.UserData.last_name}
            </Heading>
          </Center>

          <br />
          <Center>
            <Text fontFamily="serif" fontSize={30}>
              a obtenue cette attestation prouvant sa reussite à l'examen
            </Text>
          </Center>
          <Center>
            <Heading fontFamily="serif" size={"xl"}>
              "{props.ModuleData.module}"
            </Heading>
          </Center>
          <br />
          <br />
          <Center>
            <Text fontFamily="serif" fontSize={30}>
              Attestation valide jusqu'au:{" "}
              <span style={{ fontWeight: "bold" }}>19/06/2025</span>
            </Text>
          </Center>
          <br />
          <br />

          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Box fontSize={20}>
              DATE :{" "}
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
              <Box fontSize={20}>SIGNATURE : </Box>
              <Box ml={3}>
                <Box fontSize={15} style={{ fontWeight: "bold" }}>
                  Mr/Mme Teddy Tuzo
                </Box>

                <Text
                  style={{ textDecoration: "underline" }}
                  fontFamily="serif"
                  fontStyle={"italic"}
                  fontSize={15}
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

export default Certificat;
