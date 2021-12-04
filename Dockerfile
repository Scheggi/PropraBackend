FROM python:3

WORKDIR /usr/src/propra

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY .app.py .
COPY .models.py .

CMD [ "python", "./app.py" ]
