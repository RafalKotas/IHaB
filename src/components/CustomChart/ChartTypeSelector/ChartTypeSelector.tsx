// components
import StyledToggleButton from "./StyledToggleButton/StyledToggleButton"

// react-bootstrap
import { Stack, ToggleButtonGroup } from "react-bootstrap"

// styles
import "./chartTypeSelector.css"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../store"
import { ChangeChartType, chartTypes } from "../../../store/charts"

interface OwnChartTypeSelectorProps {
    chartId: string
}
  
const mapStateToProps = (state: AppState, ownProps : OwnChartTypeSelectorProps) => ({
    chartDetails : state.chartsReducer.charts[ownProps.chartId]
})
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateChartType: (chartId: string, updatedChartType : chartTypes) => 
    dispatch(ChangeChartType(chartId, updatedChartType)),
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type ChartTypeSelectorPropsFromRedux = ConnectedProps<typeof connector>
  
type ChartTypeSelectorProps = ChartTypeSelectorPropsFromRedux & OwnChartTypeSelectorProps

const ChartTypeSelector : React.FC<ChartTypeSelectorProps> = ({chartId, chartDetails, updateChartType}) => {

    const chartTypes = ["Year to year", "Day to day", "Hour to hour"]

    const changeChartTypeOnClick = (updatedChartType : string) => {
        updateChartType(chartId, updatedChartType as chartTypes)
    }

    return (
      <Stack className="chart-header" direction="horizontal" gap={3}>
        <ToggleButtonGroup 
            className={"toggle-chart-type-button-group"}
            type="radio" 
            name="options" 
            value={chartDetails.chartTypeSelected} 
            defaultValue={"year2year" as chartTypes}
        >
            {
                chartTypes.map((chartType, index) => {
                    return (
                        <StyledToggleButton
                            updateChartTypeOnClick={changeChartTypeOnClick}
                            chartSelected={(chartType.localeCompare(chartDetails.chartTypeSelected)) === 0}
                            key={chartType + "-" + index} 
                            chartType={chartType}
                            chartId={chartId}
                            chartIndex={index}
                        />
                    )
                })
            }
        </ToggleButtonGroup>
      </Stack>
    )
}

export default connector(ChartTypeSelector)