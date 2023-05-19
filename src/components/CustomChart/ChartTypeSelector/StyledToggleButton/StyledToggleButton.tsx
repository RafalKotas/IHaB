import { ToggleButton } from "react-bootstrap"

import "./styledToggleButton.css"

interface StyledToggleButtonProps {
    updateChartTypeOnClick: (updatedChartType : string) => void,
    chartSelected : boolean,
    chartType : string,
    chartId: string,
    chartIndex : number
}

const StyledToggleButton : React.FC<StyledToggleButtonProps> = ({updateChartTypeOnClick, chartSelected, chartType,  chartIndex, chartId}) => {

    return (
        <>
                <ToggleButton
                    onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                        updateChartTypeOnClick(chartType)
                    }}
                    style={{
                        backgroundColor: "gray"
                    }}
                    checked={chartSelected}
                    key={chartType}
                    className={"toggle-chart-type-button chart-with-index-" + chartIndex}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    
                    }}
                    /*variant={"flat"}*/
                    type="radio"
                    value={chartType}
                >
                <span className={"chart-type-text"}>{chartType}</span>
                </ToggleButton>
        </>
      )
}

export default StyledToggleButton