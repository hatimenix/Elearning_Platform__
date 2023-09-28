import logo from './logo.svg';
import './App.css';

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<ListeCertificat />} />
    //   <Route path="/test" element={<PasserTest />} />
    // </Routes>
    <Box w={"100%"} >
      <Center>
      <PasserTest/>
      {/* <Test/> */}
      </Center>
    <br /><br />
      <Center>
      <ListeCertificat/>
      </Center>

      <br /><br />

      <Center>
      <Certificat/>
      </Center>
      

    </Box>
);
}

export default App;
