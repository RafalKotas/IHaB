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
import YearStatCellWithValue from "./YearStatCellWithValue/YearStatCellWithValue"

// data helpers
import { dataAverage, dataMaximum, dataMedian, dataMinimum, dataStdDev, dataVariance } from "../../../utils/data-helpers"
import YearGeneralStat from "./YearGeneralStat/YearGeneralStat"

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

interface OwnYearStatsPanelProps {
    chartId: string
}

const mapStateToProps = (state: AppState, ownProps: OwnYearStatsPanelProps) => ({
    selectedYears: state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedYears
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearStatsPanelProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type YearStatsPanelPropsFromRedux = ConnectedProps<typeof connector>
  
type YearStatsPanelProps = YearStatsPanelPropsFromRedux & OwnYearStatsPanelProps

interface statProps {
  name: string,
  reduceFunction?: (data : number[]) => number | string,
  value? : number | string
}

const YearStatsPanel : React.FC<YearStatsPanelProps> = ({chartId, selectedYears}) => {

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
        name: "First Probe"
      },
      {
        name: "Last Probe"
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
                    selectedYears.map((year) => {
                        return <StyledTableCell align="right">{year}</StyledTableCell>      
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
                  selectedYears.map((year, index) => {
                    return stat.reduceFunction ? <React.Fragment>
                        <YearStatCellWithValue reduceFunction={stat.reduceFunction} chartId={chartId} year={year} />
                      </React.Fragment> : <YearGeneralStat statName={stat.name} chartId={chartId} year={year}/>
                  })
                }
              </StyledTableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    )
}

export default connector(YearStatsPanel)