import {SocketContext, socket} from 'context/socket';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <h1 className="font-bold">Meow</h1>
    </SocketContext.Provider> 
  );
}

export default App;
