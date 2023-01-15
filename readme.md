
# Sistem Presensi RFID

Server HTTP untuk sistem presensi rfid, meggunakan API untuk komunikasi antara IOT server denga database maupun client



## API Endpoint

| Methode             | Route         | Action                                                       |
| ----------------- | -------------- | -------------
| GET | /api/presensi/do | Create presensi
| GET | /api/presensi | Get presensi list
| PUT | /api/presensi  | Update presensi
| DELETE | /api/presensi | Delete presensi
| POST | /api/login | Login account
| GET | /api/detail | Get detail account
| DELETE | /api/logout | Logout account
| POST | /api/user | Add new user or account
| GET | /api/user | Get all user or accont
| PUT | /api/user | Update user or account
| DELETE | /api/user | Delete user or account
| POST | /api/hour | Create hour
| GET | /api/hour | Get hour
| PUT | /api/hour | Update hour
| DELETE | /api/hour | Delete hour
| GET | /api/rfid/do | Save new RFID
| DELETE | /api/rfid/delete | Delete RFID
| GET | /api/rfid/all  | Get all RFID


## Running Tests

To run tests, run the following command

```bash
  yarn test
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/an-halim/Sistem-Presensi-RFID-HTTP-Server
```

Go to the project directory

```bash
  cd Sistem-Presensi-RFID-HTTP-Server
```

Install dependencies

```bash
  yarn Install
```

Start the server

```bash
  yarn start
```


## Tech Stack


**Server:** Node, Express, Sequelize, Mysql


## License

[MIT](https://github.com/an-halim/Sistem-Presensi-RFID-HTTP-Server/blob/master/LICENSE)

