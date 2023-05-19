import React, { useEffect, useState } from "react"

import Select, { ActionMeta, InputActionMeta, MultiValue, OnChangeValue } from "react-select"
import makeAnimated from "react-select/animated"

const animatedComponents = makeAnimated()

interface yearEntry {
    value: string,
    label: string
}

export interface ISelectOption {
  value: string,
  label: string
}

interface AnimatedYearSelectorProps {
  passSelectedYearsToParent: (years : string[]) => void
}

export type isMultiType = true | false

const AnimatedYearSelector : React.FC<AnimatedYearSelectorProps> = ({passSelectedYearsToParent}) => {

    const [selectedYears, setSelectedYears] = useState<MultiValue<yearEntry>>([{ value: "2022", label: "2022" }])

    const yearOptions = [
        { value: "2010", label: "2010" },
        { value: "2011", label: "2011" },
        { value: "2012", label: "2012" },
        { value: "2013", label: "2013" },
        { value: "2014", label: "2014" },
        { value: "2015", label: "2015" },
        { value: "2016", label: "2016" },
        { value: "2017", label: "2017" },
        { value: "2018", label: "2018" },
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
    ]

    const handleSelectionChange = (
      newSelections: MultiValue<yearEntry>,
      actionMeta: ActionMeta<yearEntry>
  ) => {
    setSelectedYears(newSelections)
  }

  useEffect(() => {
    let years = selectedYears.map((yearEntry) => {
      return yearEntry.value
    }).sort()
    console.log(years)
    passSelectedYearsToParent(years)
  }, [selectedYears])

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      defaultValue={selectedYears}
      value={selectedYears}
      isMulti
      options={yearOptions}
      onChange={handleSelectionChange}
    />
  );
}

export default AnimatedYearSelector