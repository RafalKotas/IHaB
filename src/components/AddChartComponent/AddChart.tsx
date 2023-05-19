// font awesome
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// react
import React from "react"

// react-bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { AddNewChart} from "../../store/charts"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../store"
import { generateNewId } from "../../store/charts/selectors"

interface OwnAddChartProps {

}

const mapStateToProps = (state: AppState, ownProps : OwnAddChartProps) => ({
  newID: generateNewId(state.chartsReducer)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNewChart: (newId : string) => 
  dispatch(AddNewChart(newId)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type AddChartPropsFromRedux = ConnectedProps<typeof connector>
  
type AddChartProps = AddChartPropsFromRedux & OwnAddChartProps

const AddChartComponent : React.FC<AddChartProps> = ({addNewChart, newID}) => {

    const addNewBasicChart = () => {
      addNewChart(newID.toString())
    }

    return <div style={{height: "100px", width: "100px", margin: "10px"}}>
        <OverlayTrigger
        
          key={"add-chart-trigger"}
          placement={"right"}
          delay={{ show: 250, hide: 100 }}
          overlay={
            <Tooltip id={`tooltip-top`} style={{position: "absolute"}}>
              ADD NEW CHART!!!
            </Tooltip>
          }
        >
          <FontAwesomeIcon onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => addNewBasicChart()} style={{color: "green", height: "50px", width: "50px", cursor: "pointer"}} icon={faCirclePlus} />
        </OverlayTrigger>
    </div>
}

export default connector(AddChartComponent)