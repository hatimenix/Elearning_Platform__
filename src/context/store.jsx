import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
export const MyContext = createContext();

const MyContextProvider = (props) => {
  const [data, setData] = useState([]);
  const [Module, setModule] = useState([])
  const [idgetModule, setgetModule] = useState([])
  const [Formation, setFormation] = useState([])
  const [tentative, setnombretentative] = useState([])
  const [idtentative, setIdtentative] = useState(null);
  const [idscore, setscore] = useState(0);
  const [reponse, setreponse] = useState([]);
  const [idtest, setId] = useState(null);
  const [statdata, setstatdata] = useState([]);
  const [question, setquestion] = useState([]);
  const [test, settest] = useState([]);
  const [edittest, setteditest] = useState([]);
  const [details, setdetails] = useState([]);

  const fetchData = async (id) => {
    const response = await axios.get("http://127.0.0.1:8000/test/1/");
    setData(response.data);
    const idtest = response.data[0].id
    setId(idtest);
    return idtest;
  }

  const postdatadetails = async (id) => {
    const postestdetial = await axios.get(`http://127.0.0.1:8000/test/1/`);
    setdetails(postestdetial.data);
  }

  const postdata = async (formdata) => {
    const postest = await axios.post('http://127.0.0.1:8000/test/', formdata);
    settest(postest.data);
  }

  const putdata = async (formdata) => {
    const edittest = await axios.put('http://127.0.0.1:8000/test/', formdata);
    setteditest(edittest.data);
  }

  const fetchDataStat = async () => {
    const stat = await axios.get('http://127.0.0.1:8000/test/');
    setstatdata(stat.data);
  }

  const statquestion = async () => {
    const statquestion = await axios.get('http://127.0.0.1:8000/Test/total_questions_by_module/')
    setquestion(statquestion.data);
  }

  const fetchModule = async (id) => {
    const Module = await axios.get(`http://127.0.0.1:8000/Module/?search=${id}`);
    setModule(Module.data);
  }
  const getModule = async (id) => {
    const Module = await axios.get(`http://127.0.0.1:8000/Module/`);
    const numberofids = (Module.data).map((obj) => obj.id);
    setgetModule(numberofids)
  }
  const fetchFormatione = async () => {
    const formation = await axios.get(`http://127.0.0.1:8000/Formation/`);
    setFormation(formation.data);
  }
  const post = async (formdata) => {
    const postResponse = await axios.post('http://127.0.0.1:8000/user/', formdata)
    setData(postResponse.data)
  }
  const postresultat = async (formdataresultat) => {
    const post = await axios.post('http://127.0.0.1:8000/Resultat/', formdataresultat)
    setreponse(post.data)
  }

  const Gettentative = async (idtest) => {
    const gettentative = await axios.get(`http://127.0.0.1:8000/Resultat/?search=${idtest}`)
    setnombretentative(gettentative.data)
  }
  const [postcerif, setpostcerif] = useState([])
  const Postcertificat = async (formdata) => {
    const certificat = await axios.post('http://127.0.0.1:8000/Certificat/', formdata)
    setpostcerif(certificat.data)
  }
  const [getcerif, setgetcerif] = useState([])
  const Getcertificat = async () => {
    const getcertificat = await axios.get('http://127.0.0.1:8000/Certificat/')
    setgetcerif(getcertificat.data)
  }

  return (
    <MyContext.Provider value={{
      Getcertificat, getcerif, Postcertificat, setpostcerif, postdatadetails,
      setdetails, setteditest, putdata, idgetModule, getModule, post, data, fetchData, postresultat,
      idtest, tentative, Gettentative, idtentative, idscore,
      question, postdata
    }}>
      {props.children}
    </MyContext.Provider>
  );
}
export default MyContextProvider;


