from pythermalcomfort.models import pmv_ppd
from pythermalcomfort.utilities import v_relative, clo_dynamic
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
   return 'Hello World'
# tdb - dry bulb air temperature - temperatura zwykła ( powietrza suchego) - dana
# tr - mean radiant temperature - średnia temperatura promieniowania - niewiadoma/dana, można określić w przybliżeniu np. ~tdb_start
# rh - relative humidity - wilgotność względna - dana
# v - air velocity - od 0.1 do 1.0 - niewiadoma, ustalona na stałym poziomie 0.1 w aplikacji React'owej
# met - metabolic rate - ustawiona
# clo - clothing insulation - ustawiona
@app.route('/climateComfort/drybulbtemp=<float:tdb>&radianttemp=<float:tr>&relhum=<float:rh>&airvel=<float:v>&met=<float:met>&clo=<float:clo>')
def climate_comfort_indicators(tdb, tr, rh, v, met, clo):
    v_r = v_relative(v=float(v), met=float(met))
    clo_d = clo_dynamic(clo=float(clo), met=float(met))
    results = pmv_ppd(tdb=tdb, tr=tr, vr=v_r, rh=rh, met=met, clo=clo_d)
    results["Access-Control-Allow-Origin:"] = "*"
    return results

data_to_pass_back = "send this to node process."

api_url = "https://thingspeak.com/channels/202842/field/1/?start=2022-11-11%2010:10:10&end=2022-11-11%2010:12:10"

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print("App started!")
    app.debug = True
    app.run()
    tdb = 25
    tr = 25
    rh = 50
    v = 0.1
    met = 1.4
    clo = 0.5
    v_r = v_relative(v=v, met=met)
    clo_d = clo_dynamic(clo=clo, met=met)
    results = pmv_ppd(tdb=tdb, tr=tr, vr=v_r, rh=rh, met=met, clo=clo_d)
