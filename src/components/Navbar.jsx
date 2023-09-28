import { Link,Box,Input,Circle} from '@chakra-ui/react'
import { AiOutlineMail,AiFillBell,AiOutlineCaretDown,AiFillAppstore,AiOutlineStock} from "react-icons/ai";
export default function Root() {
    return (
        <Box display="grid" gridGap={3} gridAutoFlow="column dense" bg='black' color='#ffd140' w='100%' h='70' pos='fixed' pl={10} mt={0}  boxShadow="0 4px rgb(0,0,0,0.25)" zIndex={10} fontFamily={'Arial'} fontWeight={'bold'} pt={30}>
        <Box w={970} display="grid" gridGap={5} gridAutoFlow="column dense">
        <Link>Accueil</Link>
        <Link><AiFillAppstore style={{height: "20px",width: "20px",position:'absolute',marginLeft:'-31px'}}/><a href={`/admine`}>Accueil</a></Link>
        <Link><AiOutlineStock style={{height: "20px",width: "20px",position:'absolute',marginLeft:'-31px'}}/>Mes cours</Link>
        <Link>Something</Link>
        <Link>Something</Link>
        </Box>
        <Box display="grid" ml={300} w={550} gridGap={5} mt={-5} gridAutoFlow="column dense">
        <Input placeholder='search...' w={270} bg={'black'} mt={0} h={49} borderRadius="20" borderWidth={1} borderColor="#FFD042" pl={31} placeholderTextColor={'#FFD042'} _focus={{ borderColor: "#FFD042"}} _selected={{ borderColor: "#FFD042"}}/>
        <Box display="grid" gridGap={3} gridAutoFlow="column dense" ml={21} w={250}>
        <AiOutlineMail style={{height: "43px",width: "43px",backgroundColor:"#FFD042",color:'black',padding:"13px",borderRadius:"15px"}} />
        <AiFillBell style={{height: "43px",width: "43px",backgroundColor:"#FFD042",color:'black',padding:"13px",borderRadius:"15px"}} />
        <AiOutlineCaretDown style={{height: "20px",width: "20px",backgroundColor:"#FFD042",color:'black',borderRadius:"5px",marginTop:"11px"}} />
        <Circle size='55' style={{backgroundColor:"#FFD042",marginTop:"-8px"}}/>
        </Box>
        </Box>
        </Box>
    );
  }