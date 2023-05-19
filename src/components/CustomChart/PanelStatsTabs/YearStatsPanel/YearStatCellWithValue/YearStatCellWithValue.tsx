// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../../store"

// mui
import { styled } from "@mui/material/styles"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import { yearDataToValuesOnly } from "../../../../../store/charts/selectors"

interface OwnYearStatCellWithValueProps {
    chartId: string,
    year: string,
    reduceFunction: (data: number[]) => number | string
}

const mapStateToProps = (state: AppState, ownProps: OwnYearStatCellWithValueProps) => ({
    dataForYear: yearDataToValuesOnly(state.chartsReducer, ownProps.chartId, ownProps.year)
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearStatCellWithValueProps) => ({

})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type YearStatCellWithValuePropsFromRedux = ConnectedProps<typeof connector>
  
type YearStatCellWithValueProps = YearStatCellWithValuePropsFromRedux & OwnYearStatCellWithValueProps

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

const YearStatCellWithValue : React.FC<YearStatCellWithValueProps> = ({reduceFunction, dataForYear }) => {

    const statValueToPrint = () => {
        let statValue = reduceFunction(dataForYear)
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

export default connector(YearStatCellWithValue)