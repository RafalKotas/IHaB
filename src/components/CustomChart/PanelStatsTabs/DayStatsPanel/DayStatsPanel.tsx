// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"

// react
import * as React from "react"

// mui
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"

// components

// data helpers
import { dataAverage, dataMaximum, dataMedian, dataMinimum, dataStdDev, dataVariance, dayjsDayToDateString } from "../../../utils/data-helpers"
import DayStatCellWithValue from "./DayStatCellWithValue/DayStatCellWithValue"
import DayGeneralStat from "./DayGeneralStat/DayGeneralStat"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.root}`]: {
    padding: 5,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  },
}))

interface OwnDayStatsPanelProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnDayStatsPanelProps) => ({
    selectedDays: state.chartsReducer.charts[ownProps.chartId].dayToDay.selectedDays
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayStatsPanelProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DayStatsPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type DayStatsPanelProps = DayStatsPanelPropsFromRedux & OwnDayStatsPanelProps

interface statProps {
  name: string,
  reduceFunction?: (data : number[]) => number | string,
  value? : number | string
}

const DayStatsPanel : React.FC<DayStatsPanelProps> = ({chartId, selectedDays}) => {

    const stats : statProps[] = [
      {
        name: "Mean",
        reduceFunction: (data : number[]) => dataAverage(data)
      },
      {
        name: "Median",
        reduceFunction: (data : number[]) => dataMedian(data)
      },
      {
        name: "Variance",
        reduceFunction: (data : number[]) => dataVariance(data)
      },
      {
        name: "Std Dev",
        reduceFunction: (data : number[]) => dataStdDev(data)
      },
      {
        name: "Min",
        reduceFunction: (data : number[]) => dataMinimum(data)
      },
      {
        name: "Max",
        reduceFunction: (data : number[]) => dataMaximum(data)
      },
      {
        name: "Probe Count"
      },
      {
        name: "Null Probe Count"
      },
      {
        name: "First Not Null Probe"
      },
      {
        name: "Last Not Null Probe"
      }
    ]

    return (
        <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 500, maxHeight: "100%", overflowX: "scroll"}} aria-label="customized table">
          
          <TableHead>
            <TableRow>
                <StyledTableCell> 
                    Statistic
                </StyledTableCell>
                <React.Fragment>
                {
                    selectedDays.map((day) => {
                        return <StyledTableCell align="right">{dayjsDayToDateString(day)}</StyledTableCell>      
                    })
                }
                </React.Fragment>
            </TableRow>
          </TableHead>

          <TableBody>
            {stats.map((stat) => (
              <StyledTableRow sx={{'&:last-child td, &:last-child th': { border: 0, margin: 0 }, '&:tr': { height: 10 } }}>
                <StyledTableCell component="th" scope="row">
                  {stat.name}
                </StyledTableCell>
                {
                  selectedDays.map((day, index) => {
                    return stat.reduceFunction ? <React.Fragment>
                        <DayStatCellWithValue reduceFunction={stat.reduceFunction} chartId={chartId} dayStr={dayjsDayToDateString(day)} />
                      </React.Fragment> : <DayGeneralStat statName={stat.name} chartId={chartId} dayStr={dayjsDayToDateString(day)}/>
                  })
                }
              </StyledTableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    )
}

export default connector(DayStatsPanel)