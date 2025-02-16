import {Gradient} from '@components/gradient';
import { ShaderGradient, ShaderGradientCanvas } from "shadergradient";

function App() {
  console.log(ShaderGradient, ShaderGradientCanvas);
	return <Gradient currentId={0} />;
}

export default App;
