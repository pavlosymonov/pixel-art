import "./App.css";
import Canvas from "./components/Canvas/Canvas";
import { DrawProvider } from "./components/Canvas/hooks/DrawProvider";
import Tools from "./components/Tools/Tools";

function App() {
  return (
    <>
      <DrawProvider>
        <Tools />
        <Canvas />
      </DrawProvider>
    </>
  );
}

export default App;
