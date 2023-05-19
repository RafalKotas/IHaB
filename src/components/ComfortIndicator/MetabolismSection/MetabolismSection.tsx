import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

export const metabolicRates = {
    "SLEEPING": 0.7,
    "RECLINING": 0.8,
    "SEATED, QUIET": 1.0,
    "READING, SEATED": 1.0,
    "WRITING": 1.0,
    "TYPING": 1.1,
    "STANDING, RELAXED": 1.2,
    "FILING, SEATED": 1.2,
    "FLYING AIRCRAFT, ROUTINE": 1.2,
    "FILLING, STANDING": 1.4,
    "DRIVING A CAR": 1.5,
    "WALKING ABOUT": 1.7,
    "COOKING": 1.8,
    "TABLE SAWING": 1.8,
    "WALKING 2MPH (3.2km/h)": 2.0,
    "LIFTING/PACKING": 2.1,
    "SEATED, HEAVY LIMB MOVEMENT": 2.2,
    "LIGHT MACHINE WORK": 2.2,
    "FLYING AIRCRAFT, COMBAT": 2.4,
    "WALKING 3MPH (4.8km/h)": 2.6,
    "HOUSE LEANING": 2.7,
    "DRIVING, HEAVY VEHICLE": 3.2,
    "DANCING": 3.4,
    "CALISTHENICS": 3.5,
    "WALKING 4MPH (6.4km/k)": 3.8,
    "TENNIS": 3.8,
    "HEAVY MACHINE WORK": 4.0,
    "HANDLING 100lb (45 kg) bags": 4.0
}

export type metabolicRatesKeys = keyof typeof metabolicRates

interface MetabolismSectionProps {
    metabolicProduction: metabolicRatesKeys,
    onChangeFunc: (metabolic: metabolicRatesKeys) => void
}

const MetabolismSection: React.FC<MetabolismSectionProps> = ({ metabolicProduction, onChangeFunc }) => {

    const handleMetabolicChange = (event: SelectChangeEvent) => {
        onChangeFunc(event.target.value as metabolicRatesKeys)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="select-label-metabolic">Metabolic</InputLabel>
        <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={metabolicProduction}
            onChange={handleMetabolicChange}
            style={{
                backgroundColor: "white"
            }}
        >
            {
                Object.entries(metabolicRates).map(([activity]) => {
                    return <MenuItem value={activity}>
                        <em>{activity}</em>
                    </MenuItem>
                })
            }
        </Select>
      </FormControl>)
}

export default MetabolismSection