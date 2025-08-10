# HoverBattle
AceChase Remastered

## Play

[click me!](https://aceholecousins.github.io/hoverbattle/)

## Develop

```sh
# install nvm, node.js and npm
# https://nodejs.org/en/download/package-manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22

# clone game
git clone https://github.com/aceholecousins/hoverbattle.git
cd hoverbattle

# install dependencies
npm install

# build and run game
npm run dev-build
# or
npm run watch
# or
npm run build

cd dist && python3 -m http.server

xdg-open http://localhost:8000

# unit tests
npm run test
```
