# README

TODOs

* "(client-side calculation not implemented yet)" thing
* TypeScript
* Test code for JavaScript/TypeScript

## Development

Use yaichi for your locak dev env

```
docker-compose up -d yaichi generic-factory-game
```

or run foreground like this:

```
docker-compose up -d yaichi
docker-compose up generic-factory-game
```

## Dockerfile and docker-compose.yml

|                  | local| CI  | deploy |
|------------------|------|-----|--------|
|Dockerfile        | YES  | YES | WILL BE|
|docker-compose.yml| YES  | NO  | NO     |


# Licence

AS-IS

## MEMO

```
$ time git push heroku master
...
real    6m31.569s
user    0m0.078s
sys     0m0.108s
```
