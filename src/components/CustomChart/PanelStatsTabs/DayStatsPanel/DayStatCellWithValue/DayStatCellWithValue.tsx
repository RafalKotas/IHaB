// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { dayDataToValuesOnly } from "../../../../../store/charts/selectors"

interface OwnDayStatsCellWithValueProps {
    chartId: string,
    dayStr: string,
    reduceFunction: (data: number[]) => number | string
}

const mapStateToProps = (state: AppState, ownProps: OwnDayStatsCellWithValueProps) => ({
  dataForDay: dayDataToValuesOnly(state.chartsReducer, ownProps.chartId, ownProps.dayStr)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnDayStatsCellWithValueProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type DayStatsCellWithValuePropsFromRedux = ConnectedProps<typeof connector>
  
type DayStatsCellWithValueProps = DayStatsCellWithValuePropsFromRedux & OwnDayStatsCellWithValueProps

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

const DayStatsCellWithValue : React.FC<DayStatsCellWithValueProps> = ({reduceFunction, dataForDay}) => {

    const statValueToPrint = () => {
        let statValue = reduceFunction(dataForDay)
        if(typeof(statValue) === "number") {
            return statValueRounded(statValue)
        } else {
            return statValue
        }
    }

    const statValueRounded = (statValue : number) => (Math.round(statValue * 1000) / 1000)

    return (
        <StyledTableCell align="right">{statValueToPrint()}</StyledTableCell>
    )
}

export default connector(DayStatsCellWithValue)