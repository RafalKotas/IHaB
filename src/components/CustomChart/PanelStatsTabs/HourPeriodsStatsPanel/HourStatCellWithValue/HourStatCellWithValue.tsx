// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { hourPeriodDataToValuesOnly } from "../../../../../store/charts/selectors"

interface OwnHourStatCellWithValueProps {
    chartId: string,
    hourPeriodStr: string,
    reduceFunction: (data: number[]) => number | string
}

const mapStateToProps = (state: AppState, ownProps: OwnHourStatCellWithValueProps) => ({
  dataForHourPeriod: hourPeriodDataToValuesOnly(state.chartsReducer, ownProps.chartId, ownProps.hourPeriodStr)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnHourStatCellWithValueProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type HourStatCellWithValuePropsFromRedux = ConnectedProps<typeof connector>
  
type HourStatCellWithValueProps = HourStatCellWithValuePropsFromRedux & OwnHourStatCellWithValueProps

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

const HourStatCellWithValue : React.FC<HourStatCellWithValueProps> = ({reduceFunction, dataForHourPeriod}) => {

    const statValueToPrint = () => {
        let statValue = reduceFunction(dataForHourPeriod)
        if(typeof(statValue) === "number") {
            return statValueRounded(statValue)
        } else {
            return statValue
        }
    }

    const statValueRounded = (statValue : number) => (Math.round(statValue * 100) / 100)

    return (
        <StyledTableCell align="right">{statValueToPrint()}</StyledTableCell>
    )
}

export default connector(HourStatCellWithValue)