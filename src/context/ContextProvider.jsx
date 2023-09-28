import { createContext, useContext, useState } from "react";
import axios from "axios";
import axiosClient from "../axios-client";

const StateContext = createContext({
  currentUser: null,
  token: null,
  notification: null,
  setUser: () => {},
  setToken: () => {},
  setNotification: () => {},
  setIsLoading: () => {},
  data: [],
  setData: () => {},
  Module: [],
  setModule: () => {},
  idgetModule: [],
  setgetModule: () => {},
  Formation: [],
  setFormation: () => {},
  tentative: [],
  setnombretentative: () => {},
  idtentative: null,
  setIdtentative: () => {},
  idscore: 0,
  setscore: () => {},
  reponse: [],
  setreponse: () => {},
  idtest: null,
  setId: () => {},
  statdata: [],
  setstatdata: () => {},
  question: [],
  setquestion: () => {},
  test: [],
  settest: () => {},
  edittest: [],
  setteditest: () => {},
  details: [],
  restart: [],
  setdetails: () => {},
  postdata: () => {},
  putdata: () => {},
  fetchData: () => {},
  fetchDataStat: () => {},
  statquestion: () => {},
  fetchModule: () => {},
  getModule: () => {},
  fetchFormatione: () => {},
  post: () => {},
  postresultat: () => {},
  Gettentative: () => {},
  Restart: () => {},
  postcerif: [],
  setpostcerif: () => {},
  Postcertificat: () => {},
  getcerif: [],
  setgetcerif: () => {},
  setrestart: () => {},
  Getcertificat: () => {},
  restartProgress: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(
    localStorage.getItem("ACCESS_STUDENT_TOKEN")
  );
  const [refresh, _setRefresh] = useState(
    localStorage.getItem("REFRESH_TOKEN")
  );
  const [notification, _setNotification] = useState("");
  const [isLoading, _setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [Module, setModule] = useState([]);
  const [idgetModule, setgetModule] = useState([]);
  const [Formation, setFormation] = useState([]);
  const [tentative, setnombretentative] = useState([]);
  const [restart, setrestart] = useState([]);
  const [idtentative, setIdtentative] = useState(null);
  const [idscore, setscore] = useState(0);
  const [reponse, setreponse] = useState([]);
  const [idtest, setId] = useState(null);
  const [statdata, setstatdata] = useState([]);
  const [question, setquestion] = useState([]);
  const [test, settest] = useState([]);
  const [edittest, setteditest] = useState([]);
  const [details, setdetails] = useState([]);
  const [postcerif, setpostcerif] = useState([]);
  const [getcerif, setgetcerif] = useState([]);
  const [progressResult, setProgressResult] = useState([]);

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_STUDENT_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_STUDENT_TOKEN");
    }
  };

  const setRefresh = (refresh) => {
    _setRefresh(refresh);
    if (refresh) {
      localStorage.setItem("REFRESH_TOKEN", refresh);
    } else {
      localStorage.removeItem("REFRESH_TOKEN");
    }
  };

  const setNotification = (message) => {
    _setNotification(message);

    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };

  const setIsLoading = (v) => {
    _setIsLoading(v);
  };

  const fetchData = async (id) => {
    const response = await axiosClient.get(`/test/${id}/`);
    setData(response.data);
    const idtest = response.data.id;
    setId(idtest);
    return idtest;
  };

  const postdatadetails = async (id) => {
    const postestdetial = await axios.get(`http://127.0.0.1:8000/test/${id}`);
    setdetails(postestdetial.data);
  };

  const postdata = async (formdata) => {
    const postest = await axios.post("http://127.0.0.1:8000/test/", formdata);
    settest(postest.data);
  };

  const putdata = async (formdata) => {
    const edittest = await axios.put("http://127.0.0.1:8000/test/", formdata);
    setteditest(edittest.data);
  };

  const fetchDataStat = async () => {
    const stat = await axios.get("http://127.0.0.1:8000/test/");
    setstatdata(stat.data);
  };

  const statquestion = async () => {
    const statquestion = await axios.get(
      "http://127.0.0.1:8000/Test/total_questions_by_module/"
    );
    setquestion(statquestion.data);
  };

  const fetchModule = async (id) => {
    const Module = await axios.get(
      `http://127.0.0.1:8000/Module/?search=${id}`
    );
    setModule(Module.data);
  };
  const getModule = async (id) => {
    const Module = await axios.get(`http://127.0.0.1:8000/Module/search=${id}`);
    const numberofids = Module.data.map((obj) => obj.id);
    setgetModule(numberofids);
  };
  const fetchFormatione = async () => {
    const formation = await axios.get(`http://127.0.0.1:8000/Formation/`);
    setFormation(formation.data);
  };
  const post = async (formdata) => {
    const postResponse = await axios.post(
      "http://127.0.0.1:8000/user/",
      formdata
    );
    setData(postResponse.data);
  };
  const postresultat = async (formdataresultat) => {
    const post = await axiosClient.post("/resultat/", formdataresultat);
    setreponse(post.data);
  };

  //Remplacer le idTest Par Le Id Resultat !!!!!!!!!!!!!!!!!!!!!!!!
  const Gettentative = async (idtest, idUser, difficulte) => {
    const gettentative = await axiosClient.get(
      `/resultat/getidresultat/?idTest=${idtest}&idUser=${idUser}&niveau=${difficulte}`
    );
    setnombretentative(gettentative.data);
  };

  const Restart = async (idresultat, formdata) => {
    //const gettentative = await axios.get(`http://127.0.0.1:8000/resultat/${idtest}/`)
    const restarttesntative = await axios.put(
      `http://127.0.0.1:8000/resultat/${idresultat}/`,
      formdata
    );
    setrestart(restarttesntative.data);
  };
  const Postcertificat = async (formdata) => {
    const certificat = await axios.post(
      "http://127.0.0.1:8000/certificat/",
      formdata
    );
    setpostcerif(certificat.data);
  };
  const Getcertificat = async () => {
    const getcertificat = await axios.get("http://127.0.0.1:8000/certificat/");
    setgetcerif(getcertificat.data);
  };

  //Restart Progress
  const restartProgress = async (iduser, idtest, failChap, medias) => {
    const restartP = await axiosClient.get(
      `/resultat/restartProgress/?idUser=${iduser}&idTest=${idtest}&failChapter=${failChap}&totalMedia=${medias}`
    );
    setProgressResult(restartP.data);
    return restartP.data;
  };

  return (
    <StateContext.Provider
      value={{
        Restart,
        Getcertificat,
        getcerif,
        Postcertificat,
        setpostcerif,
        postdatadetails,
        setdetails,
        setteditest,
        putdata,
        idgetModule,
        getModule,
        post,
        data,
        fetchData,
        postresultat,
        idtest,
        tentative,
        Gettentative,
        idtentative,
        idscore,
        fetchDataStat,
        statquestion,
        fetchModule,
        question,
        postdata,
        user,
        setUser,
        token,
        setToken,
        refresh,
        setRefresh,
        notification,
        setNotification,
        setIsLoading,
        isLoading,
        progressResult,
        restartProgress,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
export const useStateContext = () => useContext(StateContext);
