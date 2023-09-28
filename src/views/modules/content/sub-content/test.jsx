import React, { useEffect, useState, useRef } from "react";
import axiosClient from "../../../../axios-client";
import animationData from "../../../../assets/lot/congrats.json";
import { useNavigate } from "react-router-dom";

//django channel
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { w3cwebsocket as WebSocket } from "websocket";


import {
  Box,
  Button,
  Heading,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  Radio,
  RadioGroup,
  VStack,
  Center,
  useColorModeValue,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { useLocation, useParams, Link } from "react-router-dom";
import Certificat from "../../../certificat/Certificat";
import html2pdf from "html2pdf.js";
import { useStateContext } from "../../../../context/ContextProvider";
import { Navigate } from "react-router-dom";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";

function MyComponent() {
  const [test, setTest] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [trigger, setTrigger] = useState([]);
  const [chap, setChap] = useState([]);
  const [chapIdent, setChapIdent] = useState([]);
  const [questionByChapter, setQuestionByChapter] = useState({});
  const [chapScore, setChapScore] = useState({});
  const [finalChapScore, setFinalChapScore] = useState({});
  const [scoreModule, setScoreModule] = useState(0);
  const [scoreResult, setScoreResult] = useState(undefined);
  const navigate = useNavigate();

  const location = useLocation();

  const [User, setUser] = useState([]);
  const [apprenant, setApprenant] = useState([]);
  const { Gettentative, tentative, restartProgress } = useStateContext();
  const [showScore, setshowScore] = useState(false);


  //recuperation du id module depuis l'url
  const { id } = useParams();
  const certificatRef = useRef(null);

  const [tempsRestant, setTempsRestant] = useState(0);

  let countRadio = 0;
  let countCheckBox = 0;
  let score = 0;
  let ch = {};
  let chapNum = 0;
  // let idresult = undefined;
  // let totalMedias = 1;

  const [totalMedias, setTotalMedias] = useState(1);
  const [timeLeft, setTimeLeft] = useState("00:00:00"); // initial time left is 0 hour (00:00:00)
  const [originalTime, setOriginalTime] = useState(undefined); // initial time left is 0 hour (00:00:00)
  const [totalSeconds, setTotalSeconds] = useState(undefined); // initial time left is 0 hour (00:00:00)
  const [userProgres, setUserProgres] = useState();

  // control dark mode text color
  const mode = useColorModeValue("black", "white")

  //date d'aujourd'huit
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



  useEffect(() => {
    //authentification
    axiosClient.get("/auth/user/").then(({ data }) => {
      setUser(data);
      //obtention des info de l'apprenant
      axiosClient.get(`/apprenants/${data.id}/`)
        .then((appren) => {
          setApprenant(appren.data);
          console.log("apprenant information", appren.data);
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, []);


  useEffect(() => {
    if (originalTime !== undefined && apprenant.id) {
      console.log('start.............');
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/chat/classe/');

      // Ouvrir la connexion WebSocket
      socket.onopen = () => {
        console.log('Connected to WebSocket.');

        // Envoyer un message au serveur une fois la connexion établie
        const messageToSend = {
          temps: originalTime,
          etatTest: apprenant.encours_de_test
        };

        socket.send(JSON.stringify(messageToSend));
        if (!apprenant.encours_de_test) {
          {
            axiosClient
              .patch(`/apprenants/${User.id}/`, {
                encours_de_test: true,
              })
              .then(() => {
                console.log("debut du test")
              })
          }
        }
      };

      // Recevoir un message du serveur
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Message received from server:', data.secondes);
        setTotalSeconds(data.secondes)
        setTimeLeft(data.formatTime)
        if (data.secondes === 0) { return () => socket.close(); }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
      };
      // N'oubliez pas de fermer la connexion WebSocket lorsque le composant est démonté
      return () => socket.close();
    }
  }, [originalTime, apprenant]);





  //timer
  useEffect(() => {
    if (
      User.id &&
      (scoreResult === undefined ||
        (scoreResult !== undefined && scoreResult < test.seuil))
    ) {
      if (showScore) return; //bloquer la minuterie apres submit

      //poster le resultat quant le temps est ecoulé
      if (totalSeconds !== undefined && totalSeconds === 0) {
        const dummyEvent = {
          preventDefault: () => { },
        };

        handleSubmit(dummyEvent);
        return;
      } // stop the timer when time runs out


    }
  }, [timeLeft, setTimeLeft]);


  // //timer
  // useEffect(() => {
  //   if (
  //     User.id &&
  //     (scoreResult === undefined ||
  //       (scoreResult !== undefined && scoreResult < test.seuil))
  //   ) {
  //     const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
  //     const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  //     if (showScore) return; //bloquer la minuterie apres submit

  //     //poster le resultat quant le temps est ecoulé
  //     if (totalSeconds === 0) {
  //       const dummyEvent = {
  //         preventDefault: () => { },
  //       };

  //       handleSubmit(dummyEvent);
  //       return;
  //     } // stop the timer when time runs out

  //     const timer = setTimeout(() => {
  //       const newTotalSeconds = totalSeconds - 1;
  //       const newHours = Math.floor(newTotalSeconds / 3600);
  //       const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
  //       const newSeconds = newTotalSeconds % 60;
  //       const newTimeLeft = `${newHours
  //         .toString()
  //         .padStart(2, "0")}:${newMinutes
  //           .toString()
  //           .padStart(2, "0")}:${newSeconds.toString().padStart(2, "0")}`;
  //       setTimeLeft(newTimeLeft);
  //       localStorage.setItem(`storedTime-${User.id}${id}`, newTimeLeft);
  //       return () => clearTimeout(timer); // clean up the timer when the component unmounts
  //     }, 1000);
  //   }
  // }, [timeLeft, setTimeLeft]);





  useEffect(() => {
    if (apprenant.id) {
      //intialisation des données
      axiosClient
        .get(`/test/${id}/`)
        .then(({ data }) => {
          let chId = [];
          // const listeIdChapitre = [];

          //temps de passage
          setOriginalTime(data.tempdepassage)

          setTest(data);
          // initialisation du nombre de question
          sessionStorage.setItem("nbrQuestion", data.nombredequestion);
          const updatedData = data.question.map((question) => {
            //update the chap state
            chId.push(question.chapitre);
            // listeIdChapitre.push(question.chapitre);
            //correction en cas de plusieurs rendus !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // setChap((prevNumbers) => [...prevNumbers, question.chapitre]);
            const updatedReponses = question.reponses.map((reponse) => {
              return {
                ...reponse,
                isChecked: false,
              };
            });

            return {
              ...question,
              reponses: updatedReponses,
            };
          });
          // console.log("updated data: ", updatedData);
          setChap(chId);
          setQuestions(updatedData);
          setTrigger(updatedData);
          const chIdUnique = [...new Set(chId)];
          // console.log("les id unique du chapitres sont: ", chIdUnique);
          setChapIdent(chIdUnique);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [apprenant]);

  //progres d'utilisateur
  useEffect(() => {
    if (User.id && test.id) {
      axiosClient
        .get(
          `progres/geProgress/?idModule=${test.idModule}&idApprennant=${User.id}`
        )
        .then((res) => {
          setUserProgres(res.data);
          //rediriger vers login si on accede au Url directe
          if (!location.state?.mediac || res.data.progres !== 100.0) {
            // console.log("progressssssifffffffvvv", res.data.progres);
            // return <Navigate to="/formation_" replace />;
            navigate("/formation_", { replace: true });
          }
          // totalMedias = location.state.mediac;
          setTotalMedias(location.state.mediac);
        });
    }
  }, [User, test]);






  useEffect(() => {
    //initialisé à zero les chapId
    for (let i of chap) {
      ch[i] = 0;
    }
    //initialiser à zero le score pour chaque chapitre
    setChapScore(ch);
    // console.log("la note initialiséé: ", ch);
    //calculer le nombre de question par chapitre
    let chCount = { ...ch }; // create a new object with the same values as ch
    for (let j of chap) {
      chCount[j] = chCount[j] + 1;
    }
    //check question state before storing it another time
    setQuestionByChapter(chCount);
    // console.log("voici le nombre de question par chapitre", chCount);
  }, [trigger, User]);

  useEffect(() => {
    //obtention de la tentative
    if (User.id !== undefined && test.difficulter !== undefined) {
      Gettentative(id, User.id, test.difficulter);
    }
  }, [questionByChapter]);



  useEffect(() => {
    // idresult = tentative.idResult;
    setScoreResult(tentative.resultat);


  }, [tentative]);


  //marquer test commencé
  // useEffect(() => {
  //   if (User.id && test.id) {
  //     axiosClient.get(
  //       `/resultat/getidresultat/?idTest=${test.id}&idUser=${User.id}&niveau=${test.difficulter}`
  //     )
  //       .then((res) => {
  //         console.log("info data du test",res.data)
  //       });
  //   }

  // }, [User, test]);




  function chapterScore() {
    let resultatFinal = { ...chapScore };
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const chapitreId = questions[i].chapitre;
      if (question.typeChoix === "unique") {
        for (let j = 0; j < question.reponses.length; j++) {
          const reponse = question.reponses[j];
          if (reponse.isChecked === true && reponse.etat) {
            countRadio++;
            //incrementer le score pour ce chapitre
            resultatFinal[chapitreId] = resultatFinal[chapitreId] + 1;
            // setChapScore(prevData=>({ ...prevData, [chapitreId]: chapScore[chapitreId]+1 }))
            // console.log("le Score pour ce resultat est de: "+resultatFinal)
            break;
          }
        }
      } else if (question.typeChoix === "multiple") {
        let correct = false;
        for (let j = 0; j < question.reponses.length; j++) {
          const reponse = question.reponses[j];
          if (reponse.etat === true && reponse.isChecked === true) {
            correct = true;
          } else if (
            (reponse.etat === true && reponse.isChecked === false) ||
            (reponse.etat === false && reponse.isChecked === true)
          ) {
            correct = false;
            break;
          }
        }
        if (correct) {
          countCheckBox++;
          //incrementer le score pour ce chapitre
          resultatFinal[chapitreId] = resultatFinal[chapitreId] + 1;
          // setChapScore(prevData=>({ ...prevData, [chapitreId]: chapScore[chapitreId]+1 }))
          // console.log("le Score pour ce resultat est de: "+chapScore)
        }
      }
    }
    setChapScore(resultatFinal);
    // console.log("le Score final par chapitre est de: ",resultatFinal)
    return resultatFinal;
  }

  function addMonthsToDate(monthsToAdd, dateStr) {
    const parts = dateStr.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Subtract 1 to match zero-based index
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    date.setMonth(date.getMonth() + monthsToAdd);

    const formattedDates = date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return formattedDates;
  }

  //calculer le score final en pourcententage par chapitre
  function calculFinalScoreByChapter(res) {
    let percScore = { ...res };
    Object.entries(percScore).map(([key, value]) => {
      percScore[key] = (
        (percScore[key] / questionByChapter[key]) *
        100
      ).toFixed(2);
    });
    setFinalChapScore(percScore);
    return percScore;
  }

  //ajout du certificat dans la base de données
  async function handleCertificat(refResultat) {
    try {
      // exportToPDF(certificatRef);
      const pdfBlob = await html2pdf()
        .from(certificatRef.current)
        .outputPdf("blob");
      const formData = new FormData();
      formData.append("idResultat", refResultat); // assuming certificatId is the ID of the certificate you want to associate the PDF with
      formData.append(
        "certificat_file",
        pdfBlob,
        test.typeDiplome === "Attestation"
          ? `Attestation${id}_${User.email}.pdf`
          : `Certificat${id}_${User.email}.pdf`
      );
      // console.log("Voici le formeData:", formData);
      await axiosClient.post("/certificat/", formData);
      // console.log("PDF uploaded successfully!");
    } catch (error) {
      console.log(error);
    }
  }

  // console.log(
  //   "la nouvelle date est ::",
  //   addMonthsToDate(14, dateFormat(formattedDate))
  // );
  function restartChapter(scoreParChap) {
    let chapFail = [];
    let scorePercent = { ...scoreParChap };
    Object.entries(scorePercent).map(([key, value]) => {
      if (value < test.seuil) {
        chapFail.push(key);
      }
    });

    const etat = restartProgress(User.id, id, chapFail, totalMedias);
    // console.log("etat de restart: ", etat);
  }

  // sauvegarde du certificat en local
  function exportToPDF(ref) {
    const options = {
      margin: 0,
      filename: "certificate.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" }, // Changed unit to 'pt'
    };

    html2pdf().set(options).from(ref.current).save();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const res = chapterScore();
    // console.log("voici les notes", chapScore);
    const finalRes = calculFinalScoreByChapter(res);
    // console.log("voici vos notes en pourcentage par chapitres", finalRes);
    score = (
      ((countRadio + countCheckBox) * 100) /
      sessionStorage.getItem("nbrQuestion")
    ).toFixed(2);
    setScoreModule(score);
    setshowScore(true);

    //post or update result and certificat
    const formdata = {
      resultat: parseFloat(score),
      scoreByChap: finalRes,
      tentative: 1,
      idTest: parseInt(id),
      idUser: User.id,
      niveau: test.difficulter,
      valider: score >= test.seuil ? true : false,
    };

    const postTestResultat = async (formdataresultat) => {
      await axiosClient
        .post("/resultat/", formdataresultat)
        .then(() => {
          //post certificat after the post
          if (score >= test.seuil) {
            axiosClient
              .get(
                `/resultat/getidresultat/?idTest=${id}&idUser=${User.id}&niveau=${test.difficulter}`
              )
              .then(({ data }) => {
                //poster le certificat
                // handleCertificat(data.idResult);
                const resultData = data;
                console.log("le type de id Resultat:", typeof resultData.idResult);


                axiosClient
                  .get(`/test/?search=${test.idModule}`)
                  .then(({ data }) => {
                    //poster le certificat
                    // handleCertificat(data.idResult);

                    //demander le certificat si le test courant represente le dernier test du module
                    if (test.id === data[data.length - 1].id) {
                      const formData = new FormData();
                      formData.append("idResultat", resultData.idResult);
                      formData.append("first_name", User.first_name);
                      formData.append("last_name", User.last_name);
                      formData.append("titre_module", test.module);
                      formData.append(
                        "dateValiditeDiplome",
                        addMonthsToDate(
                          test.validite,
                          dateFormat(formattedDate)
                        )
                      );
                      formData.append(
                        "date_de_passage_de_test",
                        dateFormat(formattedDate)
                      );
                      formData.append("typeDiplome", test.typeDiplome);
                      formData.append("signateur", test.signateur);
                      axiosClient.post("/demandeDiplome/", formData);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            restartChapter(finalRes);
          }
        })
        .catch((error) => {
          // Handle any errors that occur during the post request
          console.error("Error occurred during post request:", error);
        });
    };

    postTestResultat(formdata);

    //remonte au debut de la page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleCheck = (event, index, index2) => {
    const { value, checked } = event.target;
    // console.log(value);
    const newQuestions = [...questions];
    const newQuestion = { ...newQuestions[index] };
    const newResponses = [...newQuestion.reponses];
    const newResponse = { ...newResponses[index2] };
    newResponse.isChecked = checked;

    //remettre is checked à false des input radio qui ne sont plus selectionnés
    if (newQuestion.typeChoix === "unique") {
      for (let i = 0; i < newResponses.length; i++) {
        if (i !== index2) {
          newResponses[i].isChecked = false;
          // console.log("le type de choix est unique: ", newResponses[i]);
        }
      }
    }

    newResponses[index2] = newResponse;
    newQuestion.reponses = newResponses;
    newQuestions[index] = newQuestion;

    setQuestions(newQuestions);
  };

  const confetti = {
    light: {
      primary: "8fce00", // blue.400
      secondary: "2fff78", // blue.100
    },

    dark: {
      primary: "1a365d", // blue.900
      secondary: "2A4365", // blue.800
    },
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const CONFETTI_LIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1500' height='745' viewBox='0 0 1600 800'%3E%3Cpath fill='%23${confetti.light.primary}' d='M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z'/%3E%3Cpath fill='%23${confetti.light.secondary}' d='M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z'/%3E%3Cg fill-opacity='0.48' fill='%23FFF'%3E%3Cpath d='M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7zM740.4 421.4c1.5-.2 3 .5 3.8 1.9 1.1 1.8.4 4.2-1.4 5.3-3.7 2.1-6.4 5.6-7.6 9.5-1.2 4-.8 8.4 1.1 12.1.4.9 1 1.7 1.6 2.7 1 1.7 2.2 3.5 3 5.7 1.4 4 1.2 8.7-.6 13.2-1.4 3.4-3.5 6.6-6.8 10.1-1.5 1.6-3.9 1.7-5.5.2-1.6-1.4-1.7-3.9-.2-5.4 2.6-2.8 4.3-5.3 5.3-7.7 1.1-2.8 1.3-5.6.5-7.9-.5-1.3-1.3-2.7-2.2-4.1-.6-1-1.3-2.1-1.9-3.2-2.8-5.4-3.4-11.9-1.7-17.8 1.8-5.9 5.8-11 11.2-14C739.4 421.6 739.9 421.4 740.4 421.4zM261.3 590.9c5.7 6.8 9 15.7 9.4 22.4.5 7.3-2.4 16.4-10.2 20.4-3 1.5-6.7 2.2-11.2 2.2-7.9-.1-12.9-2.9-15.4-8.4-2.1-4.7-2.3-11.4 1.8-15.9 3.2-3.5 7.8-4.1 11.2-1.6 1.2.9 1.5 2.7.6 3.9-.9 1.2-2.7 1.5-3.9.6-1.8-1.3-3.6.6-3.8.8-2.4 2.6-2.1 7-.8 9.9 1.5 3.4 4.7 5 10.4 5.1 3.6 0 6.4-.5 8.6-1.6 4.7-2.4 7.7-8.6 7.2-15-.5-7.3-5.3-18.2-13-23.9-4.2-3.1-8.5-4.1-12.9-3.1-3.1.7-6.2 2.4-9.7 5-6.6 5.1-11.7 11.8-14.2 19-2.7 7.7-2.1 15.8 1.9 23.9.7 1.4.1 3.1-1.3 3.7-1.4.7-3.1.1-3.7-1.3-4.6-9.4-5.4-19.2-2.2-28.2 2.9-8.2 8.6-15.9 16.1-21.6 4.1-3.1 8-5.1 11.8-6 6-1.4 12 0 17.5 4C257.6 586.9 259.6 588.8 261.3 590.9z'/%3E%3Ccircle cx='1013.7' cy='153.9' r='7.1'/%3E%3Ccircle cx='1024.3' cy='132.1' r='7.1'/%3E%3Ccircle cx='1037.3' cy='148.9' r='7.1'/%3E%3Cpath d='M1508.7 297.2c-4.8-5.4-9.7-10.8-14.8-16.2 5.6-5.6 11.1-11.5 15.6-18.2 1.2-1.7.7-4.1-1-5.2-1.7-1.2-4.1-.7-5.2 1-4.2 6.2-9.1 11.6-14.5 16.9-4.8-5-9.7-10-14.7-14.9-1.5-1.5-3.9-1.5-5.3 0-1.5 1.5-1.5 3.9 0 5.3 4.9 4.8 9.7 9.8 14.5 14.8-1.1 1.1-2.3 2.2-3.5 3.2-4.1 3.8-8.4 7.8-12.4 12-1.4 1.5-1.4 3.8 0 5.3 0 0 0 0 0 0 1.5 1.4 3.9 1.4 5.3-.1 3.9-4 8.1-7.9 12.1-11.7 1.2-1.1 2.3-2.2 3.5-3.3 4.9 5.3 9.8 10.6 14.6 15.9.1.1.1.1.2.2 1.4 1.4 3.7 1.5 5.2.2C1510 301.2 1510.1 298.8 1508.7 297.2zM327.6 248.6l-.4-2.6c-1.5-11.1-2.2-23.2-2.3-37 0-5.5 0-11.5.2-18.5 0-.7 0-1.5 0-2.3 0-5 0-11.2 3.9-13.5 2.2-1.3 5.1-1 8.5.9 5.7 3.1 13.2 8.7 17.5 14.9 5.5 7.8 7.3 16.9 5 25.7-3.2 12.3-15 31-30 32.1L327.6 248.6zM332.1 179.2c-.2 0-.3 0-.4.1-.1.1-.7.5-1.1 2.7-.3 1.9-.3 4.2-.3 6.3 0 .8 0 1.7 0 2.4-.2 6.9-.2 12.8-.2 18.3.1 12.5.7 23.5 2 33.7 11-2.7 20.4-18.1 23-27.8 1.9-7.2.4-14.8-4.2-21.3l0 0C347 188.1 340 183 335 180.3 333.6 179.5 332.6 179.2 332.1 179.2zM516.3 60.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C517.3 60.4 516.8 60.8 516.3 60.8zM506.1 70.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C506.4 70.5 506.2 70.5 506.1 70.5zM494.1 64.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C494.7 64.3 494.4 64.4 494.1 64.4zM500.5 55.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C500.9 55.3 500.7 55.3 500.5 55.3zM506.7 55c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C507.4 54.8 507.1 55 506.7 55zM1029.3 382.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C1030.3 382.4 1029.8 382.8 1029.3 382.8zM1019.1 392.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C1019.4 392.5 1019.2 392.5 1019.1 392.5zM1007.1 386.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C1007.7 386.3 1007.4 386.4 1007.1 386.4zM1013.5 377.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C1013.9 377.3 1013.7 377.3 1013.5 377.3zM1019.7 377c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C1020.4 376.8 1020.1 377 1019.7 377zM1329.7 573.4c-1.4 0-2.9-.2-4.5-.7-8.4-2.7-16.6-12.7-18.7-20-.4-1.4-.7-2.9-.9-4.4-8.1 3.3-15.5 10.6-15.4 21 0 1.5-1.2 2.7-2.7 2.8 0 0 0 0 0 0-1.5 0-2.7-1.2-2.7-2.7-.1-6.7 2.4-12.9 7-18 3.6-4 8.4-7.1 13.7-8.8.5-6.5 3.1-12.9 7.4-17.4 7-7.4 18.2-8.9 27.3-10.1l.7-.1c1.5-.2 2.9.9 3.1 2.3.2 1.5-.9 2.9-2.3 3.1l-.7.1c-8.6 1.2-18.4 2.5-24 8.4-3 3.2-5 7.7-5.7 12.4 7.9-1 17.7 1.3 24.3 5.7 4.3 2.9 7.1 7.8 7.2 12.7.2 4.3-1.7 8.3-5.2 11.1C1335.2 572.4 1332.6 573.4 1329.7 573.4zM1311 546.7c.1 1.5.4 3 .8 4.4 1.7 5.8 8.7 14.2 15.1 16.3 2.8.9 5.1.5 7.2-1.1 2.7-2.1 3.2-4.8 3.1-6.6-.1-3.2-2-6.4-4.8-8.3C1326.7 547.5 1317.7 545.6 1311 546.7z'/%3E%3C/g%3E%3C/svg%3E")`;
  const CONFETTI_DARK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1500' height='745' viewBox='0 0 1600 800'%3E%3Cpath fill='%23${confetti.dark.primary}' d='M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z'/%3E%3Cpath fill='%23${confetti.dark.secondary}' d='M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z'/%3E%3Cg fill-opacity='0.05' fill='%23FFF'%3E%3Cpath d='M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7zM740.4 421.4c1.5-.2 3 .5 3.8 1.9 1.1 1.8.4 4.2-1.4 5.3-3.7 2.1-6.4 5.6-7.6 9.5-1.2 4-.8 8.4 1.1 12.1.4.9 1 1.7 1.6 2.7 1 1.7 2.2 3.5 3 5.7 1.4 4 1.2 8.7-.6 13.2-1.4 3.4-3.5 6.6-6.8 10.1-1.5 1.6-3.9 1.7-5.5.2-1.6-1.4-1.7-3.9-.2-5.4 2.6-2.8 4.3-5.3 5.3-7.7 1.1-2.8 1.3-5.6.5-7.9-.5-1.3-1.3-2.7-2.2-4.1-.6-1-1.3-2.1-1.9-3.2-2.8-5.4-3.4-11.9-1.7-17.8 1.8-5.9 5.8-11 11.2-14C739.4 421.6 739.9 421.4 740.4 421.4zM261.3 590.9c5.7 6.8 9 15.7 9.4 22.4.5 7.3-2.4 16.4-10.2 20.4-3 1.5-6.7 2.2-11.2 2.2-7.9-.1-12.9-2.9-15.4-8.4-2.1-4.7-2.3-11.4 1.8-15.9 3.2-3.5 7.8-4.1 11.2-1.6 1.2.9 1.5 2.7.6 3.9-.9 1.2-2.7 1.5-3.9.6-1.8-1.3-3.6.6-3.8.8-2.4 2.6-2.1 7-.8 9.9 1.5 3.4 4.7 5 10.4 5.1 3.6 0 6.4-.5 8.6-1.6 4.7-2.4 7.7-8.6 7.2-15-.5-7.3-5.3-18.2-13-23.9-4.2-3.1-8.5-4.1-12.9-3.1-3.1.7-6.2 2.4-9.7 5-6.6 5.1-11.7 11.8-14.2 19-2.7 7.7-2.1 15.8 1.9 23.9.7 1.4.1 3.1-1.3 3.7-1.4.7-3.1.1-3.7-1.3-4.6-9.4-5.4-19.2-2.2-28.2 2.9-8.2 8.6-15.9 16.1-21.6 4.1-3.1 8-5.1 11.8-6 6-1.4 12 0 17.5 4C257.6 586.9 259.6 588.8 261.3 590.9z'/%3E%3Ccircle cx='1013.7' cy='153.9' r='7.1'/%3E%3Ccircle cx='1024.3' cy='132.1' r='7.1'/%3E%3Ccircle cx='1037.3' cy='148.9' r='7.1'/%3E%3Cpath d='M1508.7 297.2c-4.8-5.4-9.7-10.8-14.8-16.2 5.6-5.6 11.1-11.5 15.6-18.2 1.2-1.7.7-4.1-1-5.2-1.7-1.2-4.1-.7-5.2 1-4.2 6.2-9.1 11.6-14.5 16.9-4.8-5-9.7-10-14.7-14.9-1.5-1.5-3.9-1.5-5.3 0-1.5 1.5-1.5 3.9 0 5.3 4.9 4.8 9.7 9.8 14.5 14.8-1.1 1.1-2.3 2.2-3.5 3.2-4.1 3.8-8.4 7.8-12.4 12-1.4 1.5-1.4 3.8 0 5.3 0 0 0 0 0 0 1.5 1.4 3.9 1.4 5.3-.1 3.9-4 8.1-7.9 12.1-11.7 1.2-1.1 2.3-2.2 3.5-3.3 4.9 5.3 9.8 10.6 14.6 15.9.1.1.1.1.2.2 1.4 1.4 3.7 1.5 5.2.2C1510 301.2 1510.1 298.8 1508.7 297.2zM327.6 248.6l-.4-2.6c-1.5-11.1-2.2-23.2-2.3-37 0-5.5 0-11.5.2-18.5 0-.7 0-1.5 0-2.3 0-5 0-11.2 3.9-13.5 2.2-1.3 5.1-1 8.5.9 5.7 3.1 13.2 8.7 17.5 14.9 5.5 7.8 7.3 16.9 5 25.7-3.2 12.3-15 31-30 32.1L327.6 248.6zM332.1 179.2c-.2 0-.3 0-.4.1-.1.1-.7.5-1.1 2.7-.3 1.9-.3 4.2-.3 6.3 0 .8 0 1.7 0 2.4-.2 6.9-.2 12.8-.2 18.3.1 12.5.7 23.5 2 33.7 11-2.7 20.4-18.1 23-27.8 1.9-7.2.4-14.8-4.2-21.3l0 0C347 188.1 340 183 335 180.3 333.6 179.5 332.6 179.2 332.1 179.2zM516.3 60.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C517.3 60.4 516.8 60.8 516.3 60.8zM506.1 70.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C506.4 70.5 506.2 70.5 506.1 70.5zM494.1 64.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C494.7 64.3 494.4 64.4 494.1 64.4zM500.5 55.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C500.9 55.3 500.7 55.3 500.5 55.3zM506.7 55c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C507.4 54.8 507.1 55 506.7 55zM1029.3 382.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C1030.3 382.4 1029.8 382.8 1029.3 382.8zM1019.1 392.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C1019.4 392.5 1019.2 392.5 1019.1 392.5zM1007.1 386.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C1007.7 386.3 1007.4 386.4 1007.1 386.4zM1013.5 377.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C1013.9 377.3 1013.7 377.3 1013.5 377.3zM1019.7 377c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C1020.4 376.8 1020.1 377 1019.7 377zM1329.7 573.4c-1.4 0-2.9-.2-4.5-.7-8.4-2.7-16.6-12.7-18.7-20-.4-1.4-.7-2.9-.9-4.4-8.1 3.3-15.5 10.6-15.4 21 0 1.5-1.2 2.7-2.7 2.8 0 0 0 0 0 0-1.5 0-2.7-1.2-2.7-2.7-.1-6.7 2.4-12.9 7-18 3.6-4 8.4-7.1 13.7-8.8.5-6.5 3.1-12.9 7.4-17.4 7-7.4 18.2-8.9 27.3-10.1l.7-.1c1.5-.2 2.9.9 3.1 2.3.2 1.5-.9 2.9-2.3 3.1l-.7.1c-8.6 1.2-18.4 2.5-24 8.4-3 3.2-5 7.7-5.7 12.4 7.9-1 17.7 1.3 24.3 5.7 4.3 2.9 7.1 7.8 7.2 12.7.2 4.3-1.7 8.3-5.2 11.1C1335.2 572.4 1332.6 573.4 1329.7 573.4zM1311 546.7c.1 1.5.4 3 .8 4.4 1.7 5.8 8.7 14.2 15.1 16.3 2.8.9 5.1.5 7.2-1.1 2.7-2.1 3.2-4.8 3.1-6.6-.1-3.2-2-6.4-4.8-8.3C1326.7 547.5 1317.7 545.6 1311 546.7z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <Box
      textAlign={"left"}
      w="100%"
      p={{ base: 2, md: 5 }}
      color={mode}
      borderRadius="xl"
    // css={{
    //   backgroundImage: CONFETTI_LIGHT,
    //   backgroundAttachment: 'fixed',
    // }}
    >
      {scoreResult !== undefined &&
        (scoreResult >= test.seuil ? (
          <Box>
            <Box textAlign="center" py={5} px={6}>
              <Flex alignItems="center" justifyContent="center" mb={5}>
                <Box p={5}>
                  <Lottie height={100} width={100} options={defaultOptions} />
                </Box>
                <Box>
                  <Heading
                    size="3xl"
                    fontStyle="oblique"
                    fontFamily="serif"
                    mt={10}
                    color="blue.400"
                  >
                    Félicitations
                  </Heading>
                </Box>
              </Flex>

              <Text
                fontWeight={"bold"}
                fontFamily={"serif"}
                fontSize={"2xl"}
                color={"black.500"}
              >
                Vous avez réussi le test avec un score de {scoreResult} %, votre
                diplôme apparaitra dans la section mes diplômes une fois que vous aurez validé tous les tests et que le
                Responsable du module aura validé votre demande de diplôme.
              </Text>
            </Box>

            <Flex mt={5} justify={"center"}>
              <Button
                mr={3}
                w={{ base: 100, md: 179 }}
                mb={{ base: 10, md: 30 }}
                // fontSize={{ base: "2vw", md: 20 }}
                fontSize={{ base: 12, md: 20 }}
                colorScheme="green"
              >
                <Link to="/formation_">Revenez au cours </Link>
              </Button>
            </Flex>
          </Box>
        ) : (
          <span></span>
        ))}

      {scoreModule !== null && showScore && (
        <Box textAlign={"center"}>
          <CircularProgress
            size={{ base: 20, md: 106 }}
            value={scoreModule}
            color={scoreModule < test.seuil ? "red" : "green.400"}
          >
            <CircularProgressLabel
              fontSize={{ base: 12, md: 18 }}
              color={scoreModule < test.seuil ? "red" : "green.400"}
              fontWeight={"bold"}
            >
              {scoreModule}%
            </CircularProgressLabel>
          </CircularProgress>
          {scoreModule < test.seuil ? (
            <Text
              fontSize={{ base: 15, md: 24 }}
              color="red"
              fontWeight={"bold"}
              fontFamily={"Arial"}
            >
              Vous avez besoin de plus de {test.seuil} % pour réussir le test
            </Text>
          ) : (
            // <Text
            //   fontSize={{ base: 15, md: 24 }}
            //   color="green"
            //   fontWeight={"bold"}
            //   fontFamily={"Arial"}
            // >
            //   Vous avez réussi le test avec un score de {scoreModule} % votre
            //   certificat apparaitra dans la section mes certificat dés que le
            //   Responsable du module l'aura validé.
            // </Text>
            <Box textAlign="center" py={5} px={6}>
              <Flex alignItems="center" justifyContent="center" mb={5}>
                <Box p={5}>
                  <Lottie height={100} width={100} options={defaultOptions} />
                </Box>
                <Box>
                  <Heading
                    size="3xl"
                    fontStyle="oblique"
                    fontFamily="serif"
                    mt={10}
                    color="blue.400"
                  >
                    Félicitations
                  </Heading>
                </Box>
              </Flex>

              <Text
                fontWeight={"bold"}
                fontFamily={"serif"}
                fontSize={"2xl"}
                color={"black.500"}
              >
                Vous avez réussi le test avec un score de {scoreModule} %, votre
                diplôme apparaitra dans la section mes diplômes une fois que vous aurez validé tous les tests et que le
                Responsable du module aura validé votre demande de diplôme.
              </Text>
            </Box>
          )}
        </Box>
      )}

      {((scoreResult !== undefined && scoreResult < test.seuil) ||
        scoreResult === undefined) &&
        (showScore && scoreModule >= test.seuil ? (
          <Box>
            <Flex mt={5} justify={"center"}>
              <Button
                mr={3}
                w={{ base: 100, md: 179 }}
                mb={{ base: 10, md: 30 }}
                // fontSize={{ base: "2vw", md: 20 }}
                fontSize={{ base: 12, md: 20 }}
                colorScheme="green"
              >
                <Link to="/formation_">Revenez au cours </Link>
              </Button>
            </Flex>
          </Box>
        ) : (
          <>
            <VStack>
              <Heading
                fontStyle="italic"
                textAlign={"Center"}
                color={"#1a365d"}
                fontSize={{ base: 22, md: 30 }}
              >
                Test {test.module}
              </Heading>
              <br />

              <Text ml={{ base: 15, md: 24 }}>{test.description}</Text>
              <br />

              <Heading
                ml={{ base: 10, md: 20 }}
                fontSize={{ base: 18, md: 22 }}
                textAlign={"Left"}
                color={"#1a365d"}
              >
                Objectif du test
              </Heading>
              <Text ml={{ base: 15, md: 24 }}>{test.objectif}</Text>
              <br />
              <Box
                ml={{ base: 15, md: 24 }}
                bg="black"
                h={1}
                w={"90%"}
                mt={{ base: 15, md: 25 }}
              />

              <Box
                borderWidth={1}
                borderColor={"black"}
                w={{ base: "20%", md: "15%" }}
                textAlign={"center"}
                alignItems={"center"}
                fontWeight={"bold"}
                borderRadius={{ base: 2, md: 5 }}
                p={1}
                h={{ base: 7, md: 10 }}
                bg={"white"}
                border={0}
                fontSize={{ base: 8, md: "1.5vw" }}
                style={{
                  color: timeLeft < "00:05:00" ? "red" : "black",
                  position: "fixed",
                  top: 110, // adjust this value to set the vertical position of the component
                  right: 40, // adjust this value to set the horizontal position of the component
                  zIndex: 2, // adjust this value to set the stacking order of the component
                  // fontSize: "1.5vw",
                }}
              >
                Time left: {timeLeft}
              </Box>
            </VStack>

            <Box textAlign={"left"} paddingLeft={{ base: 2, md: 20 }}>
              <form onSubmit={handleSubmit}>
                {chapIdent.map((chapClee) => {
                  chapNum++;

                  return (
                    <Box key={chapClee}>
                      <Heading
                        mt={{ base: 10, md: 30 }}
                        fontSize={{ base: 15, md: 25 }}
                        fontWeight={"bold"}
                        color={"#D9B917"}
                      >
                        Chapitre {chapNum}:
                        {showScore && (
                          <CircularProgress
                            ml={{ base: 5, md: 20 }}
                            size={{ base: 20, md: 40 }}
                            value={finalChapScore[chapClee]}
                            color={
                              finalChapScore[chapClee] < test.seuil
                                ? "red"
                                : "green.400"
                            }
                          >
                            <CircularProgressLabel
                              fontSize={{ base: 10, md: 20 }}
                              color={
                                finalChapScore[chapClee] < test.seuil
                                  ? "red"
                                  : "green.400"
                              }
                              fontWeight={"bold"}
                            >
                              {finalChapScore[chapClee]}%
                            </CircularProgressLabel>
                          </CircularProgress>
                        )}
                      </Heading>

                      {questions.map(
                        (question, index) =>
                          //afficher les question par chapitre
                          chapClee === question.chapitre && (
                            <Box
                              mt={{ base: 2, md: 5 }}
                              key={index}
                              pl={{ base: 5, md: 10 }}
                            >
                              <Text
                                fontSize={{ base: 15, md: 22 }}
                                fontWeight={"bold"}
                                fontFamily={"Arial"}
                                color={"#1a365d"}
                              >
                                {question.question}
                              </Text>

                              {question.typeChoix === "unique" ? (
                                <RadioGroup>
                                  <Stack spacing={4} direction="column">
                                    {question.reponses.map(
                                      (reponse, index2) => (
                                        <Box
                                          pl={{ base: 5, md: 10 }}
                                          key={index2}
                                          textColor={
                                            showScore &&
                                            (!reponse.etat && reponse.isChecked
                                              ? "red"
                                              : reponse.etat &&
                                                reponse.isChecked
                                                ? "green"
                                                : null)
                                          }
                                        >
                                          <Radio
                                            // type="radio"
                                            key={`response${index2}`}
                                            name={`response${index}`}
                                            checked={reponse.isChecked}
                                            value={reponse.reponse}
                                            onChange={(event) =>
                                              handleCheck(event, index, index2)
                                            }
                                          >
                                            {reponse.reponse}
                                          </Radio>
                                        </Box>
                                      )
                                    )}
                                  </Stack>
                                </RadioGroup>
                              ) : (
                                <CheckboxGroup>
                                  <Stack spacing={4} direction="column">
                                    {question.reponses.map(
                                      (reponse, index2) => (
                                        <Box
                                          pl={{ base: 5, md: 10 }}
                                          key={index2}
                                          textColor={
                                            showScore &&
                                            (!reponse.etat && reponse.isChecked
                                              ? "red"
                                              : reponse.etat &&
                                                reponse.isChecked
                                                ? "green"
                                                : null)
                                          }
                                        >
                                          <Checkbox
                                            key={`question${index2}`}
                                            name={`question${index2}`}
                                            value={reponse.reponse}
                                            checked={reponse.isChecked}
                                            onChange={(event) =>
                                              handleCheck(event, index, index2)
                                            }
                                          >
                                            {reponse.reponse}
                                          </Checkbox>
                                        </Box>
                                      )
                                    )}
                                  </Stack>
                                </CheckboxGroup>
                              )}
                              <br />
                              <Text pl={{ base: 5, md: 10 }}>
                                {question.explicationdelaquestion}
                              </Text>

                              <br />
                            </Box>
                          )
                      )}
                    </Box>
                  );
                })}
                {showScore ? (
                  <Flex mt={5} justify={"end"}>
                    <Button
                      mr={3}
                      w={{ base: 100, md: 179 }}
                      mb={{ base: 10, md: 30 }}
                      // fontSize={{ base: "2vw", md: 20 }}
                      fontSize={{ base: 12, md: 20 }}
                      colorScheme="green"
                    >
                      <Link to="/formation_">Revenez au cours </Link>
                    </Button>
                  </Flex>
                ) : (
                  <Box textAlign={"Center"} ml={"65%"}>
                    <Button
                      backgroundColor={"#FFD140"}
                      borderRadius={{ base: 10, md: 15 }}
                      fontSize={{ base: 12, md: 20 }}
                      type="submit"
                    >
                      Valider
                    </Button>
                  </Box>
                )}
              </form>
            </Box>
          </>
        ))}
    </Box>
  );
}

export default MyComponent;
