from app import db
from loguru import logger

class TokenBlacklist(db.Model):
    __tablename__ = 'blacklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(40), unique=True)

    @classmethod
    def find_by_jti(cls, jti):
        return cls.query.filter_by(jti=jti).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return '<TokenBlacklist %r>' % self.jti


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    group = db.Column(db.String(120), nullable=False)
    token = db.Column(db.String(120), nullable=True)

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def __repr__(self):
        return '<User %r>' % self.username

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class Weather(db.Model):
    __tablename__ = 'weather'
    id = db.Column(db.Integer, primary_key=True)
    raceID = db.Column(db.Integer)
    temp_ground = db.Column(db.Float, nullable=False)
    temp_air = db.Column(db.Float, nullable=False)
    weather_des = db.Column(db.String(120), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)

    @classmethod
    def find_by_date(cls, datetime):
        return [x for x in cls.query.filter_by(datetime=datetime).all()]

    @classmethod
    def find_by_id(cls, raceID):
        listData = []
        for entry in cls.query.filter_by(raceID=raceID).all():  # .order_by(desc(cls.datetime))
            listData.append({"temp_ground": entry.temp_ground, "temp_air": entry.temp_air, "datetime": entry.datetime,
                             "weather_des": entry.weather_des})
        logger.debug(listData)
        return listData

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class Wheels(db.Model):
    __tablename__ = 'wheels'
    id = db.Column(db.Integer, primary_key=True)
    raceID = db.Column(db.Integer)
    setnumber = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String, nullable=False)
    cat = db.Column(db.String(120), nullable=False)
    subcat = db.Column(db.String(120), nullable=False)
    air_pressureFL = db.Column(db.Float, nullable=False)
    air_pressureFR = db.Column(db.Float, nullable=False)
    air_pressureBL = db.Column(db.Float, nullable=False)
    air_pressureBR = db.Column(db.Float, nullable=False)
    wheel_idFL = db.Column(db.String(120), nullable=False)
    wheel_idFR = db.Column(db.String(120), nullable=False)
    wheel_idBL = db.Column(db.String(120), nullable=False)
    wheel_idBR = db.Column(db.String(120), nullable=False)
    wheel_editFL = db.Column(db.String(120), nullable=False)
    wheel_editFR = db.Column(db.String(120), nullable=False)
    wheel_editBL = db.Column(db.String(120), nullable=False)
    wheel_editBR = db.Column(db.String(120), nullable=False)

    @classmethod
    def find_by_id(cls, raceID):
        listWheel = []
        for item in cls.query:
            listWheel.append({"id": item.id, "air_pressureFL": item.air_pressureFL,
                              "wheel_editBR": item.wheel_editBR, "wheel_editFR": item.wheel_editFR,
                              "wheel_editBL": item.wheel_editBL, "wheel_editFL": item.wheel_editFL,
                              "air_pressureFR": item.air_pressureFR, "air_pressureBL": item.air_pressureBL,
                              "air_pressureBR": item.air_pressureBR, "air_pressureBL": item.air_pressureBL,
                              "air_pressureFR": item.air_pressureFR, "air_pressureFL": item.air_pressureFL,
                              "status": item.status
                              })
        return listWheel

    @classmethod
    def find_set_by_id(cls, id, set):
        return cls.query.filter_by(groupid=id, set=set).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class Formel(db.Model):
    __tablename__ = 'formel'
    id = db.Column(db.Integer, primary_key=True)
    #raceID = db.Column(db.Integer)
    formel = db.Column(db.String(120), nullable=False)

    @classmethod
    def get_all(cls):
        return [{"n":"Nr.{n} ".format(n),"formel":x.formel} for n, x in enumerate(cls.query)]#.filter_by(raceID=raceID).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

class WheelsStart(db.Model):
    __tablename__ = 'wheels_start'
    id = db.Column(db.Integer, primary_key=True)
    raceID = db.Column(db.Integer)
    set = db.Column(db.Integer, nullable=False)
    cat = db.Column(db.String(120), nullable=False)
    subcat = db.Column(db.String(120), nullable=False)
    identifier = db.Column(db.String(120), nullable=False)
    numberOfSets = db.Column(db.String(120), nullable=False)

    @classmethod
    def find_by_id_cat(cls, raceID, cat):
        return cls.query.filter_by(raceID=raceID, cat=cat).all()

    @classmethod
    def find_set_by_id(cls, raceID, set):
        return cls.query.filter_by(raceID=raceID, set=set).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class WheelsOrder(db.Model):
    __tablename__ = 'wheels_order'
    id = db.Column(db.Integer, primary_key=True)
    raceID = db.Column(db.Integer)
    tyretype = db.Column(db.String(120), nullable=False)
    tyremix = db.Column(db.String(120), nullable=False)
    term = db.Column(db.String(120), nullable=False)
    variant = db.Column(db.String(120), nullable=False)
    number = db.Column(db.String(120), nullable=False)
    orderdate = db.Column(db.String(120), nullable=False)
    ordertime = db.Column(db.String(120), nullable=False)
    pickuptime = db.Column(db.String(120), nullable=False)


    @classmethod
    def find_by_id(cls, raceID):
        return cls.query.filter_by(raceID=raceID).all()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()



class Race_Details(db.Model):
    __tablename__ = 'race_details'
    place = db.Column(db.String(120), nullable=False)
    date = db.Column(db.String, nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(120), nullable=False)

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_all_races(cls):
        return [{"name": "Rennen_{}".format(x.date), "id": x.id} for x in cls.query]

    @classmethod
    def find_by_date(cls, date):
        return [x for x in cls.query.filter_by(date=date).all()]

    @classmethod
    def find_id_by_date(cls, date):
        item = cls.query.filter_by(date=date).first()
        return item.id

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
