// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

// react bootstrap
import { OverlayTrigger, ToggleButton, ToggleButtonGroup, Tooltip } from "react-bootstrap"

// redux
import { ChangeChartDataSource, dataSources, fieldsAvailable } from "../../../store/charts"
import { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { AppState } from "../../../store"

// styles
import "./chartDataSelectPanel.css"

interface OwnChartDataSourceSelectProps {
  chartId: string
}

const mapStateToProps = (state: AppState, ownProps : OwnChartDataSourceSelectProps) => ({
  chartDetails : state.chartsReducer.charts[ownProps.chartId],
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateChartDataSource: (chartId: string, updatedChartType : dataSources) => 
  dispatch(ChangeChartDataSource(chartId, updatedChartType)),
})

const connector = connect(mapStateToProps, mapDispatchToProps)
  
type ChartDataSourceSelectPropsFromRedux = ConnectedProps<typeof connector>
  
type ChartDataSourceSelectProps = ChartDataSourceSelectPropsFromRedux & OwnChartDataSourceSelectProps

const ChartDataSelectPanel : React.FC<ChartDataSourceSelectProps> = ({chartId, chartDetails, updateChartDataSource}) => {

    const updateChartSourceDataOnClick = (dataSourceName : dataSources) => {

      updateChartDataSource(chartId, dataSourceName)
    }
  
    const renderTooltip = (description : string) => (
      <Tooltip id="button-tooltip">
        {description}
      </Tooltip>
    )

    return (
          <ToggleButtonGroup 
            type="radio"
            name="dataSources"
            defaultValue={fieldsAvailable[0].name}
            className="aside-panel" 
            vertical
            value={chartDetails.chartDataSource}
          >
              {
                fieldsAvailable.map((fieldProperties, index) => {
                  return <OverlayTrigger
                      placement="top"
                      delay={{ show: 100, hide: 100 }}
                      overlay={renderTooltip(fieldProperties.description)}
                    >
                      <ToggleButton
                          type="radio"
                          variant="primary"
                          className={"data-source-btn"}
                          value={fieldProperties.name as dataSources}
                          checked={chartDetails.chartDataSource === fieldProperties.name}
                          onClick={() => {
                            updateChartSourceDataOnClick(fieldProperties.name as dataSources)
                          }}
                      >
                        <React.Fragment>
                          {fieldProperties.abbreviation} &nbsp; <FontAwesomeIcon style={{fontSize: 12}} icon={fieldProperties.fasIcon} />
                        </React.Fragment>
                      </ToggleButton>
                    </OverlayTrigger>
                })
              }
          </ToggleButtonGroup>
    )
}

export default connector(ChartDataSelectPanel)