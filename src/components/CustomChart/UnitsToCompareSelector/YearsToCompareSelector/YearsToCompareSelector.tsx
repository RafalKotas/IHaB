// react
import { useEffect, useState } from "react"
import { UpdateYearsToCompare, yearToYearProps } from "../../../../store/charts"

// redux
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../../store"

/// components
// mui
import Box from "@mui/material/Box"
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Chip from "@mui/material/Chip"

// styles
import "./yearToCompareSelector.css"
import { Button } from "react-bootstrap"

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 150,
    },
  },
}

const years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]

interface OwnYearsToCompareSelectorProps {
    chartId : string,
    yearToYearProps : yearToYearProps
}

const mapStateToProps = (state: AppState, ownProps : OwnYearsToCompareSelectorProps) => ({
  chartDetails : state.chartsReducer.charts[ownProps.chartId],
  selectedYears : state.chartsReducer.charts[ownProps.chartId].yearToYear.selectedYears
})

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnYearsToCompareSelectorProps) => ({
  passYearToCompareToStore: (yearsToCompare : string[]) => dispatch(UpdateYearsToCompare(ownProps.chartId, yearsToCompare))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type YearsToCompareSelectorPropsFromRedux = ConnectedProps<typeof connector>

type YearsToCompareSelectorProps = YearsToCompareSelectorPropsFromRedux & OwnYearsToCompareSelectorProps

const YearsToCompareSelector : React.FC<YearsToCompareSelectorProps> = ({chartId, yearToYearProps, selectedYears, passYearToCompareToStore}) => {

    const [yearsToCompare, setYearsToCompare] = useState<string[]>(selectedYears)
    const [errorText, setErrorText] = useState<string>("")

    const handleYearChange = (event: SelectChangeEvent<typeof yearsToCompare>) => {
        console.log("handle year change")
        const {
          target: { value },
        } = event
        if(typeof value === 'string') {
            console.log("new value is just string")
            setYearsToCompare(value.split(','))
            setErrorText("")
        } else {
            if(value.length <= 5) {
                if(value.length > 0) {
                    setYearsToCompare(value)
                    setErrorText("")
                }
            } else {
                setErrorText("Max 5 years allowed!!!")
            }
        }
    }

    useEffect(() => {
        passYearToCompareToStore(yearsToCompare)
    }, [yearsToCompare])

    return (
        <section className={"years-compare-selector-section"}>
            <h4>YEAR SELECTOR</h4>
            <FormControl sx={{ m: 1, width: 200 }}>
                <InputLabel 
                    id="demo-multiple-chip-label"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignContent: "center"
                    }} 
                >
                        Years to compare
                </InputLabel>
                <Select
                    style={{
                        opacity: 1.0,
                        background: "white"
                    }}
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={yearsToCompare}
                    onChange={handleYearChange}
                    input={<OutlinedInput
                        id="select-multiple-chip" 
                        label="Years to compare"
                    />}
                    renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip
                                key={value} 
                                label={value}
                            />
                        ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {years.map((year) => (
                        <MenuItem
                            key={year}
                            value={year}
                        >
                        {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {errorText.length > 0 && <span style={{
                color: "red",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                flexDirection: "column"
            }}>
                {errorText} <Button onClick={() => setErrorText("")} style={{width: "75%"}} variant="info">Clear message</Button>
            </span>}
        </section>
    )
}

export default connector(YearsToCompareSelector)