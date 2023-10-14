# README

TODOs

* "(client-side calculation not implemented yet)" thing
* TypeScript
* Test code for JavaScript/TypeScript

## Development

```
docker-compose up -d yaichi && docker-compose up --build generic-factory-game
```

or run background like this:

```
docker-compose build generic-factory-game
docker-compose up -d yaichi generic-factory-game
docker-compose logs generic-factory-game
```


## Dockerfile and docker-compose.yml

|                  | local| CI  | deploy |
|------------------|------|-----|--------|
|Dockerfile        | YES  | NO  | NO     |
|docker-compose.yml| YES  | NO  | NO     |


# Licence

AS-IS
