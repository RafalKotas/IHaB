// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"
import { yearToYearProps} from "../../../../store/charts/types"

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
import { CheckYearDataCorrectness, ClearCorrectnessState, StartRealtimeFetching, ToggleYearChartRealTime, TriggerFetch} from "../../../../store/charts"
// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import YearsToCompareSelector from "../../UnitsToCompareSelector/YearsToCompareSelector/YearsToCompareSelector"
import { yearSelectedIntervalInFuture } from "../../../../store/charts/selectors"
import YearStatsPanel from "../../PanelStatsTabs/YearStatsPanel/YearStatsPanel"

interface OwnYearPanelProps {
    chartId: string,
    yearToYear: yearToYearProps
}
  
const mapStateToProps = (state: AppState, ownProps: OwnYearPanelProps) => ({
    chartDetails: state.chartsReducer.charts[ownProps.chartId],
    chartDataSource: state.chartsReducer.charts[ownProps.chartId].chartDataSource,
    yearDataValid: state.chartsReducer.charts[ownProps.chartId].yearToYear.dataValid,
    yearRealTime: state.chartsReducer.charts[ownProps.chartId].yearToYear.realTime,
    yearFetchingData: state.chartsReducer.charts[ownProps.chartId].yearToYear.fetchingData,
    errorMessages: state.chartsReducer.charts[ownProps.chartId].yearToYear.errorMessages,
    isYearSelectedIntervalInFuture: yearSelectedIntervalInFuture(state.chartsReducer, ownProps.chartId)
})
  
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearPanelProps) => ({
  checkyearDataCorrectness: () => dispatch(CheckYearDataCorrectness(ownProps.chartId)),
  clearDataValidStatus: () => dispatch(ClearCorrectnessState(ownProps.chartId)),
  toggleYearRealTime: () => dispatch(ToggleYearChartRealTime(ownProps.chartId)),
  triggerFetch: () => dispatch(TriggerFetch(ownProps.chartId)),
  startFetchingData: () => dispatch(StartRealtimeFetching(ownProps.chartId))
})
  
const connector = connect(mapStateToProps, mapDispatchToProps)
  
type YearPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type YearPanelProps = YearPanelPropsFromRedux & OwnYearPanelProps

const YearPanel : React.FC<YearPanelProps> = ({chartId, yearToYear, yearDataValid, yearRealTime, 
  yearFetchingData, errorMessages, isYearSelectedIntervalInFuture, 
  checkyearDataCorrectness, clearDataValidStatus, toggleYearRealTime, triggerFetch, startFetchingData}) => {
    
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
      switch(yearDataValid) {
        case -1:
          return "WRONG DATA PROVIDED"
        case 0:
          return "CHECK DATA CORRECTNESS"
        case 1:
          if(yearRealTime) {
              return "START FETCHING DATA"
          } else {
            return "FETCH DATA"
          }
      }
    }

    const buttonBgColor = () => {
      switch(yearDataValid) {
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
        switch(yearDataValid) {
          case 0:
            checkyearDataCorrectness()
            break
          case 1:
            if(yearRealTime) {
              if(yearFetchingData) {
                triggerFetch()
                startFetchingData()
                //fetchYearToYearData()
              } else {
                triggerFetch()
                startFetchingData()
                //stopFetchingData()
              }
            } else {
              triggerFetch()
            }
            break
        }
    }

    useEffect(() => {
      if(yearDataValid === -1) {
        console.log("data not valid show modal!")
        setShowErrorsModal(true)
      }
    }, [yearDataValid])

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
      toggleYearRealTime()
    }
    
    return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <div className={"panel-header"}>
          <Button onClick={() => btnFunction()} sx={{width: "calc(100% - 1)", margin: 1}} variant="contained" color={buttonBgColor()}>
            {buttonContent()}
          </Button>
          {
            yearDataValid === -1 && errorMessagesInfo()
          }
          {
            yearDataValid === 1 && checkIcon()
          }
          <FormGroup>
            <FormControlLabel 
              disabled={!(yearDataValid === 1 && isYearSelectedIntervalInFuture)} 
              control={<Checkbox checked={yearRealTime} />}
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
            selectedTab === "PARAMS" ? <YearsToCompareSelector chartId={chartId} yearToYearProps={yearToYear}/>
            : <YearStatsPanel chartId={chartId}/>
        }
      </Box>
    )
}

export default connector(YearPanel)
