import "./Header.min.css"

const Header = () => {
    return (
        <header id="App-header">
            <div id="App-title">
                Laboratorium 2.7.14 BT - wizualizacja danych
            </div>
            <div id="HighCharts">
                <a href="https://www.highcharts.com/"> 
                    <img alt="Highcharts homepage" src="https://wp-assets.highcharts.com/svg/highcharts-logo.svg"/> 
                </a>
                (With HighCharts Support)
            </div>
        </header>
    )
}

export default Header