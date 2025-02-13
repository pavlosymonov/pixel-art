import "./App.css";
import Alert from "./components/Alert/Alert";
import Canvas from "./components/Canvas/Canvas";
import { DrawProvider } from "./components/Canvas/hooks/DrawProvider";
import InfoBlock from "./components/InfoBlock/InfoBlock";
import Tools from "./components/Tools/Tools";

function App() {
  return (
    <>
      <DrawProvider>
        <Alert />
        <Tools />
        <InfoBlock />
        <Canvas />
      </DrawProvider>
    </>
  );
}

export default App;
