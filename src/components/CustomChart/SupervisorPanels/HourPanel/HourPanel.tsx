// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { hourToHourProps} from "../../../../store/charts/types"

// react
import React from "react"
import { useEffect, useState } from "react"

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

//components
import HourPeriodsToCompareSelector from "../../UnitsToCompareSelector/HourPeriodsToCompareSelector/HourPeriodsToCompareSelector"
import { CheckHourDataCorrectness, ClearCorrectnessState, StartRealtimeFetching, ToggleHourChartRealTime, TriggerFetch } from "../../../../store/charts"
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { hourSelectedIntervalInFuture } from "../../../../store/charts/selectors"
import HourPeriodStatsPanel from "../../PanelStatsTabs/HourPeriodsStatsPanel/HourPeriodStatsPanel"

interface OwnHourPanelProps {
    chartId: string,
    hourToHour: hourToHourProps
}
  
const mapStateToProps = (state: AppState, ownProps: OwnHourPanelProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    chartDataSource: state.chartsReducer.charts[ownProps.chartId].chartDataSource,
    hourDataValid: state.chartsReducer.charts[ownProps.chartId].hourToHour.dataValid,
    hourRealTime: state.chartsReducer.charts[ownProps.chartId].hourToHour.realTime,
    hourFetchingData: state.chartsReducer.charts[ownProps.chartId].hourToHour.fetchingData,
    errorMessages: state.chartsReducer.charts[ownProps.chartId].hourToHour.errorMessages,
    isHourSelectedIntervalInFuture: hourSelectedIntervalInFuture(state.chartsReducer, ownProps.chartId)
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourPanelProps) => ({
  checkHourDataCorrectness: () => dispatch(CheckHourDataCorrectness(ownProps.chartId)),
  clearDataValidStatus: () => dispatch(ClearCorrectnessState(ownProps.chartId)),
  toggleHourRealTime: () => dispatch(ToggleHourChartRealTime(ownProps.chartId)),
  triggerFetch: () => dispatch(TriggerFetch(ownProps.chartId)),
  startFetchingData: () => dispatch(StartRealtimeFetching(ownProps.chartId))
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type HourPanelProps = HourPanelPropsFromRedux & OwnHourPanelProps

const HourPanel : React.FC<HourPanelProps> = ({chartId, hourToHour, hourDataValid, hourRealTime, 
  hourFetchingData, errorMessages, isHourSelectedIntervalInFuture, 
  checkHourDataCorrectness, clearDataValidStatus, toggleHourRealTime, triggerFetch, startFetchingData}) => {
    
    const [selectedTab, setSelectedTab] = useState<string>("PARAMS")
    const [showErrorsModal, setShowErrorsModal] = useState<boolean>(false)

    const handleClose = () => setShowErrorsModal(false)

    const handleTabChange = (event: React.SyntheticEvent, newValue: any) => {
        setSelectedTab(newValue.toString())
    }

    useEffect(() => {
      clearDataValidStatus()
    }, [])

    const buttonContent = () => {
      switch(hourDataValid) {
        case -1:
          return "WRONG DATA PROVIDED"
        case 0:
          return "CHECK DATA CORRECTNESS"
        case 1:
          if(hourRealTime) {
              return "START FETCHING DATA"
          } else {
            return "FETCH DATA"
          }
      }
    }

    const buttonBgColor = () => {
      switch(hourDataValid) {
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
        switch(hourDataValid) {
          case 0:
            checkHourDataCorrectness()
            break
          case 1:
            if(hourRealTime) {
              if(hourFetchingData) {
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
      if(hourDataValid === -1) {
        console.log("data not valid show modal!")
        setShowErrorsModal(true)
      }
    }, [hourDataValid])

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
      toggleHourRealTime()
    }
    
    return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <div className={"panel-header"}>
          <Button onClick={() => btnFunction()} sx={{width: "calc(100% - 1)", margin: 1}} variant="contained" color={buttonBgColor()}>
            {buttonContent()}
          </Button>
          {
            hourDataValid === -1 && errorMessagesInfo()
          }
          {
            hourDataValid === 1 && checkIcon()
          }
          <FormGroup>
            <FormControlLabel 
              disabled={!(hourDataValid === 1 && isHourSelectedIntervalInFuture)} 
              control={<Checkbox checked={hourRealTime} />}
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
            selectedTab === "PARAMS" ? <HourPeriodsToCompareSelector chartId={chartId} hourToHourProps={hourToHour}/>
            : <HourPeriodStatsPanel chartId={chartId}/>
        }
      </Box>
    )
}

export default connector(HourPanel)