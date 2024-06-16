# headless-detect

First u should do 
```bash
bun run build1
```
<!-- ```bash
bun run build2
``` -->

To install dependencies:

```bash
bun install
```

Create `logs` folder and `temp` for nginx. (I dont know why nginx not in docker-compose, soryy)

To run:
```bash
nginx -c server.conf
```

```bash
bun run start
```

Visit your http://localhost and check or look at console to see what headless pupputer will show.

вообще очень какое-то странное решение сделал через nginx, обычно он через docker-compose разворачивается и все настройки и файлы уже через него передаются


This project was created using `bun init` in bun v1.1.13. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
