import sys
from flask import Flask, jsonify, request, render_template
from pony.flask import Pony
from pony.orm import Database, Required, Optional, db_session, commit, get, select
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config.update(
    PONY={
        'provider': 'sqlite',
        'filename': 'database.sqlite3',
        'create_db': True
    }
)

pony = Pony(app)
db = Database()

class Reservation(db.Entity):
    nositelj_rezervacije = Required(str)  
    broj_osoba = Required(int)
    vrijeme_pocetka = Required(str) 
    trajanje_minute = Required(int) 
    cijena = Required(float)
    popust = Optional(float)  
    vodic = Required(str)

db.bind(provider='sqlite', filename='database.sqlite3', create_db=True)
db.generate_mapping(create_tables=True)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/reservation', methods=['POST'])
@db_session
def add_reservation():
    data = request.json
    reservation = Reservation(
        nositelj_rezervacije=data['nositelj_rezervacije'],
        broj_osoba=data['broj_osoba'],
        vrijeme_pocetka=data['vrijeme_pocetka'],
        trajanje_minute=data['trajanje_minute'],
        cijena=data['cijena'],
        popust=data.get('popust', None), 
        vodic=data['vodic']
    )
    commit()
    return jsonify(id=reservation.id), 201

@app.route('/reservation/<int:reservation_id>', methods=['GET'])
@db_session
def get_reservation(reservation_id):
    if reservation_id == 0:
        reservations = select(r for r in Reservation)
        result = [{"id": r.id, "nositelj_rezervacije": r.nositelj_rezervacije, "vodic": r.vodic, "trajanje_minute": r.trajanje_minute} for r in reservations]
        return jsonify(result)
    
    reservation = Reservation.get(id=reservation_id)
    if reservation:
        ukupna_cijena = reservation.cijena * (1 - reservation.popust/100)
        return jsonify({
            "id": reservation.id,
            "nositelj_rezervacije": reservation.nositelj_rezervacije,
            "broj_osoba": reservation.broj_osoba,
            "vrijeme_pocetka": reservation.vrijeme_pocetka,
            "trajanje_minute": reservation.trajanje_minute,
            "cijena": reservation.cijena,
            "popust": reservation.popust,
            "vodic": reservation.vodic,
            "ukupna_cijena": ukupna_cijena
        })
    else:
        return jsonify({"error": "Reservation not found"}), 404

@app.route('/reservation/<int:reservation_id>', methods=['PUT'])
@db_session
def update_reservation(reservation_id):
    reservation = get(r for r in Reservation if r.id == reservation_id)
    if not reservation:
        return jsonify(error="Reservation not found"), 404

    data = request.json
    reservation.nositelj_rezervacije = data['nositelj_rezervacije']
    reservation.broj_osoba = data['broj_osoba']
    reservation.vrijeme_pocetka = data['vrijeme_pocetka']
    reservation.trajanje_minute = data['trajanje_minute']
    reservation.cijena = data['cijena']
    reservation.popust = data.get('popust', reservation.popust)
    reservation.vodic = data['vodic']

    commit()
    return jsonify(success=True), 200

@app.route('/reservation/<int:reservation_id>', methods=['DELETE'])
@db_session
def delete_reservation(reservation_id):
    reservation = get(r for r in Reservation if r.id == reservation_id)
    if not reservation:
        return jsonify(error="Reservation not found"), 404
    reservation.delete()
    commit()
    return jsonify(success=True), 200


if __name__ == '__main__':
    print(sys.version)
    db.bind(**app.config['PONY'])
    db.generate_mapping(create_tables=True)
    app.run(debug=True)

