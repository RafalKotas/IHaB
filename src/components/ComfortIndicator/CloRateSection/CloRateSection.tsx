import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

export const cloRates = {
    "Walking shorts, short-sleeve shirt": 0.36,
    "Typical summer indoor clothing": 0.5,
    "Knee-length skirt, short-sleeve shirt, sandals, underwear": 0.54,
    "Trousers, short-sleeve shirt, socks, shoes, underwear": 0.57,
    "Trousers, long-sleeve shirt": 0.61,
    "Knee-length skirt, long-sleeve shirt, full slip": 0.67,
    "Sweat pants, long-sleeve shirt": 0.96,
    "Typical winter indoor clothing": 1.0
}

export type cloRatesKeys = keyof typeof cloRates

interface CloRateSectionProps {
    cloProduction: cloRatesKeys,
    onChangeFunc: (clo: cloRatesKeys) => void
}

const CloRateSection: React.FC<CloRateSectionProps> = ({ cloProduction, onChangeFunc }) => {

    const handleCloChange = (event: SelectChangeEvent) => {
        onChangeFunc(event.target.value as cloRatesKeys)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select-label-clo-rate">Clo rate</InputLabel>
        <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={cloProduction}
            onChange={handleCloChange}
            style={{
                backgroundColor: "white"
            }}
        >
            {
                Object.entries(cloRates).map(([cloSet]) => {
                    return <MenuItem value={cloSet}>
                        <em>{cloSet}</em>
                    </MenuItem>
                })
            }
        </Select>
      </FormControl>)
}

export default CloRateSection