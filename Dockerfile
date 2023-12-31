FROM python:3.10-slim

WORKDIR /app

COPY . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 5000

ENV FLASK_ENV=production

CMD ["flask", "run", "--host=0.0.0.0"]
