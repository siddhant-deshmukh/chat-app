//import {SocketContext, socket} from './context/socket';
import {AuthProvider} from './context/socket';
import MessageApp from './components/MessageApp';
//import {config} from './config';

//const apiUrl = config.API_URL;



function App() {
  return(
    <AuthProvider>
      <div className='p-5 w-screen h-screen'>
        <MessageApp/>
      </div>
    </AuthProvider>
  );
}

export default App;