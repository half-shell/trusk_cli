
- [Trusk<sub>CLI</sub>](#org0907f26)
  - [Getting started:](#org3c01509)


<a id="org0907f26"></a>

# Trusk<sub>CLI</sub>


<a id="org3c01509"></a>

## Getting started:

```bash
npm install
# Start a redis server in a docker container
docker run -p"6379:6379" --name truskCLI-redis redis-server --appendonly yes
# Start the CLI
npm start
```