// styles
import "bootstrap/dist/css/bootstrap.min.css"
import "./chartContainer.css"

// components
import CustomChart from "../../components/CustomChart/CustomChart"

// own functions
import filterFunctions from "../../functions/filterFunctions"
import AddChartComponent from "../AddChartComponent/AddChart"
import { AppState } from "../../store"

//react
import React from "react"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import ComfortIndicator from "../ComfortIndicator/ComfortIndicator"

interface OwnChartContainerProps {

}
  
const mapStateToProps = (state: AppState, ownProps : OwnChartContainerProps) => ({
    charts: state.chartsReducer.charts
})
  
  const mapDispatchToProps = (dispatch: Dispatch) => ({
  
  })
  
  const connector = connect(mapStateToProps, mapDispatchToProps)
  
  type ChartContainerPropsFromRedux = ConnectedProps<typeof connector>
  
  type ChartContainerProps = OwnChartContainerProps & ChartContainerPropsFromRedux

const ChartContainer : React.FC<ChartContainerProps> = ({charts}) => {

    return (
        <div id="chart-container">
            {
                Object.entries(charts).map(([chartId, chartProps]) => {
                    return <CustomChart filterFunction={filterFunctions.oneOfNumber} chartId={chartId}/>
                })
            }
            <AddChartComponent />
        </div>
    )
}

export default connector(ChartContainer)