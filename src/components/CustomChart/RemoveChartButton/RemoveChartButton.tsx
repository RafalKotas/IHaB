// redux
import { ChangeChartDataSource, dataSources, RemoveExistingChart } from "../../../store/charts"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../store"

// react-bootstrap
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

// font awesome
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// styles
import "./removeChartButton.css"
import { useEffect, useState } from "react"

interface OwnRemoveChartButtonProps {
    chartId: string
}
  
const mapStateToProps = (state: AppState, ownProps : OwnRemoveChartButtonProps) => ({
    chartDetails : state.chartsReducer.charts[ownProps.chartId],
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps : OwnRemoveChartButtonProps) => ({
    removeChart: () => 
    dispatch(RemoveExistingChart(ownProps.chartId)),
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
    
type RemoveChartButtonPropsFromRedux = ConnectedProps<typeof connector>
    
type RemoveChartButtonProps = RemoveChartButtonPropsFromRedux & OwnRemoveChartButtonProps

const RemoveChartButton : React.FC<RemoveChartButtonProps> = ({chartId, removeChart}) => {

    const [show, setShow] = useState(false)
    const [remove, setRemove] = useState(false)


    const cancelModalAction = () => setShow(false)
    const removeModalAction = () => {
        setRemove(true)
        setShow(false)
    }

    useEffect(() => {
        if(remove && !show) {
            removeChart()
        }
    }, [remove, show])

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const showRemoveModal = () => {
        console.log("show remove Modal here")
    }

    return (
        <div className="remove-chart-btn">
            <OverlayTrigger
                key={"add-chart-trigger"}
                placement={"right"}
                delay={{ show: 250, hide: 100 }}
                overlay={
                    <Tooltip id={`tooltip-top`} style={{position: "absolute"}}>
                        REMOVE CHART!!!
                    </Tooltip>
                }
            >
                <FontAwesomeIcon 
                    onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => handleShow()}
                    //onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => showRemoveModal()} 
                    className={"remove-chart-btn-icon"} 
                    icon={faSquareXmark} 
                />
            </OverlayTrigger>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chart remove confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure to remove chart with id: {chartId}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={cancelModalAction}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={removeModalAction}>
                        Remove!
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default connector(RemoveChartButton)