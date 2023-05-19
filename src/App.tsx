//redux
import { Provider } from "react-redux"
import { store } from "./store"

//styles
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import CustomChart from "./components/CustomChart/CustomChart"

//services
import Header from "./components/Header/Header"
import MyChart from "./components/MyChart/MyChart"

// own functions
import filterFunctions from "./functions/filterFunctions"
import ChartContainer from "./components/ChartContainer/ChartContainer"
import ComfortIndicator from "./components/ComfortIndicator/ComfortIndicator"

const App = () => {

  const renderChart = (chartNo: number) => {
    if(chartNo == 0) {
      return <MyChart propertyName="DHT22_relativeHumidity" filterFunction={filterFunctions.oneOfNumber} />
    } else {
      return <CustomChart chartId={"0"} filterFunction={filterFunctions.oneOfNumber}/>
    }
  }
 
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <ChartContainer/>
        <ComfortIndicator />
      </div>
    </Provider>
  );
}

export default App;
