// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { dayToDayProps} from "../../../../store/charts/types"
import { useEffect, useState } from "react"
import { CheckDayDataCorrectness, ClearCorrectnessState, StartRealtimeFetching, ToggleDayChartRealTime, TriggerFetch} from "../../../../store/charts"

// material-ui
import AppBar from "@mui/material/AppBar"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Box from "@mui/material/Box"
import { Button } from "@mui/material"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"

// react-bootstrap
import {Button as ButtonBootstrap} from "react-bootstrap"
import Modal from "react-bootstrap/Modal"

// styles
import "../panel.css"

// components
import DaysToCompareSelector from "../../UnitsToCompareSelector/DaysToCompareSelector/DaysToCompareSelector"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { daysSelectedIntervalInFuture } from "../../../../store/charts/selectors"
import DayStatsPanel from "../../PanelStatsTabs/DayStatsPanel/DayStatsPanel"

interface OwnDayPanelProps {
    chartId: string,
    dayToDay: dayToDayProps
}
  
const mapStateToProps = (state: AppState, ownProps: OwnDayPanelProps) => ({
    dayDataValid: state.chartsReducer.charts[ownProps.chartId].dayToDay.dataValid,
    dayRealTime: state.chartsReducer.charts[ownProps.chartId].dayToDay.realTime,
    dayFetchingData: state.chartsReducer.charts[ownProps.chartId].dayToDay.fetchingData,
    errorMessages: state.chartsReducer.charts[ownProps.chartId].dayToDay.errorMessages,
    isDaySelectedIntervalInFuture: daysSelectedIntervalInFuture(state.chartsReducer, ownProps.chartId)
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayPanelProps) => ({
  checkDayDataCorrectness: () => dispatch(CheckDayDataCorrectness(ownProps.chartId)),
  clearDataValidStatus: () => dispatch(ClearCorrectnessState(ownProps.chartId)),
  toggleDayRealTime: () => dispatch(ToggleDayChartRealTime(ownProps.chartId)),
  triggerFetch: () => dispatch(TriggerFetch(ownProps.chartId)),
  startFetchingData: () => dispatch(StartRealtimeFetching(ownProps.chartId))
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DayPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type DayPanelProps = DayPanelPropsFromRedux & OwnDayPanelProps

const DayPanel : React.FC<DayPanelProps> = ({chartId, dayToDay, dayDataValid, dayRealTime, 
  dayFetchingData, isDaySelectedIntervalInFuture, errorMessages, 
  checkDayDataCorrectness, clearDataValidStatus, toggleDayRealTime, triggerFetch, startFetchingData}) => {
    
    const [selectedTab, setSelectedTab] = useState<string>("PARAMS")
    const [showErrorsModal, setShowErrorsModal] = useState<boolean>(false)

    const handleClose = () => setShowErrorsModal(false)

    const handleTabChange = (event: React.SyntheticEvent, newValue: any) => {
        setSelectedTab(newValue.toString())
    }

    useEffect(() => {
      clearDataValidStatus()
      //eslint-disable-next-line
    }, [])

    const buttonContent = () => {
      switch(dayDataValid) {
        case -1:
          return "WRONG DATA PROVIDED"
        case 0:
          return "CHECK DATA CORRECTNESS"
        case 1:
          if(dayRealTime) {
            if(dayFetchingData) {
              return "STOP FETCHING DATA"
            } else {
              return "START FETCHING DATA"
            }
          } else {
            return "FETCH DATA"
          }
      }
    }

    const buttonBgColor = () => {
      switch(dayDataValid) {
        case -1:
          return "error"
        case 0:
          return "info"
        case 1:
          return "success"
        default:
          return "info"
      }
    }

    const btnFunction = () => {
        switch(dayDataValid) {
          case 0:
            checkDayDataCorrectness()
            break
          case 1:
            if(dayRealTime) {
              if(dayFetchingData) {
                triggerFetch()
                startFetchingData()
              } else {
                triggerFetch()
                startFetchingData()
              }
            } else {
              triggerFetch()
            }
            break
        }
    }

    useEffect(() => {
      if(dayDataValid === -1) {
        setShowErrorsModal(true)
      }
    }, [dayDataValid])

    const errorMessagesInfo = () => {
      return (
        <FontAwesomeIcon 
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => setShowErrorsModal(true)} 
          style={{color: "red", cursor: "pointer"}} 
          icon={faInfoCircle} 
        />
      )
    }
    
    const checkIcon = () => {
      return (
        <FontAwesomeIcon 
          style={{color: "green"}} 
          icon={faCircleCheck} 
        />
      )
    }

    const modalWithMessages = () => {
      return (
        <Modal show={showErrorsModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Some errors found!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              <ul>
                {
                  errorMessages.map((errorMessage) => {
                    return (
                      <li>
                        {errorMessage}
                      </li>
                    )
                  })
                }
              </ul>
            }
          </Modal.Body>
          <Modal.Footer>
            <ButtonBootstrap variant="secondary" onClick={handleClose}>
              OK I UNDERSTAND
            </ButtonBootstrap >
          </Modal.Footer>
        </Modal>
      ) 
    }

    const toggleRealTime = () => {
      toggleDayRealTime()
    }
    
    return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <div className={"panel-header"}>
          <div>
            <Button onClick={() => btnFunction()} sx={{width: "calc(100% - 1)", margin: 1}} variant="contained" color={buttonBgColor()}>
              {buttonContent()}
            </Button>
            {
              dayDataValid === -1 && errorMessagesInfo()
            }
            {
              dayDataValid === 1 && checkIcon()
            }
          </div>
          <FormGroup>
            <FormControlLabel 
              disabled={!(dayDataValid === 1 && isDaySelectedIntervalInFuture)} 
              control={<Checkbox checked={dayRealTime} />}
              onChange={() => toggleRealTime()}
              label="Realtime?" 
            />
          </FormGroup>
        </div>
        {modalWithMessages()}
        <AppBar position="static">
          <Tabs
            value={selectedTab}
            onChange={(event: React.SyntheticEvent<Element, Event>, value: any) => handleTabChange(event, value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="PARAMS" value={"PARAMS"}/>
            <Tab label="STATISTICS" value={"STATISTICS"}/>
          </Tabs>
        </AppBar>
        {
            selectedTab === "PARAMS" ? <DaysToCompareSelector chartId={chartId} dayToDayProps={dayToDay}/>
            : <DayStatsPanel chartId={chartId}/>
        }
      </Box>
    )
}

export default connector(DayPanel)