<h2>Установка</h2>

Создайте файл .env по примеру с .env.example

В нём заполните все поля. UPLOAD_DIR - абсолютный путь

Запускает докер
```
docker-compose up --build
```
либо через ide


<h3>Пример .env файла для докера</h3>

```
NODE_ENV = 'develop'

DB_HOST='mysql_test'
DB_PORT='3306'
DB_USERNAME='my_user'
DB_PASSWORD='my_password'
DB_DATABASE='my_database'

APP_PORT = '3000'

UPLOAD_DIR = 'абсолютный_путь'
UPLOAD_MAX_FILE_SIZE = '10485760'

REDIS_URL= 'redis://redis_test:6379'
```
