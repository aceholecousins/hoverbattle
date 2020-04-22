/// <reference path="assets.d.ts" />

//This module imports all assets in the webpack way. This is in order to not marry webpack with the whole application.
//Assets are grouped by type (not file type).
//Other TS modules should reference files by importing this module and using the exported objects
import screen from './index.html'
import style from './style.css'

let Html = {
	screen,
}
let Css = {
	style
}
let Images = {

}

export {Html, Css, Images}